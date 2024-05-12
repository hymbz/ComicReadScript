const getTagText = (ele: HTMLElement) => {
  let text = ele.nodeName;
  if (ele.id && !/\d/.test(ele.id)) text += `#${ele.id}`;
  return text;
};

/** 获取元素仅记录了层级结构关系的选择器 */
export const getEleSelector = (ele: HTMLElement) => {
  const parents: string[] = [ele.nodeName];
  const root = ele.getRootNode();
  let e = ele;
  while (e.parentNode && e.parentNode !== root) {
    e = e.parentNode as HTMLElement;
    parents.push(getTagText(e));
  }

  return parents.reverse().join('>');
};

/** 判断指定元素是否符合选择器 */
export const isEleSelector = (ele: HTMLElement, selector: string) => {
  const parents = selector.split('>').reverse();
  let e = ele;
  for (let i = 0; e && i < parents.length; i++) {
    if (getTagText(e) !== parents[i]) return false;
    e = e.parentNode as HTMLElement;
  }

  return e === e.getRootNode();
};

// 目录页和漫画页的图片层级相同
// https://www.biliplus.com/manga/
// 图片路径上有 id 元素并且 id 含有漫画 id，不同话数 id 也不同
// https://rawkuma.com/manga/shokei-shoujo-no-ikiru-michi/
