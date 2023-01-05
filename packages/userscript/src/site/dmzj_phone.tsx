import fflate from 'fflate';
import { useToast } from '../components';

import { insertNode } from '../helper';
import { useInit } from '../helper/useInit';

/* eslint-disable camelcase */
declare const obj_id: string;

(async () => {
  const { options, showFab, setManga, createShowComic } = await useInit(
    'dmzj',
    {
      解除吐槽的字数限制: true,
      自动进入漫画阅读模式: true,
    },
  );

  // 分别处理目录页和漫画页
  switch (window.location.pathname.split('/')[1]) {
    case 'info': {
      // 判断是否是隐藏漫画，是的话就手动构建目录
      // FIXME: if (typeof obj_id === 'undefined') {
      if (true) {
        const comicId = parseInt(window.location.pathname.split('/')[2], 10);
        if (Number.isNaN(comicId)) {
          document.body.innerHTML =
            // FIXME: 已失效
            '请从 <a href="https://dmzj.nsapps.cn/">https://dmzj.nsapps.cn/</a> 搜索漫画进入';
          return;
        }

        // XXX: 使用旧 api 只能获取到主版本的章节，其他版本的章节无法取得，改用 v4api 应该就能拿到了
        const res = await GM.xmlHttpRequest({
          method: 'GET',
          url: `http://api.dmzj.com/dynamic/comicinfo/${comicId}.json`,
        });

        if (res.status !== 200) {
          console.error('获取漫画数据失败', res);
          const toast = useToast();
          toast.error('获取漫画数据失败');
          return;
        }

        const {
          info: { last_updatetime },
          list: chaptersList,
        } = JSON.parse(res.responseText).data as {
          info: {
            last_updatetime: string;
            title: string;
          };
          list: Array<{
            id: string;
            chapter_name: string;
            updatetime: string;
          }>;
        };

        let temp = '';
        let i = chaptersList.length;
        while (i--)
          temp += `<a target="_blank" title="${
            chaptersList[i].chapter_name
          }" href="https://m.dmzj.com/view/${comicId}/${
            chaptersList[i].id
          }.html" ${
            chaptersList[i].updatetime === last_updatetime
              ? 'style="color:red"'
              : ''
          }>${chaptersList[i].chapter_name}</a>`;
        insertNode(document.body, temp);

        document.body.removeChild(document.body.childNodes[0]);
        await GM.addStyle(
          'body{padding:0 20vw;} a{margin:0 1em;line-height:2em;white-space:nowrap;display:inline-block;min-width:4em;}',
        );
      }
      break;
    }
    case 'view': {
      // 如果不是隐藏漫画，直接进入阅读模式
      if (unsafeWindow.comic_id) {
        GM_addStyle('.subHeader{display:none !important}');
        const comicImgList = [
          ...document.querySelectorAll('#commicBox img'),
        ].map((img) => {
          img.setAttribute('src', img.getAttribute('data-original')!);
          return img;
        });
        // TODO: 进入阅读模式
        // loadComicReadWindow({
        //   comicImgList,
        //   readSetting: ScriptMenu.UserSetting['漫画阅读'],
        //   comicName: document.title,
        //   nextChapter: unsafeWindow.mReader.nextBtnAction,
        //   prevChapter: unsafeWindow.mReader.prevBtnAction,
        // });
        // ComicReadWindow.start();
        return;
      }

      GM_addStyle(
        'body{display:flex;margin:0;flex-direction:column;align-items:center}body.hide img{display:none}img{max-width:95%;margin:1em 0}#comicRead{order:9999}',
      );
      document.body.removeChild(document.body.childNodes[0]);
      document.body.className = 'hide';
      const loadText = document.createElement('p');
      loadText.innerText = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
      document.body.appendChild(loadText);
      GM_xmlhttpRequest({
        method: 'GET',
        url: `http://v3api.dmzj.com/chapter/${
          /\d+\/\d+/.exec(document.URL)![0]
        }.json`,
        onload: (xhr) => {
          if (xhr.status === 200) {
            let Info;
            try {
              Info = JSON.parse(xhr.responseText);
              document.title = Info.title;
              const blobList = [] as any[];
              let loadImgNum = 0;
              const imgTotalNum = Info.picnum;
              debugger;

              if (imgTotalNum) {
                const loadImg = (index: number) => {
                  GM_xmlhttpRequest({
                    method: 'GET',
                    url: Info.page_url[index],
                    headers: { Referer: 'http://images.dmzj.com/' },
                    responseType: 'blob',
                    onload: (res) => {
                      if (res.status === 200) {
                        blobList[index] = [
                          res.response,
                          res.finalUrl.split('.').pop(),
                        ];
                        if (++loadImgNum === imgTotalNum) {
                          const tempDom = document.createDocumentFragment();
                          for (let i = 0; i < imgTotalNum; i++)
                            insertNode(
                              tempDom,
                              `<img src="${URL.createObjectURL(
                                blobList[i][0],
                              )}">`,
                            );
                          document.body.appendChild(tempDom);
                          // 等待图片全部加载完毕在进行其他操作
                          const checkLoad = () => {
                            const imgList = [
                              ...document.getElementsByTagName('img'),
                            ];
                            if (imgList.every((e) => e.complete)) {
                              document.body.removeChild(loadText);
                              // TODO: 进入漫画阅读模式
                              // loadComicReadWindow({
                              //   comicImgList: imgList,
                              //   readSetting:
                              //     ScriptMenu.UserSetting['漫画阅读'],
                              //   comicName: document.title,
                              //   blobList,
                              // });
                              // ComicReadWindow.start();
                              // document.body.className = '';
                              // GM_registerMenuCommand(
                              //   '进入漫画阅读模式',
                              //   ComicReadWindow.start,
                              // );
                            } else setTimeout(checkLoad, 100);
                          };
                          setTimeout(checkLoad, 100);
                        } else
                          loadText.innerText = `正在加载中，请坐和放宽，若长时间无反应请刷新页面。目前已加载${loadImgNum}/${imgTotalNum}`;
                      } else loadImg(index);
                    },
                  });
                };
                let i = Info.picnum;
                while (i--) loadImg(i);
              } else {
                loadText.innerText =
                  '正常接口未返回具体图片数据，开始通过下载接口获取数据';
                GM_xmlhttpRequest({
                  method: 'GET',
                  responseType: 'blob',
                  url: `https://imgzip.dmzj.com/s/${
                    /\d+\/\d+/.exec(document.URL)![0]
                  }.zip`,
                  onload: async (res) => {
                    debugger;
                    if (res.status === 200) {
                      //   const file = fflate.zipSync({
                      //     'hello.txt': fflate.strToU8('Hello world!'),
                      //   });
                      //   saveAs(new Blob([file], { type: 'application/zip' }));
                      const decompressed = fflate.unzipSync(
                        new Uint8Array(
                          await (res.response as Blob).arrayBuffer(),
                        ),
                      );
                      console.log(decompressed);
                      debugger;

                      // const zip = new JSZip();
                      // const tempDom = document.createDocumentFragment();
                      // zip.loadAsync(res.response).then((zip) => {
                      //   loadText.innerText = '解压中';
                      //   imgTotalNum = Object.keys(zip.files).length;
                      //   let imgNum = 0;
                      //   Object.values(zip.files).forEach((zipData) => {
                      //     const order = zipData.name.split('.')[0];
                      //     zipData.async('blob').then((imgBlob) => {
                      //       insertNode(
                      //         tempDom,
                      //         `<img order=${order} src="${URL.createObjectURL(
                      //           imgBlob,
                      //         )}">`,
                      //       );
                      //       imgNum += 1;
                      //       if (imgNum === imgTotalNum) {
                      //         document.body.appendChild(tempDom);
                      //         // 等待图片全部加载完毕在进行其他操作
                      //         const checkLoad = () => {
                      //           const imgList = [
                      //             ...document.getElementsByTagName('img'),
                      //           ].sort(
                      //             (a, b) =>
                      //               Number(a.getAttribute('order')) -
                      //               Number(b.getAttribute('order')),
                      //           );
                      //           if (imgList.every((e) => e.complete)) {
                      //             document.body.removeChild(loadText);
                      //             // TODO: 进入漫画阅读模式
                      //             // loadComicReadWindow({
                      //             //   comicImgList: imgList,
                      //             //   readSetting:
                      //             //     ScriptMenu.UserSetting['漫画阅读'],
                      //             //   comicName: document.title,
                      //             //   blobList,
                      //             // });
                      //             // ComicReadWindow.start();
                      //             // document.body.className = '';
                      //             // GM_registerMenuCommand(
                      //             //   '进入漫画阅读模式',
                      //             //   ComicReadWindow.start,
                      //             // );
                      //           } else setTimeout(checkLoad, 100);
                      //         };
                      //         setTimeout(checkLoad, 100);
                      //       }
                      //     });
                      //   });
                      // });
                    }
                  },
                });
              }
            } catch (error) {
              debugger;
              loadText.innerText = xhr.responseText;
            }
          }
        },
      });
      break;
    }
  }
})();
