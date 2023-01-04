import { insertNode } from '../helper';
import { useInit } from '../helper/useInit';

/* eslint-disable camelcase */
declare const obj_id: string;

(async () => {
  const { options, showFab, setManga, createShowComic } = await useInit(
    'dmzj',
    {
      在新页面中打开链接: true,
      解除吐槽的字数限制: true,
      自动进入漫画阅读模式: true,
    },
  );

  // 分别处理目录页和漫画页
  switch (window.location.pathname.split('/')[1]) {
    case 'info': {
      if (typeof obj_id === 'undefined') {
        const comicId = parseInt(window.location.pathname.split('/')[2], 10);
        if (Number.isNaN(comicId)) {
          document.body.innerHTML =
            '请从 <a href="https://dmzj.nsapps.cn/">https://dmzj.nsapps.cn/</a> 搜索漫画进入';
        } else {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `http://v3api.dmzj.com/comic/comic_${comicId}.json`,
            onload: (xhr) => {
              if (xhr.status === 200) {
                try {
                  let temp = '';
                  const Info = JSON.parse(xhr.responseText);
                  const { chapters, last_updatetime } = Info;
                  for (let ci = 0; ci < chapters.length; ci++) {
                    temp += `<h2>${Info.title}：${chapters[ci].title}</h2>`;
                    const chaptersList = chapters[ci].data;
                    {
                      let i = chaptersList.length;
                      while (i--)
                        temp += `<a target="_blank" title="${
                          chaptersList[i].chapter_title
                        }" href="https://m.dmzj.com/view/${comicId}/${
                          chaptersList[i].chapter_id
                        }.html" ${
                          chaptersList[i].updatetime === last_updatetime
                            ? 'style="color:red"'
                            : ''
                        }>${chaptersList[i].chapter_title}</a>`;
                    }
                  }
                  insertNode(document.body, temp);
                } catch (error: any) {
                  if (error.name !== 'SyntaxError') throw error;
                  insertNode(document.body, xhr.responseText);
                }
              }
            },
          });
          document.body.removeChild(document.body.childNodes[0]);
          GM_addStyle(
            'body{padding:0 20vw;} a{margin:0 1em;line-height:2em;white-space:nowrap;display:inline-block;min-width:4em;}',
          );
        }
      }
      break;
    }
    case 'view': {
      if (unsafeWindow.comic_id) {
        GM_addStyle('.subHeader{display:none !important}');
        const comicImgList = [
          ...document.querySelectorAll('#commicBox img'),
        ].map((img) => {
          img.setAttribute('src', img.getAttribute('data-original')!);
          return img;
        });
        // TODO: 进入阅读模式
        // loadComicReadWindow({
        //   comicImgList,
        //   readSetting: ScriptMenu.UserSetting['漫画阅读'],
        //   comicName: document.title,
        //   nextChapter: unsafeWindow.mReader.nextBtnAction,
        //   prevChapter: unsafeWindow.mReader.prevBtnAction,
        // });
        // ComicReadWindow.start();
      } else {
        GM_addStyle(
          'body{display:flex;margin:0;flex-direction:column;align-items:center}body.hide img{display:none}img{max-width:95%;margin:1em 0}#comicRead{order:9999}',
        );
        document.body.removeChild(document.body.childNodes[0]);
        document.body.className = 'hide';
        const loadText = document.createElement('p');
        loadText.innerText = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
        document.body.appendChild(loadText);
        GM_xmlhttpRequest({
          method: 'GET',
          url: `http://v3api.dmzj.com/chapter/${
            /\d+\/\d+/.exec(document.URL)![0]
          }.json`,
          onload: (xhr) => {
            if (xhr.status === 200) {
              let Info;
              try {
                Info = JSON.parse(xhr.responseText);
                document.title = Info.title;
                const blobList = [] as any[];
                let loadImgNum = 0;
                let imgTotalNum = Info.picnum;

                if (imgTotalNum) {
                  const loadImg = (index: number) => {
                    GM_xmlhttpRequest({
                      method: 'GET',
                      url: Info.page_url[index],
                      headers: { Referer: 'http://images.dmzj.com/' },
                      responseType: 'blob',
                      onload: (res) => {
                        if (res.status === 200) {
                          blobList[index] = [
                            res.response,
                            res.finalUrl.split('.').pop(),
                          ];
                          if (++loadImgNum === imgTotalNum) {
                            const tempDom = document.createDocumentFragment();
                            for (let i = 0; i < imgTotalNum; i++)
                              insertNode(
                                tempDom,
                                `<img src="${URL.createObjectURL(
                                  blobList[i][0],
                                )}">`,
                              );
                            document.body.appendChild(tempDom);
                            // 等待图片全部加载完毕在进行其他操作
                            const checkLoad = () => {
                              const imgList = [
                                ...document.getElementsByTagName('img'),
                              ];
                              if (imgList.every((e) => e.complete)) {
                                document.body.removeChild(loadText);
                                // TODO: 进入漫画阅读模式
                                // loadComicReadWindow({
                                //   comicImgList: imgList,
                                //   readSetting:
                                //     ScriptMenu.UserSetting['漫画阅读'],
                                //   comicName: document.title,
                                //   blobList,
                                // });
                                // ComicReadWindow.start();
                                // document.body.className = '';
                                // GM_registerMenuCommand(
                                //   '进入漫画阅读模式',
                                //   ComicReadWindow.start,
                                // );
                              } else setTimeout(checkLoad, 100);
                            };
                            setTimeout(checkLoad, 100);
                          } else
                            loadText.innerText = `正在加载中，请坐和放宽，若长时间无反应请刷新页面。目前已加载${loadImgNum}/${imgTotalNum}`;
                        } else loadImg(index);
                      },
                    });
                  };
                  let i = Info.picnum;
                  while (i--) loadImg(i);
                } else {
                  loadText.innerText =
                    '正常接口未返回具体图片数据，开始通过下载接口获取数据';
                  GM_xmlhttpRequest({
                    method: 'GET',
                    responseType: 'blob',
                    url: `https://imgzip.dmzj.com/s/${
                      /\d+\/\d+/.exec(document.URL)![0]
                    }.zip`,
                    onload: (res) => {
                      if (res.status === 200) {
                        const zip = new JSZip();
                        const tempDom = document.createDocumentFragment();
                        zip.loadAsync(res.response).then((zip) => {
                          loadText.innerText = '解压中';
                          imgTotalNum = Object.keys(zip.files).length;
                          let imgNum = 0;
                          Object.values(zip.files).forEach((zipData) => {
                            const order = zipData.name.split('.')[0];
                            zipData.async('blob').then((imgBlob) => {
                              insertNode(
                                tempDom,
                                `<img order=${order} src="${URL.createObjectURL(
                                  imgBlob,
                                )}">`,
                              );
                              imgNum += 1;
                              if (imgNum === imgTotalNum) {
                                document.body.appendChild(tempDom);
                                // 等待图片全部加载完毕在进行其他操作
                                const checkLoad = () => {
                                  const imgList = [
                                    ...document.getElementsByTagName('img'),
                                  ].sort(
                                    (a, b) =>
                                      Number(a.getAttribute('order')) -
                                      Number(b.getAttribute('order')),
                                  );
                                  if (imgList.every((e) => e.complete)) {
                                    document.body.removeChild(loadText);
                                    // TODO: 进入漫画阅读模式
                                    // loadComicReadWindow({
                                    //   comicImgList: imgList,
                                    //   readSetting:
                                    //     ScriptMenu.UserSetting['漫画阅读'],
                                    //   comicName: document.title,
                                    //   blobList,
                                    // });
                                    // ComicReadWindow.start();
                                    // document.body.className = '';
                                    // GM_registerMenuCommand(
                                    //   '进入漫画阅读模式',
                                    //   ComicReadWindow.start,
                                    // );
                                  } else setTimeout(checkLoad, 100);
                                };
                                setTimeout(checkLoad, 100);
                              }
                            });
                          });
                        });
                      }
                    },
                  });
                }
              } catch (error) {
                loadText.innerText = xhr.responseText;
              }
            }
          },
        });
      }
      break;
    }
  }
})();
