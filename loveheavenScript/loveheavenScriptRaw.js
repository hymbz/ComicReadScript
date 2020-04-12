GM_addStyle(':root {--color1: #e40b21;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;} body {padding: 0 !important}');
loadScriptMenu('loveheavenUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable && document.querySelectorAll('img.chapter-img').length) {
  appendDom(
    document.querySelector('#navbar-main'),
    '<ul class="nav navbar-nav navbar-right"><li><a id="comicReadMode" href="javascript:;">Load comic</a></li></ul>',
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    ComicReadWindow.start();
  });

  const imgSrcList = [...document.querySelectorAll('img.chapter-img')]
    .map(e => e.getAttribute('data-src'));

  const blobList = [];
  let loadImgNum = 0;
  const imgTotalNum = imgSrcList.length;

  if (imgTotalNum) {
    const loadImg = (index) => {
      const i = index;
      GM_xmlhttpRequest({
        method: 'GET',
        url: imgSrcList[i],
        headers: {Referer: location.href},
        responseType: 'blob',
        onload: (xhr) => {
          if (xhr.status === 200) {
            blobList[i] = [xhr.response, xhr.finalUrl.split('.').pop()];
            if (++loadImgNum === imgTotalNum) {
              comicReadMode.innerText = 'Read';
              loadComicReadWindow({
                comicImgList: blobList.map(([blobData]) => {
                  const temp = document.createElement('div');
                  temp.innerHTML = `<img src="${URL.createObjectURL(blobData)}">`;
                  return temp.firstChild;
                }),
                readSetting: ScriptMenu.UserSetting['漫画阅读'],
                comicName: document.title,
                blobList,
              });
              if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
                ComicReadWindow.start();
            } else
              comicReadMode.innerText = `loading - ${loadImgNum}/${imgTotalNum}`;
          } else
            loadImg(i);
        },
      });
    };
    let i = imgTotalNum;
    while (i--)
      loadImg(i);
  }

}
