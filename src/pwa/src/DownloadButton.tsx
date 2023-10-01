import { createSignal, type Component } from 'solid-js';
import { filetypeinfo } from 'magic-bytes.js';
import { t } from 'helper/i18n';
import { request } from 'helper/request';
import { loadNewImglist } from './store';
import { toast } from '../../components/Toast';

const [progress, setProgress] = createSignal<null | number>(null);

const loadUrl = async (url: string | null) => {
  try {
    if (progress() !== null) return toast.warn(t('button.downloading'));
    if (!url) return;

    if (typeof GM_xmlhttpRequest === 'undefined')
      throw new Error(t('pwa.alert.userscript_not_installed'));

    const res = await request<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      onprogress: ({ loaded, total }) => setProgress(loaded / total),
    });

    const [fileType] = filetypeinfo(new Uint8Array(res.response));

    loadNewImglist(
      [
        new File([res.response], `archive.${fileType.extension}`, {
          type: fileType.mime,
        }),
      ],
      t('pwa.alert.img_not_found_files'),
    );
  } catch (error) {
    toast.error((error as Error).message, { throw: true });
  } finally {
    setProgress(null);
  }
};

// 自动根据查询字符串加载 url
const handleUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  loadUrl(urlParams.get('url'));
};

window.onpopstate = handleUrl;
setTimeout(handleUrl);

export const DownloadButton: Component = () => (
  <button
    type="button"
    data-loading={progress() ? '' : undefined}
    on:click={() => {
      if (progress() !== null) return toast.warn(t('button.downloading'));

      // eslint-disable-next-line no-alert
      const downUrl = prompt(t('pwa.tip_enter_url'));
      if (!downUrl) return;

      const url = new URL(window.location.href);
      url.searchParams.set('url', downUrl);
      window.history.pushState({}, '', url);
      handleUrl();
    }}
  >
    {progress() === null
      ? t('pwa.button.enter_url')
      : `${t('button.downloading')} - ${Math.round(progress()! * 100)}%`}
  </button>
);
