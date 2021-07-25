GM_addStyle(':root {--color1: #e40b21;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;scroll-behavior: auto !important;} body {padding: 0 !important}');
loadScriptMenu('manhuadbUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable && unsafeWindow.img_data_arr) {
  appendDom(
    document.querySelector('body > nav > div'),
    '<a id="comicReadMode" class="navbar-brand" href="javascript:;">漫画加载中</a>',
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    ComicReadWindow.start();
  });

  loadComicReadWindow({
    comicImgList: unsafeWindow.img_data_arr.map(data => {
      const temp = document.createElement('div');
      temp.innerHTML = `<img src="${unsafeWindow.img_host}/${unsafeWindow.img_pre}/${data.img}">`;
      return temp.firstChild;
    }),
    readSetting: ScriptMenu.UserSetting['漫画阅读'],
    EndExit: () => scrollTo(0, 0),
    comicName: document.title,
    nextChapter: () => { document.querySelector('a[title="下集"]').click() },
    prevChapter: () => { document.querySelector('a[title="上集"]').click() },
  });
  if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
    ComicReadWindow.start();
  comicReadMode.innerText = '阅读模式';
}
