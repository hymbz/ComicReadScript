/* global DM5_CID, DM5_MID, DM5_VIEWSIGN_DT, DM5_VIEWSIGN, DM5_IMAGE_COUNT, DM5_CTITLE, DM5_PageType, d */
GM_addStyle(':root {--color1: #FD113A;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;}');
loadScriptMenu('dm5UserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

// 在漫画详情页 DM5_PageType 为 4，在漫画页则为 0
if (!DM5_PageType && ScriptMenu.UserSetting['漫画阅读'].Enable) {
  appendDom(
    document.querySelector('.right-bar'),
    '<a id="comicReadMode" href="javascript:;">阅读模式(脚本)</a>'
  );

  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => { ComicReadWindow.start() });

  const key = $('#dm5_key').length > 0 ? $('#dm5_key').val() : '';
  // eslint-disable-next-line
  let imgList = [];

  const loadImg = (index) => {
    $.ajax({
      url: 'chapterfun.ashx',
      data: {
        cid: DM5_CID,
        page: index,
        key,
        language: 1,
        gtk: 6,
        _cid: DM5_CID,
        _mid: DM5_MID,
        _dt: DM5_VIEWSIGN_DT,
        _sign: DM5_VIEWSIGN,
      },
      type: 'GET',
      success (data) {
        eval(data);
        d.forEach(e => {
          imgList[RegExp('/(\\d+?)_').exec(e)[1] - 1] = e;
        });

        if (imgList.length === DM5_IMAGE_COUNT) {
          loadComicReadWindow({
            comicImgList: imgList.map((e) => {
              const temp = document.createElement('div');
              temp.innerHTML = `<img id="imgPic" class="img-responsive" src="${e}" alt="">`;
              return temp.firstChild;
            }),
            readSetting: ScriptMenu.UserSetting['漫画阅读'],
            EndExit: () => scrollTo(0, getTop(document.querySelector('.top'))),
            comicName: DM5_CTITLE,
            nextChapter: document.querySelector('.logo_2') ? document.querySelector('.logo_2').href : null,
            prevChapter: document.querySelector('.logo_1') ? document.querySelector('.logo_1').href : null,
          });
          if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
            ComicReadWindow.start();
        } else
          loadImg(imgList.length + 1);
      },
    });
  };
  loadImg(1);
}

