import { querySelectorAll, insertNode, querySelector, saveAs } from 'main';

/**
 * 懒得整理导入导出的代码了，应该也没人用了吧，等有人需要的时候再说
 * 这里就先将代码搬过来放着，不能正常运行的话就重写
 */

declare const $: any;
declare const userId: string;

/**
 * 获取用户数据
 * @param dataType 数据类型
 * @param dom 用于在其上显示进度的按钮
 * @returns 用户数据
 */
const getUserData = (
  dataType: string,
  dom: HTMLElement,
): Promise<
  {
    name: string;
    url: string;
    id: string;
  }[]
> =>
  new Promise((resolve, reject) => {
    try {
      // 取得尾页页数
      const pageNum = Number(
        querySelectorAll('#page_id a[href^="#"]').at(-1)!.innerText,
      );
      let loadPageNum = pageNum;
      let returnHtml = '';
      const tipsDom = document.createElement('span');
      tipsDom.className = 'mess_num';
      dom.parentNode!.appendChild(tipsDom);

      for (let i = 0; i <= pageNum; i++) {
        $.ajax({
          url: `/ajax/my/${dataType}`,
          type: 'POST',
          data: {
            page: i,
            type_id: 1,
            letter_id: 0,
            read_id: 1,
          },
        })
          // eslint-disable-next-line no-loop-func
          .done((data: string) => {
            returnHtml += data;
            loadPageNum -= 1;
            tipsDom.innerText = `${pageNum - loadPageNum}/${pageNum}`;
            if (!loadPageNum) {
              const tempDom = document.createElement('div');
              tempDom.innerHTML = returnHtml;
              resolve(
                [...tempDom.getElementsByClassName('his_li')].map((e) => {
                  const aList = e.getElementsByTagName('a');
                  return {
                    name: aList[1].innerText,
                    url: aList[0].href,
                    id: aList[aList.length - 1].id.split('_')[1],
                  };
                }),
              );
            }
          });
      }
    } catch (error) {
      reject(error);
    }
  });

(async () => {
  if (
    window.location.pathname.includes('subscribe') &&
    document.querySelector('#yc1.optioned')
  ) {
    await GM.addStyle(
      '.sub_center_con{position: relative;}#script{position: absolute;right: 0;top: 0;border-width: 1px;border-color: #e6e6e6;border-top-style: solid;border-left-style: solid;cursor: pointer;}#importDetails .account_btm_cont p{margin: 1em 0;}',
    );
    insertNode(
      querySelector('.sub_potion')!,
      `
          <div id="script">
            <li>
              <label for="scriptImport"><a>导入</a></label>
              <input type="file" id="scriptImport" accept=".json" hidden>
            </li>
            <li>
              <label id="scriptExpor"><a>导出</a></label>
            </li>
          </div>
        `,
    );

    const importDom = document.getElementById('scriptImport')!;
    const exportDom = document.getElementById('scriptExpor')!;

    exportDom.addEventListener('click', () => {
      const subscriptionData = [
        ...document.getElementsByClassName('dy_content_li'),
      ].map((e) => {
        const aList = e.getElementsByTagName('a');
        return {
          name: aList[1].innerText,
          url: aList[0].href,
          id: aList[aList.length - 1].getAttribute('value'),
        };
      });
      saveAs(
        new Blob([JSON.stringify(subscriptionData, null, 4)], {
          type: 'text/plain;charset=utf-8',
        }),
        '动漫之家订阅信息.json',
      );
    });

    importDom.addEventListener('change', async (e) => {
      if ((e.target! as HTMLInputElement).files!.length) {
        const serverSubscriptionData = await getUserData(
          'subscribe',
          exportDom,
        );

        const reader = new FileReader();
        reader.onload = (event) => {
          const loadDom = document.createElement('span');
          // 导入文件的订阅数据
          const subscriptionData = JSON.parse(event.target!.result as string);
          // 需要订阅的漫画数据
          const needSubscribeList = subscriptionData.filter(
            (data: any) =>
              !serverSubscriptionData.map(({ id }) => id).includes(data.id),
          ) as { name: string; id: string }[];
          const needSubscribeNum = needSubscribeList.length;

          if (needSubscribeNum) {
            let subscribeIndex = needSubscribeNum - 1;

            loadDom.className = 'mess_num';
            importDom.parentNode!.appendChild(loadDom);

            const subscribe = () => {
              $.ajax({
                url: 'https://interface.dmzj.com/api/subscribe/add',
                type: 'get',
                jsonp: 'callback',
                data: {
                  sub_id: needSubscribeList[subscribeIndex].id,
                  uid: userId,
                  sub_type: 0,
                },
                dataType: 'jsonp',
                jsonpCallback: 'success',
                error: () => {
                  subscribe();
                },
                success: (data: any) => {
                  // 1000:成功订阅, 809:已订阅
                  if (data.result !== 1000 && data.result !== 809)
                    throw new Error(`订阅返回值:${data.result}`);
                  if (subscribeIndex) {
                    loadDom.innerText = `${--subscribeIndex}`;
                    subscribe();
                  } else {
                    loadDom.parentNode!.removeChild(loadDom);
                    insertNode(
                      document.body,
                      `
                        <div id="importDetails">
                          <div class="Choose_way box_show" style="display: block;height: auto;z-index: 9999;">
                            <div class="pwdno_bound_tit">
                              <p class="account_tit_font">导入完成</p>
                              <span class="account_close"></span>
                            </div>
                            <div class="account_btm_cont">
                              <p class="Choose_way_p">共导入 ${
                                subscriptionData.length
                              } 部漫画数据</p>
                              <p class="Choose_way_p">成功订阅 ${needSubscribeNum} 部：</p>
                              <p style="overflow: auto;max-height: 7em;border: 1px solid #3591d5;margin-bottom: 1em;">
                                ${needSubscribeList
                                  .map(({ name }) => name)
                                  .join('<br />')}
                              </p>
                              <p class="Choose_way_p">其余 ${
                                subscriptionData.length - needSubscribeNum
                              } 部漫画已订阅</p>
                            </div>
                          </div>
                          <div style="width: 100%;height: 100%;position: fixed;left: 0;top: 0;background: rgba(0, 0, 0, .3);"></div>
                        </div>
                      `,
                    );
                    querySelector(
                      '#importDetails .account_close',
                    )?.addEventListener('click', (clickEvent) => {
                      document.body.removeChild((clickEvent as any).path[3]);
                    });
                  }
                },
              });
            };
            subscribe();
          }
          // eslint-disable-next-line no-alert
          else alert(`导入 ${subscriptionData.length} 部漫画数据，均已订阅`);
        };
        reader.readAsText((e.target! as HTMLInputElement).files![0]);
      }
    });
  } else if (
    window.location.pathname.includes('record') &&
    document.querySelector('#yc1.optioned')
  ) {
    await GM.addStyle(
      '.sub_center_con{position: relative;}#script{position: absolute;right: 0;top: 0;border-width: 1px;border-color: #e6e6e6;border-top-style: solid;border-left-style: solid;cursor: pointer;}#importDetails .account_btm_cont p{margin: 1em 0;}',
    );
    insertNode(
      querySelector('.inter_con_h')!,
      `<a id="scriptExpor" class="del_all" style="margin: 0 1rem;" href="javascript:">导出</a>`,
    );

    const exportDom = document.getElementById('scriptExpor')!;

    exportDom.addEventListener('click', async () => {
      const recordData = await getUserData('record', exportDom);

      saveAs(
        new Blob([JSON.stringify(recordData, null, 4)], {
          type: 'text/plain;charset=utf-8',
        }),
        '动漫之家云端历史记录.json',
      );
    });
  }
})();
