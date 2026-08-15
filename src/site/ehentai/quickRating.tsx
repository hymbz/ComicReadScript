import { request, toast } from 'core';
import { css, querySelectorAll, t } from 'helper';
import { For } from 'solid-js';
import { render } from 'solid-js/web';

import { type EhFeatureHandler } from './helper';

/** 快捷评分 */
export const quickRating: EhFeatureHandler = (_, pageCtx) => {
  let list: HTMLElement[];

  switch (pageCtx.type) {
    case 'e':
      list = querySelectorAll('#favform > table > tbody > tr');
      break;
    case 'm':
    case 'p':
    case 'l':
      list = querySelectorAll('#favform > table > tbody > tr').slice(1);
      break;
    case 't':
      list = querySelectorAll('.gl1t');
      break;

    default:
      return;
  }

  css`
    .comidread-quick-rating {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .comidread-blink {
      animation: comidread-blink 1.2s ease-in-out infinite;
    }

    @keyframes comidread-blink {
      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.25;
      }
    }
  `;

  const coordsList = [
    '0,0,7,16',
    '8,0,15,16',
    '16,0,23,16',
    '24,0,31,16',
    '32,0,39,16',
    '40,0,47,16',
    '48,0,55,16',
    '56,0,63,16',
    '64,0,71,16',
    '72,0,79,16',
  ];

  /** 修改评分 */
  const editRating = async (url: string, num: number) => {
    try {
      const dataRes = await request(url, {
        errorText: t('site.ehentai.change_rating_failed'),
        noTip: true,
      });
      const match =
        /api_url = "(?<api_url>.+?)";.+?gid = (?<gid>\d+);.+?token = "(?<token>.+?)";.+?apiuid = (?<apiuid>\d+);.+?apikey = "(?<apikey>.+?)"/su.exec(
          dataRes.responseText,
        )?.groups;
      if (!match) throw new Error(t('site.ehentai.change_rating_failed'));
      const { api_url, gid, token, apiuid, apikey } = match;

      type ResData = { rating_cls: string; rating_usr: number };
      const res = await request<ResData>(api_url, {
        method: 'POST',
        responseType: 'json',
        data: JSON.stringify({
          method: 'rategallery',
          rating: `${num}`,
          apikey,
          apiuid,
          gid,
          token,
        }),
        fetch: true,
        noTip: true,
      });
      toast.success(
        `${t('site.ehentai.change_rating_success')}: ${res.response.rating_usr}`,
      );
      return res.response;
    } catch {
      toast.error(t('site.ehentai.change_rating_failed'));
      throw new Error(t('site.ehentai.change_rating_failed'));
    }
  };

  /** 根据评分修改显示效果 */
  const updateRatingImage = (dom: HTMLElement, num: number) => {
    // 来自 eh 详情页的 update_rating_image 函数
    let a = Math.round(num + 1);
    const b = -80 + 16 * Math.ceil(a / 2);
    a = a % 2 === 1 ? -21 : -1;
    dom.style.backgroundPosition = `${b}px ${a}px`;
  };

  const renderQuickRating = (
    item: HTMLElement,
    ir: HTMLElement,
    index: number,
  ) => {
    let basePosition = ir.style.backgroundPosition;
    // 请求进行中，忽略期间的其他点击，避免并发请求
    let isRequesting = false;

    render(
      () => (
        <span
          class="comidread-quick-rating"
          data-index={index}
          onMouseOut={() => {
            ir.style.backgroundPosition = basePosition;
          }}
        >
          <img src="https://ehgt.org/g/blank.gif" usemap={`#rating-${index}`} />
          <map name={`rating-${index}`}>
            <For each={coordsList}>
              {(coords, i) => (
                <area
                  shape="rect"
                  coords={coords}
                  onMouseOver={() => updateRatingImage(ir, i())}
                  onClick={async () => {
                    if (isRequesting) return;
                    isRequesting = true;
                    // 请求期间让星星缓慢闪烁，提示正在修改
                    ir.classList.add('comidread-blink');
                    try {
                      const res = await editRating(
                        item.querySelector('a')!.href,
                        i() + 1,
                      );
                      ir.className = res.rating_cls;
                      updateRatingImage(ir, res.rating_usr * 2 - 1);
                      basePosition = ir.style.backgroundPosition;
                    } catch {
                      // 修改失败，恢复原评分显示（错误提示已由 editRating 弹出）
                      ir.style.backgroundPosition = basePosition;
                    } finally {
                      isRequesting = false;
                      ir.classList.remove('comidread-blink');
                    }
                  }}
                />
              )}
            </For>
          </map>
        </span>
      ),
      ir,
    );
  };

  for (const [index, item] of list.entries()) {
    const ir = [...item.querySelectorAll<HTMLElement>('.ir')].at(-1);
    if (!ir) continue;
    // 快捷评分使用得并不多，所以等鼠标移上去再处理，减少性能消耗
    ir.addEventListener(
      'mouseenter',
      () => renderQuickRating(item, ir, index),
      { once: true },
    );
  }
};
