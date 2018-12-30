$('body').unbind();
document.getElementsByTagName('html')[0].style.overflowX = 'visible';
let List = document.getElementsByClassName('dropdown'),
    i = List.length;
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
  '漫画阅读': {
    'Enable': true,
    '双页显示': true,
    '页面填充': true,
    '点击翻页': false,
    '阅读进度': true,
    '夜间模式': false
  },
  'Version': GM_info.script.version
});

// 判断当前页是漫画内容
if (document.URL.includes('view-chapter') && ScriptMenu.UserSetting['漫画阅读'].Enable) {
  let imgList = [];
  const id = RegExp('id=(\\d+)').exec(document.URL)[1] - 0,
      nowIndex = document.querySelector('ul.pagination > li:last-of-type > input').value - 0,
      finalIndex = document.querySelector('section div:first-of-type div:last-of-type').innerHTML.trim().split('：')[1] - 0;

  appendDom(document.querySelector('div.col-md-6.col-xs-12.pull-left'),
    '<button type="button" id="comicReadMode" class="btn btn-sm btn-yuri disabled"><i class="fa fa-book"></i> 漫画阅读</button>');
  document.getElementById('comicReadMode').addEventListener('click', () => {
    if (document.getElementById('comicReadMode').className.includes('disabled')) {
      let loadImg = (i) => {
        let index = i;
        if (index === nowIndex) {
          imgList.push({
            'i': index,
            'src': document.getElementById('imgPic').src
          });
        } else {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${index}`,
            onload: (xhr) => {
              if (xhr.status === 200) {
                imgList.push({
                  'i': index,
                  'src': RegExp('img-responsive.+=(.+?")').exec(xhr.responseText)[1].slice(1, -1)
                });
                if (imgList.length === finalIndex) {
                  loadComicReadWindow({
                    'comicImgList': imgList.sort((a, b) => a.i - b.i).map((e) => {
                      let temp = document.createElement('div');
                      temp.innerHTML = `<img id="imgPic" class="img-responsive" src="${e.src}" alt="">`;
                      return temp.firstChild;
                    }),
                    'readSetting': ScriptMenu.UserSetting['漫画阅读'],
                    'EndExit': () => scrollTo(0, getTop(document.getElementById('w1'))),
                    'comicName': `${document.querySelector('ul.breadcrumb > li:nth-child(4) > a').innerHTML} ${document.getElementsByTagName('h3')[0].innerHTML}`,
                    'nextChapter': document.getElementById('btnNext') ? document.getElementById('btnNext').href : null,
                    'prevChapter': document.getElementById('btnPrev') ? document.getElementById('btnPrev').href : null
                  });
                  document.getElementById('comicReadMode').className = 'btn btn-sm btn-yuri';
                }
              } else
                loadImg(index);
            }
          });
        }
      };
      for (let i = 1; i <= finalIndex; i++)
        loadImg(i);
    } else
      ComicReadWindow.start();
  });
}

