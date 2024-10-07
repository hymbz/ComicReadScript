import { querySelector } from 'helper';

interface Tag {
  e: HTMLElement;
  id: number;
  group: string;
  name: string;
  weight: number;
  watch: boolean;
  hidden: boolean;
}

let init = true;

export const sortTags = () => {
  const defaultColor =
    querySelector<HTMLInputElement>('#tagcolor')!.value.slice(1) || '000000';

  const root = document.getElementById('usertags_outer')!;
  const tagEleList = ([...root.children] as HTMLElement[]).slice(1);

  if (init) {
    GM_addStyle(`
      #usertags_outer {
        display: flex;
        flex-direction: column;
      }
      #usertags_outer > div { margin: unset; }
    `);
    for (const e of tagEleList) {
      e.dataset.id = e.id.split('usertag_')[1];
      e.style.viewTransitionName = e.id;
    }
  }

  const tagList: Tag[][] = [];
  for (const e of tagEleList) {
    const id = e.dataset.id!;

    const color = Number.parseInt(
      e.querySelector<HTMLInputElement>(`#tagcolor_${id}`)!.value.slice(1) ||
        defaultColor,
      16,
    );
    let [group, name] = e
      .querySelector<HTMLElement>(`#tagpreview_${id}`)!
      .title.split(':');
    // 合并性别相关的命名空间，以便不同命名空间下的相同标签可以排在一起
    switch (group) {
      case 'female':
      case 'male':
      case 'mixed':
        group = 'gender';
    }

    tagList[color] ||= [];
    tagList[color].push({
      e,
      id: Number(id),
      group,
      name,
      weight: Number(
        e.querySelector<HTMLInputElement>('input[id^=tagweight_]')!.value,
      ),
      watch: e.querySelector<HTMLInputElement>(`#tagwatch_${id}`)!.checked,
      hidden: e.querySelector<HTMLInputElement>(`#taghide_${id}`)!.checked,
    });
  }

  const sortDom = () => {
    const collator = new Intl.Collator();
    const sortFn = (a: Tag, b: Tag) => {
      if (a.weight !== b.weight) return a.weight - b.weight;
      if (a.watch !== b.watch) return a.watch ? 1 : -1;
      if (a.hidden !== b.hidden) return a.hidden ? -1 : 1;
      if (a.group !== b.group) return collator.compare(a.group, b.group);
      return collator.compare(a.name, b.name);
    };

    let i = tagEleList.length;
    // 因为使用稀疏数组进行排序，所以必须使用 forEach 跳过空槽
    // eslint-disable-next-line unicorn/no-array-for-each
    tagList.forEach((tags) => {
      for (const tag of tags.sort(sortFn)) tag.e.style.order = `${i--}`;
    });
  };
  if (init || !document.startViewTransition) sortDom();
  else document.startViewTransition(sortDom);

  init = false;
};
