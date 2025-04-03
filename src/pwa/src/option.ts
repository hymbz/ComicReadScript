import type { MangaProps } from 'components/Manga';
import { versionLt } from 'userscript/main/migration';

import { version } from '../../../package.json' assert { type: 'json' };

let saveOption: MangaProps['option'] | undefined;

export const getSaveOption = (): MangaProps['option'] => {
  if (saveOption) return saveOption;
  const saveVersion = localStorage.getItem('version') || '1.0.0';
  const saveJson = localStorage.getItem('option');
  if (!saveJson) return undefined;
  const option = JSON.parse(saveJson);

  if (saveVersion !== version) {
    if (versionLt(version, '11.10')) {
      if (typeof option?.scrollMode === 'boolean')
        option.scrollMode = {
          enabled: option.scrollMode,
          spacing: option.scrollModeSpacing,
          imgScale: option.scrollModeImgScale,
          fitToWidth: option.scrollModeFitToWidth,
        };
      Reflect.deleteProperty(option, 'translation');
    }

    localStorage.setItem('version', version);
    localStorage.setItem('option', JSON.stringify(option));
  }

  saveOption = option;
  return saveOption;
};
