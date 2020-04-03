/* global MANGABZ_CURL, MANGABZ_CID, MANGABZ_MID, MANGABZ_VIEWSIGN_DT, MANGABZ_VIEWSIGN, MANGABZ_IMAGE_COUNT, MANGABZ_COOKIEDOMAIN  */
GM_addStyle(':root {--color1: #e40b21;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;} body {padding: 0 !important}');
loadScriptMenu('mangabzUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable && MANGABZ_CID) {
  appendDom(
    document.querySelector('.top-title'),
    '<a id="comicReadMode" style="float:right; color:#FFF" href="javascript:;">漫画加载中</a>',
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    ComicReadWindow.start();
  });

  let prevChapter;
  let nextChapter;
  const chapterList = [...document.querySelectorAll('.container > .bottom-right > a')]
    .map(e => e.getAttribute('href'))
    .filter(url => !url.includes('javascript:'));
  if (chapterList.length === 2) {
    [prevChapter, nextChapter] = chapterList;
  } else if (chapterList.length) {
    if (chapterList[0] > MANGABZ_CURL)
      nextChapter = chapterList[0];
    else
      prevChapter = chapterList[0];
  }

  const imgList = [];
  const addImgUrl = () => {
    const urlParams = Object.entries({
      cid: MANGABZ_CID,
      page: imgList.length + 1,
      key: '',
      _cid: MANGABZ_CID,
      _mid: MANGABZ_MID,
      _dt: MANGABZ_VIEWSIGN_DT.replace(' ', '+').replace(':', '%3A'),
      _sign: MANGABZ_VIEWSIGN,
    }).map(([key, val]) => `${key}=${val}`).join('&');
    const url = `http://${MANGABZ_COOKIEDOMAIN}${MANGABZ_CURL}chapterimage.ashx?${urlParams}`;
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: (xhr) => {
        if (xhr.status === 200) {
          if (xhr.responseText) {
            imgList.push(...eval(xhr.responseText));
          } else {
            console.warn(null, xhr);
          }
          if (imgList.length !== MANGABZ_IMAGE_COUNT) {
            comicReadMode.innerText = `漫画加载中 - ${imgList.length}/${MANGABZ_IMAGE_COUNT}`;
            addImgUrl();
          } else {
            loadComicReadWindow({
              comicImgList: imgList.map(url => {
                const temp = document.createElement('div');
                temp.innerHTML = `<img src="${url}">`;
                return temp.firstChild;
              }),
              readSetting: ScriptMenu.UserSetting['漫画阅读'],
              EndExit: () => scrollTo(0, 0),
              comicName: document.title,
              nextChapter,
              prevChapter,
            });

            if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
              ComicReadWindow.start();
            comicReadMode.innerText = '阅读模式';
          }
        }
      },
    });
  };
  addImgUrl();
}
