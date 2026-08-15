import { css, querySelector } from 'helper';

import { type EhFeatureHandler } from './helper';

/** 处理侧边栏溢出 */
export const sidebarOverflow: EhFeatureHandler = (_, pageCtx) => {
  if (pageCtx.type !== 'gallery') return;

  // 限定右侧按钮框的高度，避免因为按钮太多而突出界面
  const { sidebar } = pageCtx.dom;

  const resizeObserver = new ResizeObserver(() => {
    // 只在超出正常高度时才使用 css 限制，避免和其他脚本（如：EhAria2下载助手）冲突
    Reflect.deleteProperty(sidebar.dataset, 'long');
    const lastNode = querySelector('#gd5 p:last-of-type')!;
    if (lastNode.offsetTop + lastNode.offsetHeight > 352)
      sidebar.dataset.long = '';
  });
  resizeObserver.observe(sidebar);

  css`
    #gd5[data-long] {
      --scrollbar-slider: ${
        getComputedStyle(querySelector('.gm')!).borderColor
      };

      scrollbar-color: var(--scrollbar-slider) transparent;
      scrollbar-width: thin;
      overflow: auto;
      max-height: 352px;

      &::-webkit-scrollbar {
        width: 5px;
        height: 10px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--scrollbar-slider);
      }
    }

    /* 在显示 ehs 时隐藏 gd5 上的滚动条，避免同时显示两个滚动条 */
    #gd5[data-long]:has(#ehs-introduce-box .ehs-content) {
      overflow: hidden;
    }

    #gmid #ehs-introduce-box {
      width: 100%;
    }

    /*
      消除 ehs 针对按钮太多时的解决办法，用脚本的处理方式就好了，避免在浮动标签栏时导致滚动
      https://github.com/EhTagTranslation/EhSyringe/commit/009054cc34ee818972d2a042990bf89bdff1895a
    */
    body #gmid #gd5 {
      --ehs-gap: 1;

      justify-content: unset;
    }
  `;
};
