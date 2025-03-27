import { userEvent } from '@storybook/test';
import { sleep, t, wait } from 'helper';

import { refs } from '../components/Manga/store';
import classes from '../components/Manga/index.module.css';
import { imgList as comicImgList } from '../components/Manga';

/** 点击侧边栏按钮 */
export const clickToolbarButton = (name = t('other.setting')) => {
  const button = refs.root.querySelector<HTMLElement>(
    `[aria-label="${name}"]`,
  )!;
  button.style.pointerEvents = 'auto';
  return userEvent.click(button);
};

export const getByText = (selector: string, text: string) => {
  for (const e of refs.root.querySelectorAll(selector))
    if (e.textContent!.trim() === text) return e;
};

export const clickSettingItem = async (...nameList: string[]) => {
  await clickToolbarButton();
  await wait(() => refs.root.querySelector(`.${classes.SettingPanel}`));

  let dom: Element | undefined | null;
  for (const name of nameList) {
    dom = getByText(
      `.${classes.SettingsItemName}, .${classes.SettingBlockSubtitle}`,
      name,
    );
    if (dom) await userEvent.click(dom);
  }

  dom = dom?.nextElementSibling;
  if (!dom) return;

  await userEvent.click(dom);
  return dom;
};

export const waitImgLoaded = async () => {
  await wait(() =>
    comicImgList().every(
      (img) => img.loadType !== 'wait' && img.loadType !== 'loading',
    ),
  );
  await sleep(1000);
};

const buildImgList = (path: string, length: number) => {
  const numLength = `${length}`.length;
  return Array.from(
    { length },
    (_, i) => `${path}/${`${i}`.padStart(numLength, '0')}.webp`,
  );
};

export const imgList = {
  '透过百合SM能否连结两人的身心呢（跨页）': buildImgList(
    '/透过百合SM能否连结两人的身心呢？',
    18,
  ),
  '若爱在眼前（跨页+小图）': buildImgList('/若爱在眼前', 37),
  '方便的陪跑友（四格）': buildImgList('/方便的陪跑友', 13),
  '饮茶之时、女仆之梦（彩图）': buildImgList('/饮茶之时、女仆之梦', 31),
};
