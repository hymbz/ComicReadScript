import { css, mountComponents, sleep, t, useStore } from 'helper';
import { type Component, Show, onMount } from 'solid-js';

import classes from './index.module.css';
import style from './index.module.css?inline';

export type PasswordRequest = {
  message: string;
  /** 标题下的小字补充说明 */
  tip?: string;
  /** 输入框的初始值 */
  defaultValue?: string;
  resolve: (password: string | null) => void;
};

export const { store, setState } = useStore({
  queue: [] as PasswordRequest[],
  password: '',
  ref: null as HTMLDialogElement | null,
  inputRef: null as HTMLInputElement | null,
});

/** 打开弹窗并聚焦输入框 */
const openNow = () => {
  if (store.ref?.open) return;
  setState('password', store.queue[0]?.defaultValue ?? '');
  store.ref?.showModal();
  store.inputRef?.focus();
  store.inputRef?.select();
};

/** 关闭弹窗；未打开则跳过 */
const closeNow = () => {
  if (store.ref?.open) store.ref.close();
};

/** 用 result 结束当前请求，并推进到队列中的下一个请求 */
const complete = (result: string | null) => {
  const [current] = store.queue;
  if (!current) return;
  setState('queue', (queue) => queue.slice(1));
  current.resolve(result);

  closeNow();
  // 还有等待的请求时，先关闭并等待一下，让用户能感知并理解流程
  if (store.queue.length > 0) void sleep(200).then(openNow);
};

export const InputDialog: Component = () => {
  onMount(() => css(style, store.ref));

  return (
    <dialog
      ref={(ref) => setState('ref', ref)}
      class={classes.dialog}
      on:cancel={() => complete(null)}
    >
      <form
        method="dialog"
        class={classes.form}
        onSubmit={() => complete(store.password)}
      >
        <h2 class={classes.message}>{store.queue[0]?.message}</h2>
        <Show when={store.queue[0]?.tip}>
          <p class={classes.tip}>{store.queue[0]?.tip}</p>
        </Show>
        <input
          ref={(ref) => setState('inputRef', ref)}
          class={classes.input}
          type="text"
          value={store.password}
          on:input={(e) => setState('password', e.currentTarget.value)}
        />
        <button
          type="button"
          class={classes.button}
          onClick={() => complete(null)}
        >
          {t('other.cancel')}
        </button>
        <button
          type="submit"
          classList={{ [classes.button]: true, [classes.primary]: true }}
        >
          {t('other.confirm')}
        </button>
      </form>
    </dialog>
  );
};

let dom: HTMLDivElement;
/** 首次被调用时才挂载到页面上 */
const init = () => {
  if (dom || store.ref) return;
  dom = mountComponents('input-dialog', () => <InputDialog />);
};

/**
 * 弹出一个文本输入框，返回用户输入的内容；取消或关闭时返回 null。
 *
 * 同时打开多个输入请求时会在内部自动排队，逐个弹出。
 */
export const askInput = ({
  message = t('other.enter_password'),
  tip,
  defaultValue = '',
}: {
  message?: string;
  tip?: string;
  defaultValue?: string;
} = {}) =>
  new Promise<string | null>((resolve) => {
    init();
    setState('queue', (queue) => [
      ...queue,
      { message, tip, defaultValue, resolve },
    ]);
    // 首个请求立即弹出，后续请求在 complete 中关闭后延迟重开
    if (store.queue.length === 1) openNow();
  });
