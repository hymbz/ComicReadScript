import { type Component, For, Show } from 'solid-js';

import classes from '../index.module.css';
import { store } from '../store';

// 为防止加载好的图片被浏览器垃圾回收掉，必须用 dom 挂载上
// 测试方法：开个几百页的漫画加载完毕后，再打开二十个标签页切换过去，等待一分钟再切回来
// 本来还以为把加载好的图片元素放到 store 里就不会被回收了的，但还是无法通过上述测试
// 现在这样相比以前就只是减少了 ComicImg 里 createMemo 之类的性能损耗
// 在页数过多时还是会因为 dom 数量过多而导致性能问题，需要找到更好的方案

export const ImgPool: Component = () => (
  <div class={classes.imgPool}>
    <For each={store.imgList}>
      {(img, i) => (
        <Show when={img.loadType === 'loaded'}>
          <img data-index={i()} src={img.src} />
        </Show>
      )}
    </For>
  </div>
);
