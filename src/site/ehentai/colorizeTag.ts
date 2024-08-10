import { request } from 'main';
import { domParse } from 'helper';

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
  `\n${[...tagList].map((tag) => `${prefix}${tag}`).join(',\n')}\n`;

const getTagSetHtml = async (tagset?: string) => {
  const url = tagset ? `/mytags?tagset=${tagset}` : '/mytags';
  const res = await request(url, { fetch: true });
  return domParse(res.responseText);
};

/** 获取最新的标签颜色数据 */
export const updateTagColor = async () => {
  const backgroundMap: Record<string, Set<string>> = {};
  const borderMap: Record<string, Set<string>> = {};
  const colorMap: Record<string, Set<string>> = {};

  const tagSetList: Document[] = [];
  // 获取所有标签集的 html
  const defaultTagSet = await getTagSetHtml();
  await Promise.all(
    [
      ...defaultTagSet.querySelectorAll<HTMLOptionElement>(
        '#tagset_outer select option',
      ),
    ].map(async (option) => {
      const tagSet = option.selected
        ? defaultTagSet
        : await getTagSetHtml(option.value);
      if (tagSet.querySelector<HTMLInputElement>('#tagset_enable')?.checked)
        tagSetList.push(tagSet);
    }),
  );

  for (const html of tagSetList) {
    for (const tagDom of html.querySelectorAll<HTMLElement>(
      '#usertags_outer [id^=tagpreview_]',
    )) {
      const { color, borderColor, background } = tagDom.style;
      const tag = tagDom.title.replaceAll(' ', '_').replaceAll(':', '\\:');
      if (!tag) continue;

      backgroundMap[background] ||= new Set();
      backgroundMap[background].add(tag);
      borderMap[borderColor] ||= new Set();
      borderMap[borderColor].add(tag);
      colorMap[color] ||= new Set();
      colorMap[color].add(tag);
    }
  }

  let css = '';
  for (const [background, tagList] of Object.entries(backgroundMap)) {
    css += `:is(${buildTagList(tagList, '#td_')})`;
    css += `{ background: ${background}; }\n\n`;
  }
  for (const [border, tagList] of Object.entries(borderMap)) {
    // 强标签直接覆盖边框颜色
    css += `:is(${buildTagList(tagList, '#td_')}).gt`;
    css += `{ border-color: ${border}; }\n\n`;
  }
  for (const [color, tagList] of Object.entries(colorMap)) {
    // 弱标签将边框颜色改为字体颜色突出显示
    css += `:is(${buildTagList(tagList, '#td_')}):not(.gt)`;
    css += `{ border-color: ${color}; }\n\n`;

    css += `#taglist a:is(${buildTagList(tagList, '#ta_')})`;
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

const getTagColorizeCss = async () => {
  let colorizeCss = await GM.getValue<string>('ehTagColorizeCss');
  colorizeCss ||= await updateTagColor();
  return colorizeCss;
};

/** 标签染色 */
export const colorizeTag = async (pageType: PageType) => {
  switch (pageType) {
    case 'gallery': {
      let css =
        location.origin === 'https://exhentai.org'
          ? '--tag: #DDDDDD; --tag-hover: #EEEEEE; --tup: #00E639; --tdn: #FF3333;'
          : '--tag: #5C0D11; --tag-hover: #8F4701; --tup: green; --tdn: red;';
      css = `#taglist { ${css} }\n\n${await getTagColorizeCss()}`;
      return GM_addStyle(css);
    }

    case 'mytags': {
      // 进入时更新
      updateTagColor();
      // 增删标签时会自动刷新页面触发这个更新

      // 点击保存按钮时删除保存的 css，以便在下次需要时重新获取
      document.addEventListener(
        'click',
        (e) =>
          (e.target as HTMLElement).tagName === 'BUTTON' &&
          (e.target as HTMLElement).id.startsWith('tagsave_') &&
          GM.deleteValue('ehTagColorizeCss'),
      );
    }

    // 除了在 mytags 里更新外，还可以在列表页检查高亮的标签和脚本存储的标签颜色数据是否对应，
    // 在发现不对应时自动更新。但目前我最常用的「缩略图」模式只会返回高亮的标签，
    // 只能检查在 mytags 里删除了标签的情况，所以暂且不实现。
    // 等之后找到办法可以在不额外发起请求的情况下在列表页获取每个画廊的所有标签时再实现
  }
};
