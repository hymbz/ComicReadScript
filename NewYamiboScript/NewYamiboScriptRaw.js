// $('body').unbind();
document.getElementsByTagName('html')[0].style.overflowX = 'visible';
const List = document.getElementsByClassName('dropdown');
let i = List.length;
while (i--) {
  List[i].addEventListener('mouseenter', (e) => {
    e.currentTarget.className += ' open';
  });
  List[i].addEventListener('mouseleave', (e) => {
    e.currentTarget.className = e.currentTarget.className.split(' open')[0];
  });
}

GM_addStyle(':root {--color1:#551200;--color2:#FCF8E3;--color3:#F7F5F0;--color4:#BBB;}');
loadScriptMenu('NewYamiboUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

// 判断当前页是漫画内容
if (document.URL.includes('view-chapter') && ScriptMenu.UserSetting['漫画阅读'].Enable) {
  const imgList = [];
  const id = RegExp('id=(\\d+)').exec(document.URL)[1] - 0;
  const nowIndex = document.querySelector('ul.pagination > li:last-of-type > input').value - 0;
  const finalIndex = document.querySelector('section div:first-of-type div:last-of-type').innerHTML.trim().split('：')[1] - 0;

  appendDom(
    document.querySelector('div.col-md-6.col-xs-12.pull-left'),
    '<button type="button" id="comicReadMode" class="btn btn-sm btn-yuri disabled"><i class="fa fa-book"></i> 漫画阅读</button>'
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    if (!document.getElementById('comicReadMode').className.includes('disabled'))
      ComicReadWindow.start();
  });

  for (let i = 1; i <= finalIndex; i++) {
    const index = i;
    if (index === nowIndex) {
      imgList.push({
        i: index,
        src: document.getElementById('imgPic').src,
      });
    } else {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${index}`,
        onload: (xhr) => {
          if (xhr.status === 200) {
            imgList.push({
              i: index,
              src: RegExp('<img id="imgPic".+="(.+?)".+>').exec(xhr.responseText)[1],
            });
            if (imgList.length === finalIndex) {
              loadComicReadWindow({
                comicImgList: imgList.sort((a, b) => a.i - b.i).map((e) => {
                  const temp = document.createElement('div');
                  temp.innerHTML = `<img id="imgPic" class="img-responsive" src="${e.src}" alt="">`;
                  return temp.firstChild;
                }),
                readSetting: ScriptMenu.UserSetting['漫画阅读'],
                EndExit: () => scrollTo(0, getTop(document.getElementById('w1'))),
                comicName: `${document.querySelector('ul.breadcrumb > li:nth-child(4) > a').innerHTML} ${document.getElementsByTagName('h3')[0].innerHTML}`,
                nextChapter: document.getElementById('btnNext') ? document.getElementById('btnNext').href : null,
                prevChapter: document.getElementById('btnPrev') ? document.getElementById('btnPrev').href : null,
              });
              document.getElementById('comicReadMode').className = 'btn btn-sm btn-yuri';
              if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
                ComicReadWindow.start();
            }
          }
        },
      });
    }
  }
}

