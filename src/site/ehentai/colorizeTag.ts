import { debounce, getGmValue, hijackFn } from 'helper';

import { updateMyTags, handleMyTagsChange, type Tag } from './myTags';

import { type PageType } from '.';

// 为每个标签单独生成 css。用于方便调试时排查和修改样式时使用
// const buildTagColorCss = (
//   tag: string,
//   color: string,
//   border: string,
//   background: string,
// ) => `
//   #td_${tag} { background: ${background}; }
//   #td_${tag}.gt { border-color: ${border}; }
//   #td_${tag}:not(.gt) { border-color: ${color}; }
//   #taglist a#ta_${tag} { color: ${color} !important; position: relative; }
// `;

const buildTagList = (tagList: Set<string>, prefix: string) =>
  `\n${[...tagList].map((tag) => `${prefix}${CSS.escape(tag)}`).join(',\n')}\n`;

/** 获取最新的标签颜色数据 */
export const updateTagColor = async (tagList: Tag[]) => {
  const backgroundMap: Record<string, Set<string>> = {};
  const borderMap: Record<string, Set<string>> = {};
  const colorMap: Record<string, Set<string>> = {};

  for (const tag of tagList) {
    const { title, color, borderColor, fontColor } = tag;
    backgroundMap[color] ||= new Set();
    backgroundMap[color].add(title);
    borderMap[borderColor] ||= new Set();
    borderMap[borderColor].add(title);
    colorMap[fontColor] ||= new Set();
    colorMap[fontColor].add(title);
  }

  let css = '';
  for (const [background, tags] of Object.entries(backgroundMap)) {
    css += `:is(${buildTagList(tags, '#td_')})`;
    css += `{ background: #${Number(background).toString(16).padStart(6, '0')}; }\n\n`;
  }
  for (const [border, tags] of Object.entries(borderMap)) {
    // 强标签直接覆盖边框颜色
    css += `:is(${buildTagList(tags, '#td_')}).gt`;
    css += `{ border-color: ${border}; }\n\n`;
  }
  for (const [color, tags] of Object.entries(colorMap)) {
    // 弱标签将边框颜色改为字体颜色突出显示
    css += `:is(${buildTagList(tags, '#td_')}):not(.gt)`;
    css += `{ border-color: ${color}; }\n\n`;

    css += `#taglist a:is(${buildTagList(tags, '#ta_')})`;
    css += `{ color: ${color} !important; position: relative; }\n\n`;
  }

  css += `
    /* 禁用 eh 的变色效果 */
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

  await GM.setValue('ehTagColorizeCss', css);
  return css;
};

/** 标签染色 */
export const colorizeTag = async (pageType: PageType) => {
  handleMyTagsChange.add(updateTagColor);

  switch (pageType) {
    case 'gallery': {
      let css =
        location.origin === 'https://exhentai.org'
          ? '--tag: #DDDDDD; --tag-hover: #EEEEEE; --tup: #00E639; --tdn: #FF3333;'
          : '--tag: #5C0D11; --tag-hover: #8F4701; --tup: green; --tdn: red;';
      css = `#taglist { ${css} }\n\n`;
      css += await getGmValue('ehTagColorizeCss', updateMyTags);
      return GM_addStyle(css);
    }

    case 'mytags': {
      updateMyTags();
      hijackFn('usertag_callback', debounce(updateMyTags));
    }

    // 除了在 mytags 里更新外，还可以在列表页检查高亮的标签和脚本存储的标签颜色数据是否对应，
    // 在发现不对应时自动更新。但目前我最常用的「缩略图」模式只会返回高亮的标签，
    // 只能检查在 mytags 里删除了标签的情况，所以暂且不实现。
    // 等之后找到办法可以在不额外发起请求的情况下在列表页获取每个画廊的所有标签时再实现
  }
};
