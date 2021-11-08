GM_addStyle(':root {--color1: #e40b21;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;scroll-behavior: auto !important;} body {padding: 0 !important}');
loadScriptMenu('manhuacatUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable && img_data_arr) {
  appendDom(
    document.querySelector('.container-fluid div.form-inline'),
    '<a id="comicReadMode" class="btn btn-primary mb-1 mr-1" href="javascript:;">漫画加载中</a>',
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    ComicReadWindow.start();
  });

  loadComicReadWindow({
    comicImgList: img_data_arr.map(data => {
      const temp = document.createElement('div');
      const src = cdnImage(img_pre + data, asset_domain, asset_key);
      temp.innerHTML = `<img src="${src}">`;
      return temp.firstChild;
    }),
    readSetting: ScriptMenu.UserSetting['漫画阅读'],
    EndExit: () => scrollTo(0, 0),
    comicName: document.title,
    nextChapter: () => { goNumPage('next') },
    prevChapter: () => { goNumPage('pre') },
  });
  if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
    ComicReadWindow.start();
  comicReadMode.innerText = '阅读模式';
}
