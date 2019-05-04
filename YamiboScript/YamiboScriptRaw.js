/* global fid, tid, ajaxget */
GM_addStyle(':root {--color1:#6E2B19;--color2:#FFEEBA;--color3:#FFF5D7;--color4:#DBC38C;} @@YamiboScript.css@@');
loadScriptMenu('UserSetting', {
  漫画阅读: {
    Enable: true,
    双页显示: true,
    页面填充: true,
    点击翻页: false,
    阅读进度: true,
    夜间模式: false,
  },
  记录阅读历史: {
    Enable: true,
    上次阅读进度标签颜色: '#6e2b19',
    保留天数: -1,
  },
  体验优化: {
    Enable: true,
    关闭快捷导航的跳转: true,
    修正点击页数时的跳转判定: true,
    固定导航条: true,
    自动进入漫画阅读模式: true,
  },
  Version: GM_info.script.version,
});


if (ScriptMenu.UserSetting['体验优化']['关闭快捷导航的跳转'])
  document.querySelector('#qmenu a').setAttribute('href', 'javascript:;');
if (ScriptMenu.UserSetting['体验优化']['固定导航条'])
  document.getElementsByClassName('header-stackup')[0].style.position = 'fixed';

// 判断当前页是帖子
if (RegExp('thread(-\\d+){3}|mod=viewthread').test(document.URL)) {
  // 启用漫画阅读模式
  if (fid === 30 && ScriptMenu.UserSetting['漫画阅读'].Enable) {
    // 有目录
    const hasMenu = Boolean(document.getElementById('threadindex'));

    /**
     * 对页面进行处理以启用漫画阅读模式
     *
     */
    const procImg = () => {
      const comicImgList = document.querySelectorAll('.t_fsz img');
      let i = comicImgList.length;
      while (i--) {
        if (comicImgList[i].getAttribute('file'))
          comicImgList[i].setAttribute('src', comicImgList[i].getAttribute('file'));
        if (comicImgList[i].src.includes('static/image'))
          comicImgList.splice(i, 1);
        else if (comicImgList[i].getAttribute('src').indexOf('http') !== 0)
          comicImgList[i].setAttribute('src', `${location.protocol}//${location.host}/${comicImgList[i].getAttribute('src')}`);
      }

      if (!comicImgList.length)
        return;

      /**
       * 检查图片加载情况，顺便删掉宽高小于 500 像素的图片
       *
       * @param {boolean} [loop=false] 需要循环检测图片加载情况时为 True
       * @returns {boolean} 图片加载情况
       */
      const checkImgLoad = (loop = false) => {
        let i = comicImgList.length;
        const tempImgList = comicImgList;
        while (i--) {
          if (!tempImgList[i].complete) {
            if (loop) {
              setTimeout(checkImgLoad, 300, true);
              return;
            }
            return false;
          } else if (tempImgList[i].height < 500 && tempImgList[i].width < 500)
            comicImgList.splice(i, 1);
        }
        if (loop)
          document.getElementById('comicReadMode').click();
        else
          return true;
      };

      if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
        setTimeout(checkImgLoad, 0, true);

      appendDom(document.querySelector('div.pti > div.authi'), '<span class="pipe show">|</span><a id="comicReadMode" class="show" href="javascript:;">漫画阅读</a>');
      document.getElementById('comicReadMode').addEventListener('click', event => {
        event.stopImmediatePropagation();
        if (hasMenu || ComicReadWindow === undefined) {
          loadComicReadWindow({
            comicImgList,
            readSetting: ScriptMenu.UserSetting['漫画阅读'],
            EndExit: () => scrollTo(0, getTop(document.getElementsByClassName('psth').length ? document.getElementsByClassName('psth')[0] : [...document.querySelectorAll('.pcb>div:first-of-type')].find(e => e.clientHeight < 2000))),
            comicName: document.getElementById('thread_subject').innerHTML,
          });

          // 通过标签确定上/下一话
          if (document.querySelector('.ptg.mbm.mtn>a')) {
            const findNext = (pageNum) => {
              GM_xmlhttpRequest({
                method: 'GET',
                url: `https://bbs.yamibo.com/misc.php?mod=tag&id=${document.querySelector('.ptg.mbm.mtn>a').href.split('id=')[1]}&type=thread&page=${pageNum}`,
                onload: (data) => {
                  const reg = /<th>\s<a href="thread-(\d+)(?=-)/g;
                  let nowTid;
                  let lastTid;
                  while ((nowTid = reg.exec(data.responseText)) !== null) {
                    if (lastTid && Number(nowTid[1]) === tid) {
                      ComicReadWindow.prevChapter = `thread-${lastTid}-1-1.html`;
                      ComicReadWindow.nextChapter = (nowTid = reg.exec(data.responseText)) === null ? null : `thread-${nowTid[1]}-1-1.html`;
                      break;
                    } else
                      lastTid = nowTid[1];
                  }
                  if (!ComicReadWindow.prevChapter)
                    findNext(pageNum + 1);
                },
              });
            };
            findNext(1);
          }
        }
        if (checkImgLoad() || confirm('图片未加载完毕，确认要直接进入阅读模式？'))
          ComicReadWindow.start();
      });
    };
    procImg();

    // 适配有目录的帖子
    if (hasMenu) {
      const adaptationMenu = () => {
        document.querySelectorAll('#threadindex li').forEach(e => {
          e.addEventListener('click', () => {
            e.onclick = null;
            ajaxget(...e.getAttribute('onclick').match(/'.+?'/g).map(e => e.slice(1, -1)), '', 'block', setTimeout(() => {
              adaptationMenu();
              procImg();
            }, 1000));
          });
        });
      };
      adaptationMenu();
    }
  }


  // 启用记录阅读进度
  if (ScriptMenu.UserSetting['记录阅读历史'].Enable) {
    let lastFloor;

    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://bbs.yamibo.com/api/mobile/index.php?module=viewthread&tid=${tid}`,
      onload: (data) => {
        const json = JSON.parse(data.responseText);
        lastFloor = json.Variables.thread.allreplies;
      },
    });

    // 在关闭和切换标签页时重新储存数据
    document.addEventListener('visibilitychange', () => {
      if (!document.visible && document.body.style.overflow !== 'hidden') {
        const anchorList = [...document.querySelectorAll('[id^=pid]')];
        const {scrollTop} = document.documentElement;
        while (getTop(anchorList[0]) < scrollTop)
          anchorList.shift();

        GM_setValue(tid, JSON.stringify({
          page: document.querySelector('#pgt strong') ? document.querySelector('#pgt strong').innerHTML : '1',
          lastFloor,
          lastAnchor: anchorList[0].id,
          time: new Date().getTime(),
        }));
      }
    });
  }

} else if (RegExp('forum(-\\d+){2}|mod=forumdisplay').test(document.URL)) {
  // 判断当前页是板块

  // 启用记录阅读进度
  if (ScriptMenu.UserSetting['记录阅读历史'].Enable) {
    GM_addStyle(`:root {--lastReadTagColor: ${ScriptMenu.UserSetting['记录阅读历史']['上次阅读进度标签颜色']}!important;}`);

    let custodyTime = 0;
    if (ScriptMenu.UserSetting['记录阅读历史']['保留天数'] !== -1)
      custodyTime = new Date().getTime() - (ScriptMenu.UserSetting['记录阅读历史']['保留天数'] * 24 * 60 * 60 * 1000);

    // 添加上次阅读进度提示标签
    const addLastReadTag = () => {
      if (document.getElementById('autopbn').text === '下一页 »') {
        let List = document.getElementsByClassName('lastReadTag');
        let i = List.length;
        while (i--)
          List[i].parentNode.removeChild(List[i]);

        List = document.querySelectorAll('tbody[id^=normalthread]');
        i = List.length;
        while (i--) {
          const tid = List[i].id.split('_')[1];
          if (GM_getValue(tid)) {
            const lastReadInfo = JSON.parse(GM_getValue(tid));
            if (lastReadInfo.time < custodyTime) {
              // 删除超过保留天数的阅读记录
              GM_deleteValue(List[i]);
            } else {
              const lastReplies = List[i].querySelector('.num a').innerHTML - lastReadInfo.lastFloor;
              appendDom(List[i].getElementsByTagName('th')[0], `
                <a href="thread-${tid}-${lastReadInfo.page}-1.html#${lastReadInfo.lastAnchor}"
                 class="lastReadTag" onclick="atarget(this)">回第${lastReadInfo.page}页</a>
                ${lastReplies ? `<div class="lastReadTag">+${lastReplies}</div>` : ''}
              `);
            }
          }
        }
      } else
        setTimeout(addLastReadTag, 100);
    };
    addLastReadTag();

    // 切换回当前页时重新添加提示标签
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden)
        addLastReadTag();
    });

    // 点击下一页后添加提示标签
    document.getElementById('autopbn').addEventListener('click', addLastReadTag);
  }

  if (ScriptMenu.UserSetting['体验优化']['修正点击页数时的跳转判定']) {
    const List = document.querySelectorAll('.tps>a');
    let i = List.length;
    while (i--)
      List[i].setAttribute('onclick', 'atarget(this)');
  }

}
