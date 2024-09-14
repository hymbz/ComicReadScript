import type { Meta, StoryObj } from 'storybook-solidjs';
import { mergeProps } from 'solid-js';
import rfdc from 'rfdc';
import { request } from 'request';

import { _setState, Manga, type MangaProps } from '../components/Manga';
import { defaultOption } from '../components/Manga/store/option';
import { initStore, refs, setState } from '../components/Manga/store';
import { Toaster } from '../components/Toast';

import { imgList } from './helper';

const cloneArray = (arr: string[], count: number) =>
  ([] as string[]).concat(...Array.from<string[]>({ length: count }).fill(arr));

const deepClone = rfdc({ proto: true, circles: false });

export type Props = Partial<
  MangaProps & { 图源: keyof typeof imgList; cloneImgList?: number }
>;

window.GM_xmlhttpRequest = (async (details: Tampermonkey.Request) => {
  const res = await request(details.url, { ...details, fetch: true });
  details.onload?.call(res as any, res as any);
}) as any;

const meta = {
  title: 'Default',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    图源: { control: 'radio', options: Object.keys(imgList) },
    option: { control: 'object', name: '配置' },
  },
  args: {
    图源: '饮茶之时、女仆之梦（彩图）',
  } satisfies Props,
  component: Manga,
  render(props: Props) {
    return (
      <>
        <Manga
          {...mergeProps(props, {
            imgList: props.图源
              ? cloneArray(imgList[props.图源], props.cloneImgList ?? 1)
              : props.imgList!,
            option:
              props.option && Object.assign(defaultOption(), props.option),
          })}
        />
        <Toaster />
      </>
    );
  },
  beforeEach() {
    setState((state) => Object.assign(state, deepClone(initStore)));
    refs.root?.scrollTo(0, 0);
  },
} satisfies Meta<typeof Manga>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    图源: '透过百合SM能否连结两人的身心呢（跨页）',
  } satisfies Props,
};

export const 卷轴模式: Story = {
  args: {
    图源: '方便的陪跑友（四格）',
    option: { scrollMode: { enabled: true, imgScale: 0.5 } },
  } satisfies Props,
};

export const 并排卷轴模式: Story = {
  args: {
    图源: '方便的陪跑友（四格）',
    option: { scrollMode: { enabled: true, abreastMode: true, imgScale: 0.5 } },
  } satisfies Props,
};

export const 网格模式: Story = {
  args: {
    图源: '若爱在眼前（跨页+小图）',
  } satisfies Props,
  async play() {
    _setState('gridMode', true);
  },
};
