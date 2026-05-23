import { css, debounce, ensureGmValue, hijackFn } from 'helper';

import { type EhFeatureHandler } from './helper';
import { type Tag, handleMyTagsChange, updateMyTags } from './myTags';
import { sortTags } from './sortTags';

const buildTagList = (tagList: Set<string>, prefix: string) =>
  `\n${Array.from(tagList, (tag) => `${prefix}${CSS.escape(tag)}`).join(',\n')}\n`;

/** 获取最新的标签颜色数据 */
export const updateTagColor = async (tagList: Tag[]) => {
  const backgroundMap: Record<string, Set<string>> = {};
  const borderMap: Record<string, Set<string>> = {};
  const colorMap: Record<string, Set<string>> = {};

  for (const tag of tagList) {
    const { color, borderColor, fontColor } = tag;
    const title = tag.title.replaceAll(' ', '_');
    (backgroundMap[color] ||= new Set()).add(title);
    (borderMap[borderColor] ||= new Set()).add(title);
    (colorMap[fontColor] ||= new Set()).add(title);
  }

  let cssText = '';
  for (const [background, tags] of Object.entries(backgroundMap)) {
    cssText += `:is(${buildTagList(tags, '#td_')})`;
    cssText += `{ background: #${Number(background).toString(16).padStart(6, '0')}; }\n\n`;
  }
  for (const [border, tags] of Object.entries(borderMap)) {
    // 强标签直接覆盖边框颜色
    cssText += `:is(${buildTagList(tags, '#td_')}).gt`;
    cssText += `{ border-color: ${border}; }\n\n`;
  }
  for (const [color, tags] of Object.entries(colorMap)) {
    // 弱标签将边框颜色改为字体颜色突出显示
    cssText += `:is(${buildTagList(tags, '#td_')}):not(.gt)`;
    cssText += `{ border-color: ${color}; }\n\n`;

    cssText += `#taglist a:is(${buildTagList(tags, '#ta_')})`;
    cssText += `{ color: ${color} !important; position: relative; }\n\n`;
  }

  cssText += `
    /* 禁用 eh 的变色效果，必须使用 !important */
    #taglist a[id] { color: var(--tag) !important; position: relative; }
    #taglist a[id]:hover { color: var(--tag-hover) !important; }

    #taglist a[id]::after {
      content: "";
      background: var(--color);
      width: 100%;
      position: absolute;
      left: 0;
      height: 2px;
      bottom: -7px;
    }
    .tup { --color: var(--tup) }
    .tdn { --color: var(--tdn) }
    #taglist a[id][style="color: blue;"] { --color: blue; }

    /* 避免被上一行的下划线碰到 */
    #taglist div:is(.gt, .gtl, .gtw) { margin-top: 1px; }
  `;

  await GM.setValue('ehTagColorizeCss', cssText);
  return cssText;
};

/** 标签染色 */
export const colorizeTag: EhFeatureHandler = async (_, pageCtx) => {
  handleMyTagsChange.add(updateTagColor);

  switch (pageCtx.type) {
    case 't':
    case 'gallery': {
      let cssText =
        getComputedStyle(document.body).backgroundColor === 'rgb(52, 53, 59)'
          ? '--tag: #DDDDDD; --tag-hover: #EEEEEE; --tup: #00E639; --tdn: #FF3333;'
          : '--tag: #5C0D11; --tag-hover: #8F4701; --tup: green; --tdn: red;';
      cssText = `#taglist { ${cssText} }\n\n`;
      cssText += await ensureGmValue('ehTagColorizeCss', updateMyTags);
      css(cssText);
      break;
    }

    case 'mytags': {
      hijackFn('usertag_callback', debounce(updateMyTags));
      await updateMyTags();
      break;
    }

    // 除了在 mytags 里更新外，还可以在列表页检查高亮的标签和脚本存储的标签颜色数据是否对应，
    // 在发现不对应时自动更新。但目前我最常用的「缩略图」模式只会返回高亮的标签，
    // 只能检查在 mytags 里删除了标签的情况，所以暂且不实现。
    // 等之后找到办法可以在不额外发起请求的情况下在列表页获取每个画廊的所有标签时再实现
  }

  await sortTags(pageCtx);
};
