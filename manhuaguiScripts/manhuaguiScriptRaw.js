/* global cInfo, pVars */
// TODO:调整颜色
GM_addStyle(':root {--color1: #479fdd;--color2: #f0f0f0;--color3: #fff;--color4: #aea5a5;} body {padding: 0 !important}');
loadScriptMenu('manhuaguiUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
  const tempDom = document.querySelector('.main-btn');
  tempDom.removeChild(tempDom.lastChild);
  appendDom(
    tempDom,
    '<a href="javascript:;" id="comicReadMode" class="btn-red">阅读模式</a>',
  );

  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => { ComicReadWindow.start() });

  const comicInfo = JSON.parse(eval(document.querySelectorAll('body > script')[1].innerHTML.slice(26)).slice(12, -12));
  const imgs = comicInfo.files.map(file => `${pVars.manga.filePath}${file}?cid=${comicInfo.cid}${Object.entries(comicInfo.sl).map(attr => `&${attr[0]}=${attr[1]}`)}`);

  loadComicReadWindow({
    comicImgList: [...new Array(unsafeWindow.cInfo.len).keys()].map((e, i) => {
      const temp = document.createElement('div');
      temp.innerHTML = `<img id="imgPic" class="img-responsive" src="${imgs[i]}" alt="">`;
      return temp.firstChild;
    }),
    readSetting: ScriptMenu.UserSetting['漫画阅读'],
    EndExit: () => scrollTo(0, 0),
    comicName: `${comicInfo.bname} ${comicInfo.cname}`,
    nextChapter: cInfo.nextId !== 0 ? `/comic/${cInfo.bid}/${cInfo.nextId}` : null,
    prevChapter: cInfo.prevId !== 0 ? `/comic/${cInfo.bid}/${cInfo.prevId}` : null,
  });
  if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
    ComicReadWindow.start();
}

