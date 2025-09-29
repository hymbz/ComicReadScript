import { domParse } from 'helper';
import { request } from 'main';

const getTagSetHtml = async (tagset?: string) => {
  const url = tagset ? `/mytags?tagset=${tagset}` : '/mytags';
  const res = await request(url, { fetch: true });
  return domParse(res.responseText);
};

export type Tag = {
  e: HTMLElement;
  id: number;
  title: string;
  color: number;
  fontColor: string;
  borderColor: string;
  group: string;
  name: string;
  weight: number;
  watch: boolean;
  hidden: boolean;
  order: number;
};

const collectTags = (html: Document, tagList: Tag[] = []) => {
  const defaultColor =
    html.querySelector<HTMLInputElement>('#tagcolor')!.value.slice(1) || '0';
  const [, ...tagEleList] = [
    ...html.getElementById('usertags_outer')!.children,
  ] as HTMLElement[];

  for (const e of tagEleList) {
    const id = Number(e.id.split('usertag_')[1]);

    const preview = e.querySelector<HTMLElement>(`#tagpreview_${id}`)!;
    const { color: fontColor, borderColor } = preview.style;

    let [group, name] = preview.title.split(':');
    // 合并性别相关的命名空间，以便不同命名空间下的相同标签可以排在一起
    switch (group) {
      case 'female':
      case 'male':
      case 'mixed':
        group = 'gender';
    }

    const color = Number.parseInt(
      e.querySelector<HTMLInputElement>(`#tagcolor_${id}`)!.value.slice(1) ||
        defaultColor,
      16,
    );

    tagList.push({
      e,
      id,
      title: preview.title,
      color,
      fontColor,
      borderColor,
      group,
      name,
      weight: Number(
        e.querySelector<HTMLInputElement>('input[id^=tagweight_]')!.value,
      ),
      watch: e.querySelector<HTMLInputElement>(`#tagwatch_${id}`)!.checked,
      hidden: e.querySelector<HTMLInputElement>(`#taghide_${id}`)!.checked,
      order: -1,
    });
  }
  return tagList;
};

const sortTagList = (tagList: Tag[]) => {
  const collator = new Intl.Collator();
  const sortFn = (a: Tag, b: Tag) => {
    if (a.color !== b.color) return b.color - a.color;
    if (a.group !== b.group) return collator.compare(a.group, b.group);
    if (a.hidden !== b.hidden) return a.hidden ? 1 : -1;
    if (a.watch !== b.watch) return a.watch ? -1 : 1;
    if (a.weight !== b.weight) return b.weight - a.weight;
    return collator.compare(a.name, b.name);
  };

  // order 设为负数是为了在排列时能排在没有 order 值的元素前
  let i = -tagList.length;
  // oxlint-disable-next-line no-array-sort
  for (const tag of tagList.sort(sortFn)) tag.order = i++;
  return tagList;
};

const getMyTags = async () => {
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

  const tagList: Tag[] = [];
  for (const html of tagSetList) collectTags(html, tagList);
  return sortTagList(tagList);
};

export const handleMyTagsChange = new Set<
  (tagList: Tag[]) => unknown | Promise<unknown>
>();

export const updateMyTags = async () => {
  const tagList = await getMyTags();
  for (const fn of handleMyTagsChange) await fn(tagList);
};
