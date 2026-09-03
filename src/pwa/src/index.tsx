import { directoryOpen, fileOpen } from 'browser-fs-access';
import { InputDialog } from 'components/InputDialog';
import { Manga, type MangaProps, store as MangeStore } from 'components/Manga';
import { Toaster, toast } from 'components/Toast';
import { boolDataVal, createEffectOn, setInitLang, t } from 'helper';
import { parse as parseMd } from 'marked';
import { pwaInstallHandler } from 'pwa-install-handler';
import { type Component, Show } from 'solid-js';

import { DownloadButton, loadUrl } from './DownloadButton';
import { loadNewImglist } from './fileLoader';
import { supportExtension } from './fileParser';
import { handleDrag } from './handleDrag';
import { FileSystemToFile, setTitle } from './helper';
import classes from './index.module.css';
import { getSaveOption } from './option';
import { handleExit, setState, store } from './store';

setTimeout(setInitLang);

/** 选择文件 */
const handleSelectFiles = async () => {
  const files: File[] = await fileOpen([
    { multiple: true, extensions: [...supportExtension] },
  ]);
  setTitle(files);
  return loadNewImglist(files, t('pwa.alert.img_not_found_files'));
};

/** 选择文件夹 */
const handleSelectDir = async () => {
  const files = (await directoryOpen({ recursive: true })) as File[];
  setTitle(files);
  return loadNewImglist(files, t('pwa.alert.img_not_found_folder'));
};

// 实现从本地文件的打开方式启动时加载文件
window.launchQueue?.setConsumer(async (launchParams) =>
  loadNewImglist(await FileSystemToFile(launchParams.files)),
);

// 支持粘贴 url
window.addEventListener('paste', (event) =>
  loadUrl(event.clipboardData?.getData('text/plain')),
);

const handleOptionChange: MangaProps['onOptionChange'] = (option) =>
  localStorage.setItem('@option', JSON.stringify(option));

(window as any).toast = toast;

export const Root: Component = () => {
  createEffectOn(
    () => store.title,
    (title) => {
      document.title = title ? `${title} - ComicRead PWA` : 'ComicRead PWA';
    },
  );

  return (
    <div
      ref={(e) => handleDrag(e)}
      class={classes.root}
      data-dark={boolDataVal(MangeStore.option.darkMode)}
    >
      <div class={classes.main} data-drag={store.dragging}>
        <div class={classes.body}>
          {/* oxlint-disable-next-line solid/no-innerhtml */}
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
              <button type="button" on:click={() => setState('show', true)}>
                {t('pwa.button.resume_read')}
              </button>
            </Show>
          </span>

          <div
            class={classes.installTip}
            classList={{ [classes.hide]: Boolean(store.hiddenInstallTip) }}
          >
            {/* oxlint-disable-next-line solid/no-innerhtml */}
            <div innerHTML={parseMd(t('pwa.install_md')) as string} />
            <div style={{ 'text-align': 'center' }}>
              <button type="button" on:click={pwaInstallHandler.install}>
                {t('pwa.button.install')}
              </button>
              <a on:click={() => setState('hiddenInstallTip', 'TD')}>
                {t('pwa.button.no_more_prompt')}
              </a>
            </div>
          </div>
        </div>
      </div>

      <Manga
        class={classes.manga}
        option={getSaveOption()}
        defaultOption={{ alwaysLoadAllImg: true }}
        onOptionChange={handleOptionChange}
        onExit={handleExit}
        {...store}
      />

      <Toaster />
      <InputDialog />
    </div>
  );
};
