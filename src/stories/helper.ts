import { userEvent } from '@storybook/test';
import { t, wait } from 'helper';

import { refs } from '../components/Manga/store';
import classes from '../components/Manga/index.module.css';

export const clickSettingButton = () =>
  userEvent.click(
    refs.root.querySelector(`[aria-label="${t('button.setting')}"]`)!,
  );

export const getByText = (selector: string, text: string) => {
  for (const e of refs.root.querySelectorAll(selector))
    if (e.textContent!.trim() === text) return e;
};

export const clickSettingItem = async (...nameList: string[]) => {
  await clickSettingButton();
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

export const imgList = {
  '透过百合SM能否连结两人的身心呢（跨页）': [
    '/透过百合SM能否连结两人的身心呢？/00.webp',
    '/透过百合SM能否连结两人的身心呢？/01.png',
    '/透过百合SM能否连结两人的身心呢？/02.webp',
    '/透过百合SM能否连结两人的身心呢？/03.jpeg',
    '/透过百合SM能否连结两人的身心呢？/04.jpeg',
    '/透过百合SM能否连结两人的身心呢？/05.webp',
    '/透过百合SM能否连结两人的身心呢？/06.webp',
    '/透过百合SM能否连结两人的身心呢？/07.webp',
    '/透过百合SM能否连结两人的身心呢？/08.webp',
    '/透过百合SM能否连结两人的身心呢？/09.jpeg',
    '/透过百合SM能否连结两人的身心呢？/10.webp',
    '/透过百合SM能否连结两人的身心呢？/11.jpeg',
    '/透过百合SM能否连结两人的身心呢？/12.jpeg',
    '/透过百合SM能否连结两人的身心呢？/13.jpeg',
    '/透过百合SM能否连结两人的身心呢？/14.jpeg',
    '/透过百合SM能否连结两人的身心呢？/15.jpeg',
    '/透过百合SM能否连结两人的身心呢？/16.jpeg',
    '/透过百合SM能否连结两人的身心呢？/17.webp',
  ],
  '若爱在眼前（跨页+小图）': [
    '/若爱在眼前/00.jpeg',
    '/若爱在眼前/01.jpeg',
    '/若爱在眼前/02.jpeg',
    '/若爱在眼前/03.jpeg',
    '/若爱在眼前/04.jpeg',
    '/若爱在眼前/05.jpeg',
    '/若爱在眼前/06.jpeg',
    '/若爱在眼前/07.jpeg',
    '/若爱在眼前/08.jpeg',
    '/若爱在眼前/09.jpeg',
    '/若爱在眼前/10.jpeg',
    '/若爱在眼前/11.jpeg',
    '/若爱在眼前/12.jpeg',
    '/若爱在眼前/13.jpeg',
    '/若爱在眼前/14.jpeg',
    '/若爱在眼前/15.jpeg',
    '/若爱在眼前/16.jpeg',
    '/若爱在眼前/17.jpeg',
    '/若爱在眼前/18.jpeg',
    '/若爱在眼前/19.jpeg',
    '/若爱在眼前/20.jpeg',
    '/若爱在眼前/21.jpeg',
    '/若爱在眼前/22.jpeg',
    '/若爱在眼前/23.jpeg',
    '/若爱在眼前/24.jpeg',
    '/若爱在眼前/25.jpeg',
    '/若爱在眼前/26.jpeg',
    '/若爱在眼前/27.jpeg',
    '/若爱在眼前/28.jpeg',
    '/若爱在眼前/29.jpeg',
    '/若爱在眼前/30.jpeg',
    '/若爱在眼前/31.jpeg',
    '/若爱在眼前/32.jpeg',
    '/若爱在眼前/33.jpeg',
    '/若爱在眼前/34.jpeg',
    '/若爱在眼前/35.jpeg',
    '/若爱在眼前/36.webp',
  ],
  '方便的陪跑友（四格）': [
    '/方便的陪跑友/01.jpeg',
    '/方便的陪跑友/02.jpeg',
    '/方便的陪跑友/03.webp',
    '/方便的陪跑友/04.webp',
    '/方便的陪跑友/05.webp',
    '/方便的陪跑友/06.webp',
    '/方便的陪跑友/07.webp',
    '/方便的陪跑友/08.jpeg',
    '/方便的陪跑友/09.webp',
    '/方便的陪跑友/10.webp',
    '/方便的陪跑友/11.webp',
    '/方便的陪跑友/12.jpeg',
    '/方便的陪跑友/13.jpeg',
  ],
  '饮茶之时、女仆之梦（彩图）': [
    '/饮茶之时、女仆之梦/00.webp',
    '/饮茶之时、女仆之梦/01.webp',
    '/饮茶之时、女仆之梦/02.webp',
    '/饮茶之时、女仆之梦/03.jpeg',
    '/饮茶之时、女仆之梦/04.webp',
    '/饮茶之时、女仆之梦/05.jpeg',
    '/饮茶之时、女仆之梦/06.webp',
    '/饮茶之时、女仆之梦/07.jpeg',
    '/饮茶之时、女仆之梦/08.jpeg',
    '/饮茶之时、女仆之梦/09.jpeg',
    '/饮茶之时、女仆之梦/10.jpeg',
    '/饮茶之时、女仆之梦/11.jpeg',
    '/饮茶之时、女仆之梦/12.jpeg',
    '/饮茶之时、女仆之梦/13.jpeg',
    '/饮茶之时、女仆之梦/14.jpeg',
    '/饮茶之时、女仆之梦/15.jpeg',
    '/饮茶之时、女仆之梦/16.jpeg',
    '/饮茶之时、女仆之梦/17.jpeg',
    '/饮茶之时、女仆之梦/18.jpeg',
    '/饮茶之时、女仆之梦/19.jpeg',
    '/饮茶之时、女仆之梦/20.jpeg',
    '/饮茶之时、女仆之梦/21.jpeg',
    '/饮茶之时、女仆之梦/22.jpeg',
    '/饮茶之时、女仆之梦/23.jpeg',
    '/饮茶之时、女仆之梦/24.jpeg',
    '/饮茶之时、女仆之梦/25.jpeg',
    '/饮茶之时、女仆之梦/26.jpeg',
    '/饮茶之时、女仆之梦/27.jpeg',
    '/饮茶之时、女仆之梦/28.webp',
    '/饮茶之时、女仆之梦/29.webp',
    '/饮茶之时、女仆之梦/30.webp',
  ],
};
