import type { MangaProps } from 'components/Manga';

import { versionLt } from 'userscript/main/migration';

import { version } from '../../../package.json' with { type: 'json' };

let saveOption: MangaProps['option'] | undefined;

export const getSaveOption = (): MangaProps['option'] => {
  if (saveOption) return saveOption;
  const saveVersion = localStorage.getItem('@version') || '1.0.0';
  const saveJson = localStorage.getItem('@option');
  if (!saveJson) return undefined;
  const option = JSON.parse(saveJson);

  if (saveVersion !== version) {
    localStorage.setItem('@version', version);
    if (versionLt(version, '12.3.3')) localStorage.removeItem('@option');
  }

  saveOption = option;
  return saveOption;
};
