import {
  type Component,
  For,
  type JSX,
  Show,
  createEffect,
  createMemo,
  onCleanup,
} from 'solid-js';

import {
  abreastArea,
  getCropMargin,
  getImgEle,
  getImgTip,
  handleImgError,
  handleImgLoaded,
  imgPageMap,
  isAbreastMode,
  isEnableBg,
} from '../actions';
import classes from '../index.module.css';
import { refs, store } from '../store';
import { type ComicImg as TComicImg } from '../store/image';

export const ComicImg: Component<TComicImg & { index: number }> = (img) => {
  const showState = () => store.imgShowState[img.index];

  // 让浏览器提前解码防止在火狐和 Safari 上的翻页闪烁
  createEffect(() => src() && getImgEle(img.src)?.decode());

  const src = () => {
    if (img.loadType === 'wait') return '';
    if (img.translationType === 'show') return img.translationUrl;
    if (store.option.imgRecognition.enabled) {
      if (store.option.imgRecognition.upscale && img.upscaleUrl)
        return img.upscaleUrl;
      return img.blobUrl;
    }
    // 有些浏览器不支持显示带有 hash 标识的图片 url
    if (img.src.startsWith('blob:')) return img.src.replace(/#\..+/u, '');
    return img.src;
  };

  /** 并排卷轴模式下需要复制的图片数量 */
  const cloneNum = createMemo(() => {
    if (!isAbreastMode()) return 0;
    const imgPosition = abreastArea().position[img.index];
    return imgPosition ? imgPosition.length - 1 : 0;
  });

  /** 打开「边缘裁切」后使用的样式 */
  const cropStyle = createMemo(
    (): { imgEle: JSX.CSSProperties; picture: JSX.CSSProperties } | null => {
      // TODO: 等火狐也支持 object-view-box 后就可以简化相关实现了
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1773791

      const crop = getCropMargin(img);
      if (!crop) return null;

      const cw = 1 - crop.left - crop.right;
      const ch = 1 - crop.top - crop.bottom;
      const picture: JSX.CSSProperties = { overflow: 'clip' };

      // 这些模式下 picture 的尺寸依赖普通流内容，img 改成 absolute 后需要显式指定尺寸
      const isDisableZoomNonScroll =
        store.option.disableZoom && !store.option.scrollMode.enabled;
      if (isDisableZoomNonScroll || isAbreastMode()) {
        if (isDisableZoomNonScroll) {
          // 禁止自动放大时按图片所在页的实际宽度等比适配，避免被 CSS max 约束二次钳制
          const pageIndex = imgPageMap()[img.index];
          const page =
            pageIndex === undefined ? undefined : store.pageList[pageIndex];
          const isFullWidth = page?.length === 1;
          const scale =
            Math.min(
              1,
              (store.rootSize.width * (isFullWidth ? 1 : 0.5)) / img.size.width,
              store.rootSize.height / img.size.height,
            ) || 1;
          picture.width = `${img.size.width * scale}px`;
          picture.height = `${img.size.height * scale}px`;
        } else {
          picture.width = `${img.size.width}px`;
          picture.height = `${img.size.height}px`;
        }
      }

      return {
        imgEle: {
          position: 'absolute',
          left: `${(-crop.left / cw) * 100}%`,
          top: `${(-crop.top / ch) * 100}%`,
          width: `${(1 / cw) * 100}%`,
          height: `${(1 / ch) * 100}%`,
          'max-width': 'none',
          'max-height': 'none',
          'object-fit': 'fill',
        },
        picture,
      };
    },
  );

  const styles = createMemo(() => ({
    img: {
      'grid-area': isAbreastMode() ? 'none' : `_${img.index}`,
      'background-color': isEnableBg()
        ? (img.background ?? undefined)
        : undefined,
    },
    imgEle: cropStyle()?.imgEle,
    picture: {
      'aspect-ratio': `${img.size.width} / ${img.size.height}`,
      background: img.progress
        ? `linear-gradient(
              to bottom,
              var(--secondary-bg) ${img.progress}%,
              var(--hover-bg-color,#fff3) ${img.progress}%
            )`
        : undefined,
      ...cropStyle()?.picture,
    },
  }));

  const ComicImgBase: Component<{ cloneIndex?: number }> = (props) => (
    <div
      class={classes.img}
      id={`_${img.index}_${props.cloneIndex ?? 0}`}
      style={styles().img}
      data-show={showState()}
      data-type={img.type ?? store.defaultImgType}
      data-load-type={img.loadType === 'loaded' ? undefined : img.loadType}
    >
      {/* 因为 img 无法使用 ::after，所以得用 picture 包一下 */}
      <picture style={styles().picture}>
        <Show when={src()}>
          <img
            style={styles().imgEle}
            ref={(el) => {
              refs.imgEleMap[img.src] ??= new Set();
              const set = refs.imgEleMap[img.src];
              set.add(el);
              onCleanup(() => {
                set.delete(el);
                if (set.size === 0) delete refs.imgEleMap[img.src];
              });
            }}
            src={src()}
            alt={`${img.index}`}
            data-src={img.src}
            onLoad={(e) => handleImgLoaded(img.src, e.currentTarget)}
            onError={(e) => handleImgError(img.src, e.currentTarget)}
            draggable="false"
            decoding="async"
          />
        </Show>
        <div class={classes.pageTip}>{getImgTip(img.index)}</div>
      </picture>
    </div>
  );

  return (
    <>
      <ComicImgBase />
      <Show when={cloneNum() > 0}>
        <For each={Array.from({ length: cloneNum() })}>
          {(_, i) => <ComicImgBase cloneIndex={i() + 1} />}
        </For>
      </Show>
    </>
  );
};
