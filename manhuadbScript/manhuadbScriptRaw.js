GM_addStyle(':root {--color1: #e40b21;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;} body {padding: 0 !important}');
loadScriptMenu('manhuaguiUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
  appendDom(
    document.querySelector('body > nav > div'),
    '<a id="comicReadMode" class="navbar-brand" href="javascript:;">阅读模式</a>'
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    ComicReadWindow.start();
  });

  // eslint-disable-next-line
  let imgList = [];
  const pageUrlList = [...document.getElementById('page-selector').getElementsByTagName('option')].map(e => e.value);
  const pageNum = pageUrlList.length;

  pageUrlList.forEach(url => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: (xhr) => {
        if (xhr.status === 200) {
          imgList.push(RegExp('<img class="img-fluid".+="(.+?)".+>').exec(xhr.responseText)[1]);
          comicReadMode.innerText = `阅读模式（${imgList.length}/${pageNum}）`;
          if (imgList.length === pageNum) {
            loadComicReadWindow({
              comicImgList: imgList.sort((a, b) => RegExp('/(\\d+)_').exec(a)[1] - RegExp('/(\\d+)_').exec(b)[1]).map((e) => {
                const temp = document.createElement('div');
                temp.innerHTML = `<img src="${e}">`;
                return temp.firstChild;
              }),
              readSetting: ScriptMenu.UserSetting['漫画阅读'],
              EndExit: () => scrollTo(0, 0),
              comicName: document.title,
            });
            if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
              ComicReadWindow.start();
            comicReadMode.innerText = '阅读模式';
          }
        }
      },
    });
  });
}
