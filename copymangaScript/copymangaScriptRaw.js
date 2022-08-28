GM_addStyle(':root {--color1: #e40b21;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;} body {padding: 0 !important}');
loadScriptMenu('copymangaUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable && window.location.href.includes('/chapter/')) {
  appendDom(
    document.querySelector('.footer'),
    '<div class="comicContent-prev list"><a id="comicReadMode" href="javascript:;">閲讀模式</a></div>',
  );
  // 在前面加一个隐藏按钮保证整体居中
  appendDom(
    document.querySelector('.footer'),
    '<div class="comicContent-prev index" style="visibility: hidden;"><a href="/">隐藏隐藏</a></div>',
    document.querySelector('.footer .index'),
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    ComicReadWindow.start();
  });

  GM_xmlhttpRequest({
    method: 'GET',
    url: window.location.href.replace(/.*?(?=\/comic\/)/, 'https://api.copymanga.site/api/v3'),
    headers: { Referer: location.href },
    responseType: 'blob',
    onload: (xhr) => {
      if (xhr.status === 200) {
        const { results: { chapter: { contents } } } = JSON.parse(xhr.responseText);

        loadComicReadWindow({
          comicImgList: contents.map(({ url }) => {
            const temp = document.createElement('div');
            temp.innerHTML = `<img src="${url}">`;
            return temp.firstChild;
          }),
          readSetting: ScriptMenu.UserSetting['漫画阅读'],
          comicName: document.title,
          nextChapter: document.querySelector('.comicContent-next a:not(.prev-null)')?.href,
          prevChapter: document.querySelector('.comicContent-prev:nth-child(3) a:not(.prev-null)')?.href,
        });

        if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
          ComicReadWindow.start();
      }
    },
  });
}
