/* global gid, selected_link, selected_tag */
GM_addStyle(':root {--color1: #5C3C2C;--color2: #E3E0D1;--color3: #edebdf;--color4: #aea5a5;} body {padding: 0 !important}');
loadScriptMenu('EhentaiUserSetting', {
  漫画阅读: {
    Enable: true,
    双页显示: true,
    页面填充: true,
    点击翻页: false,
    阅读进度: true,
    夜间模式: true,
  },
  nhentai匹配: {
    Enable: true,
    漫画: true,
    Tag: true,
  },
  Version: GM_info.script.version,
});
const imgList = {ehentai: []};

// 判断当前页是否是漫画详情页
if (typeof gid !== 'undefined') {
  if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
    appendDom(document.getElementById('gd5'), '<p class="g2 gsp"><img src="https://exhentai.org/img/mr.gif"><a id="comicReadMode" href="javascript:;"> Load comic</a></p>');
    let loadLock = false;
    document.getElementById('comicReadMode').addEventListener('click', function () {
      const comicReadModeDom = document.getElementById('comicReadMode');
      if (!imgList.ehentai.length) {
        const imgTotalNum = parseInt(document.querySelectorAll('#gdd tbody tr td.gdt2')[5].innerHTML);
        const getImgUrl = html => html.split('id="img" src="')[1].split('"')[0];
        const nextRe = /id="next" .*? href="(.+?)(?=")/;
        let loadImgNum = 0;

        // 递归循环获取图源
        const Loop = function (url, i) {
          GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload (xhr) {
              if (xhr.status === 200) {
                const img = document.createElement('img');
                img.src = getImgUrl(xhr.responseText);
                img.onload = () => {
                  if (++loadImgNum === imgTotalNum)
                    comicReadModeDom.innerHTML = ' Read';
                  else
                    comicReadModeDom.innerHTML = ` loading —— ${loadImgNum}/${imgTotalNum}`;
                };
                imgList.ehentai[i] = img;
                const nextUrl = nextRe.exec(xhr.responseText)[1];
                if (nextUrl === xhr.finalUrl)
                  loadLock = true;
                else
                  Loop(nextUrl, i + 1);
              } else
                throw `${xhr.status}:${url}`;
            },
          });
        };
        comicReadModeDom.innerHTML = ` loading —— 0/${imgTotalNum}`;
        Loop(`https://exhentai.org/s/${document.querySelector('#gd1 div').style.backgroundImage.split('/')[6].slice(0, 10)}/${gid}-1`, 0);
      } else if (loadLock && (!comicReadModeDom.innerHTML.includes('loading') || confirm('图片未加载完毕，确认要直接进入阅读模式？'))) {
        loadComicReadWindow({
          comicImgList: imgList.ehentai,
          readSetting: ScriptMenu.UserSetting['漫画阅读'],
          EndExit: () => scrollTo(0, getTop(document.getElementById('cdiv'))),
          comicName: document.getElementById('gj').innerHTML ? document.getElementById('gj').innerHTML : document.getElementById('gn').innerHTML,
        });
        ComicReadWindow.PageNum = 0;
        ComicReadWindow.start();
      }
    });
  }

  let nHentaiComicInfo;
  if (ScriptMenu.UserSetting['nhentai匹配']['漫画']) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://nhentai.net/api/galleries/search?query=${document.getElementById('gn').innerHTML.replace(/ /g, '+')}`,
      onload (xhr) {
        if (xhr.status === 200) {
          nHentaiComicInfo = JSON.parse(xhr.responseText);

          // 构建新标签行
          const newTagLine = document.createElement('tr');
          if (nHentaiComicInfo.result.length) {
            let temp = '<td class="tc">nhentai:</td><td>';
            let i = nHentaiComicInfo.result.length;
            while (i--) {
              const tempComicInfo = nHentaiComicInfo.result[i];
              temp += `<div id="td_nhentai:${tempComicInfo.id}" class="gtl" style="opacity:1.0" title="${tempComicInfo.title.hasOwnProperty('japanese') ? tempComicInfo.title.japanese : tempComicInfo.title.english}"><a href="https://nhentai.net/g/${tempComicInfo.id}/" index=${i} onclick="return toggle_tagmenu('nhentai:${tempComicInfo.id}',this)">${tempComicInfo.id}</a></a></div>`;
            }
            newTagLine.innerHTML = `${temp}</td>`;
          } else
            newTagLine.innerHTML = '<td class="tc">nhentai:</td><td class="tc" style="text-align: left;">Null</td>';

          document.querySelector('#taglist tbody').appendChild(newTagLine);
        }
      },
    });
  }

  // 重写 _refresh_tagmenu_act 函数，加入脚本的功能
  unsafeWindow._refresh_tagmenu_act = function (a, b) {
    const tagmenu_act_dom = document.getElementById('tagmenu_act');
    if (a.includes('nhentai:')) {
      tagmenu_act_dom.innerHTML = `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="${b.href}" target="_blank"> Jump to nhentai</a>`;
      if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
        tagmenu_act_dom.innerHTML += `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="#"> ${imgList[selected_tag] ? 'Read' : 'Load comic'}</a>`;
        const comicReadModeDom = tagmenu_act_dom.querySelector('a[href="#"]');
        let loadLock = false;
        // 加载 nhentai 漫画
        comicReadModeDom.addEventListener('click', function (e) {
          e.preventDefault();
          const tempComicInfo = nHentaiComicInfo.result[selected_link.getAttribute('index')];
          const imgTotalNum = tempComicInfo.num_pages;

          if (!imgList[selected_tag]) {
            comicReadModeDom.innerHTML = ` loading —— 0/${imgTotalNum}`;
            // 用于转换获得图片文件扩展名的 dict
            const fileType = {
              j: 'jpg',
              p: 'png',
            };
            let loadImgNum = 0;
            imgList[selected_tag] = [];

            for (let i = 0; i < imgTotalNum; i++) {
              const img = document.createElement('img');
              img.src = `https://i.nhentai.net/galleries/${tempComicInfo.media_id}/${i + 1}.${fileType[tempComicInfo.images.pages[i].t]}`;
              img.onload = () => {
                if (++loadImgNum === imgTotalNum)
                  comicReadModeDom.innerHTML = ' Read';
                else
                  comicReadModeDom.innerHTML = ` loading —— ${loadImgNum}/${imgTotalNum}`;
              };
              imgList[selected_tag][i] = img;
            }
            loadLock = true;
          } else if (loadLock && (!comicReadModeDom.innerHTML.includes('loading') || confirm('图片未加载完毕，确认要直接进入阅读模式？'))) {
            loadComicReadWindow({
              comicImgList: imgList[selected_tag],
              readSetting: ScriptMenu.UserSetting['漫画阅读'],
              EndExit: () => scrollTo(0, getTop(document.getElementById('cdiv'))),
              comicName: tempComicInfo.title.hasOwnProperty('japanese') ? tempComicInfo.title.japanese : tempComicInfo.title.english,
            });
            ComicReadWindow.PageNum = 0;
            ComicReadWindow.start();
          }
        });
      }
    } else {
      let temp = '';
      if (b.className !== 'tup')
        temp += ` <img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_vote_up(); return false">${b.className === '' ? 'Vote Up' : 'Withdraw Vote'}</a>`;
      if (b.className !== 'tdn')
        temp += ` <img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_vote_down(); return false">${b.className === '' ? 'Vote Down' : 'Withdraw Vote'}</a>`;
      temp += '<img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_show_galleries(); return false">Show Tagged Galleries</a><img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_define(); return false">Show Tag Definition</a><img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> ';

      if (ScriptMenu.UserSetting['nhentai匹配'].Tag) {
        const tag = selected_link.id.slice(3).split(':');
        if (tag.length === 1)
          temp += `<a href="https://nhentai.net/tag/${tag[0].replace(/_/g, '-')}" target="_blank">Search nhentai</a>`;
        else
          temp += `<a href="https://nhentai.net/${tag[0] === 'female' ? 'tag' : tag[0]}/${tag[1].replace(/_/g, '-')}" target="_blank">Search nhentai</a>`;
      } else
        temp += '<a href="#" onclick="toggle_tagmenu(undefined, undefined); return false">Add New Tag</a>';
      tagmenu_act_dom.innerHTML = temp;
    }
  };
}
