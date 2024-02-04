import { Show, type Component } from 'solid-js';
import { pwaInstallHandler } from 'pwa-install-handler';
import { directoryOpen, fileOpen } from 'browser-fs-access';
import { parse as parseMd } from 'marked';
import { setInitLang, t } from 'helper/i18n';
import type { MangaProps } from '../../components/Manga';
import { Manga } from '../../components/Manga';
import { Toaster, toast } from '../../components/Toast';
import { store, handleExit, loadNewImglist, _setState } from './store';
import { FileSystemToFile, imgExtension } from './helper';
import { handleDrag } from './handleDrag';
import { editButtonList } from './handleButtonList';
import { DownloadButton, loadUrl } from './DownloadButton';

import classes from './index.module.css';

setInitLang();

/** 选择文件 */
const handleSelectFiles = async () => {
  const options = [
    ['image/*', [...imgExtension.values()]],
    ['application/zip', ['.zip', '.cbz']],
    ['application/x-rar-compressed', ['.rar', '.cbr']],
    ['application/x-7z-compressed', ['.7z', '.cb7']],
  ] as [string, string[]][];

  const files: File[] = await fileOpen([
    { multiple: true },
    ...options.map(([mimeTypes, extensions]) => ({
      mimeTypes: [mimeTypes],
      extensions,
      description: 'Image',
    })),
  ]);

  loadNewImglist(files, t('pwa.alert.img_not_found_files'));
};

/** 选择文件夹 */
const handleSelectDir = async () => {
  const files = (await directoryOpen({ recursive: true })) as File[];
  loadNewImglist(files, t('pwa.alert.img_not_found_folder'));
};

// 实现从本地文件的打开方式启动时加载文件
window.launchQueue?.setConsumer(async (launchParams) => {
  loadNewImglist(await FileSystemToFile(launchParams.files));
});

// 支持粘贴 url
window.addEventListener('paste', (event) =>
  loadUrl(event.clipboardData?.getData('text/plain')),
);

const getSaveOption = (): MangaProps['option'] => {
  const saveJson = localStorage.getItem('option');
  if (!saveJson) return undefined;
  return JSON.parse(saveJson) as MangaProps['option'];
};

const handleOptionChange: MangaProps['onOptionChange'] = (option) =>
  localStorage.setItem('option', JSON.stringify(option));

(window as any).toast = toast;

export const Root: Component = () => (
  <div ref={(e) => handleDrag(e)} class={classes.root}>
    <div class={classes.main} data-drag={store.dragging}>
      <div class={classes.body}>
        {/* eslint-disable-next-line solid/no-innerhtml */}
        <div innerHTML={parseMd(t('pwa.tip_md')) as string} />

        <span style={{ 'margin-top': '1em' }}>
          <button type="button" on:click={handleSelectFiles}>
            {t('pwa.button.select_files')}
          </button>
          <button type="button" on:click={handleSelectDir}>
            {t('pwa.button.select_folder')}
          </button>
          <DownloadButton />
          <Show when={store.imgList.length}>
            <button type="button" on:click={() => _setState('show', true)}>
              {t('pwa.button.resume_read')}
            </button>
          </Show>
        </span>

        <div
          class={classes.installTip}
          classList={{ [classes.hide]: !!store.hiddenInstallTip }}
        >
          {/* eslint-disable-next-line solid/no-innerhtml */}
          <div innerHTML={parseMd(t('pwa.install_md')) as string} />
          <div style={{ 'text-align': 'center' }}>
            <button type="button" on:click={pwaInstallHandler.install}>
              {t('pwa.button.install')}
            </button>
            <a on:click={() => _setState('hiddenInstallTip', 'TD')}>
              {t('pwa.button.no_more_prompt')}
            </a>
          </div>
        </div>
      </div>
    </div>

    <Manga
      class={classes.manga}
      show={store.show}
      imgList={store.imgList.map(({ url }) => url)}
      option={{ alwaysLoadAllImg: true, ...getSaveOption() }}
      onOptionChange={handleOptionChange}
      editButtonList={editButtonList}
      onExit={handleExit}
    />

    <Toaster />
  </div>
);
