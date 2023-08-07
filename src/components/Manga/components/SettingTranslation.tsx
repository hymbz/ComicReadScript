import { createMemo, Show } from 'solid-js';

import { SettingsItemSwitch } from './SettingsItemSwitch';
import { SettingsItemSelect } from './SettingsItemSelect';
import { createStateSetFn, setOption } from '../hooks/useStore/slice';
import {
  setImgTranslationEnbale,
  translatorOptions,
} from '../hooks/useStore/slice/Translation';
import { store } from '../hooks/useStore';

import classes from '../index.module.css';
import { SettingsShowItem } from './SettingsShowItem';

export const SettingTranslation = () => {
  /** 是否正在翻译全部图片 */
  const isTranslationAll = createMemo(() =>
    store.imgList.every(
      (img) => img.translationType === 'show' || img.translationType === 'wait',
    ),
  );

  return (
    <>
      <SettingsItemSelect
        name="翻译服务器"
        options={[['禁用'], ['本地部署'], ['cotrans']]}
        value={store.option.translation.server}
        onChange={createStateSetFn('translation.server')}
      />

      <SettingsShowItem when={store.option.translation.server === 'cotrans'}>
        <blockquote>
          <p>
            将使用{' '}
            <a href="https://cotrans.touhou.ai" target="_blank">
              Cotrans
            </a>{' '}
            提供的接口翻译图片，该服务器由维护者用爱发电自费维护
          </p>
          <p>
            多人同时使用时需要排队等待，等待队列达到上限后再上传新图片会报错，需要过段时间再试
          </p>
          <p>
            所以还请<b>注意用量</b>
          </p>
          <p>更推荐使用本地部署的项目，不抢服务器资源也不需要排队</p>
        </blockquote>
      </SettingsShowItem>

      <SettingsShowItem when={store.option.translation.server !== '禁用'}>
        <SettingsItemSelect
          name="文本扫描清晰度"
          options={[
            ['S', '1024px'],
            ['M', '1536px'],
            ['L', '2048px'],
            ['X', '2560px'],
          ]}
          value={store.option.translation.options.size}
          onChange={createStateSetFn('translation.options.size')}
        />
        <SettingsItemSelect
          name="文本扫描器"
          options={[['default'], ['ctd', 'Comic Text Detector']]}
          value={store.option.translation.options.detector}
          onChange={createStateSetFn('translation.options.detector')}
        />
        <SettingsItemSelect
          name="翻译服务"
          options={translatorOptions()}
          value={store.option.translation.options.translator}
          onChange={createStateSetFn('translation.options.translator')}
        />
        <SettingsItemSelect
          name="渲染字体方向"
          options={[
            ['auto', '自动'],
            ['h', '水平'],
            ['v', '垂直'],
          ]}
          value={store.option.translation.options.direction}
          onChange={createStateSetFn('translation.options.direction')}
        />
        <SettingsItemSelect
          name="目标语言"
          options={[
            ['CHS', '简体中文'],
            ['CHT', '繁體中文'],
            ['JPN', '日本語'],
            ['ENG', 'English'],
            ['KOR', '한국어'],
            ['VIN', 'Tiếng Việt'],
            ['CSY', 'čeština'],
            ['NLD', 'Nederlands'],
            ['FRA', 'français'],
            ['DEU', 'Deutsch'],
            ['HUN', 'magyar nyelv'],
            ['ITA', 'italiano'],
            ['PLK', 'polski'],
            ['PTB', 'português'],
            ['ROM', 'limba română'],
            ['RUS', 'русский язык'],
            ['ESP', 'español'],
            ['TRK', 'Türk dili'],
          ]}
          value={store.option.translation.options.targetLanguage}
          onChange={createStateSetFn('translation.options.targetLanguage')}
        />

        <SettingsItemSwitch
          name="忽略缓存强制重试"
          value={store.option.translation.forceRetry}
          onChange={createStateSetFn('translation.forceRetry')}
        />

        <Show when={store.option.translation.server === '本地部署'}>
          <SettingsItemSwitch
            name="翻译全部图片"
            value={isTranslationAll()}
            onChange={() =>
              setImgTranslationEnbale(
                store.imgList.map((_, i) => i),
                !isTranslationAll(),
              )
            }
          />

          <SettingsItemSwitch
            name="自定义服务器 URL"
            value={store.option.translation.localUrl !== undefined}
            onChange={(val) => {
              setOption((draftOption) => {
                draftOption.translation.localUrl = val ? '' : undefined;
              });
            }}
          />

          <Show when={store.option.translation.localUrl !== undefined}>
            <input
              type="url"
              class={classes.SettingsItem}
              onChange={(e) => {
                setOption((draftOption) => {
                  // 删掉末尾的斜杠
                  const url = e.target.value.replace(/\/$/, '');
                  draftOption.translation.localUrl = url;
                });
              }}
            />
          </Show>
        </Show>
      </SettingsShowItem>
    </>
  );
};
