import {
  hijackFn,
  querySelector,
  querySelectorAll,
  singleThreaded,
  t,
} from 'helper';
import { createSignal, For, Show, type Component } from 'solid-js';
import { render } from 'solid-js/web';
import {
  getTagLintRules,
  hasTag,
  isMissingNamespace,
  isMissingTags,
  splitTagNamespace,
} from 'userscript/ehTagRules';

import type { PageType } from '.';

export const tagLint = (pageType: PageType) => {
  if (pageType !== 'gallery') return;

  /** 是否是「Doujinshi」「Manga」「Non-H」 */
  const isManga = querySelector('#gdc > .cs:is(.ct2, .ct3, .ct9)');

  const lintRules = getTagLintRules();
  type RuleNames = keyof typeof lintRules;
  type WarnList = Partial<
    Record<RuleNames, Map<string, string[]>> & {
      other: Array<[string, string[]]>;
    }
  >;
  const [warnList, setWarnList] = createSignal<WarnList>({});

  GM_addStyle(`
    #comidread-tag-lint [id^=td_] {
      display: inline-block;
      float: none;
    }
  `);

  const getTagClass = (tag: string, weak?: boolean) => {
    if (weak === undefined)
      return document.getElementById(`td_${tag}`)?.className;
    return weak ? 'gtl' : 'gt';
  };

  const _Tag: Component<{ name: string; weak?: boolean }> = (props) => (
    <div id={`td_${props.name}`} class={getTagClass(props.name, props.weak)}>
      <a
        id={`ta_${props.name}`}
        href={`https://exhentai.org/tag/${props.name.replaceAll('_', '+')}`}
        onClick={(e) => e.preventDefault()}
        children={props.name}
      />
    </div>
  );

  const Tag: Component<{ name: string; weak?: boolean }> = (props) => {
    const tags = splitTagNamespace(props.name);
    return (
      <Show when={tags.length > 1} fallback={_Tag(props)}>
        <span>
          「
          <For each={tags}>
            {(name, i) => (
              <>
                {i() ? ` ${t('other.or')} ` : ''}
                <_Tag name={name} weak={props.weak} />
              </>
            )}
          </For>
          」
        </span>
      </Show>
    );
  };

  const WarnItem: Component<{
    warnList?: Map<string, string[]>;
    text: string;
    weak?: boolean;
  }> = (props) => {
    const [before, middle, after] = props.text.split('[tag]');
    return (
      <Show when={props.warnList?.size}>
        <For each={[...props.warnList!.entries()]}>
          {([tag, tags]) => (
            <li>
              {before}
              <Tag name={tag} />
              {middle}
              <For each={tags}>
                {(tagName) => <Tag name={tagName} weak={props.weak} />}
              </For>
              {after}
            </li>
          )}
        </For>
      </Show>
    );
  };

  /** 获取所有标签 */
  const getTaglist = () => {
    const lockTags = new Set<string>();
    const weakTags = new Set<string>();
    for (const tag of querySelectorAll('#taglist [id^=td_]')) {
      const [a] = tag.getElementsByTagName('a');
      // 跳过点踩的标签
      if (a.classList.contains('tdn')) continue;
      if (a.classList.contains('tup') || tag.classList.contains('gt'))
        lockTags.add(tag.id.slice(3));
      else if (tag.classList.contains('gtl')) weakTags.add(tag.id.slice(3));
    }
    return [lockTags, weakTags] as const;
  };

  let root: HTMLDivElement;
  let dispose: () => void;
  const updateLint = singleThreaded(() => {
    const newWarnList: WarnList = {};
    const [lockTags, weakTags] = getTaglist();
    const tagList = new Set([...lockTags, ...weakTags]);

    /** 根据指定规则检查标签并记录 */
    const checkRules = (tag: string, ruleName: RuleNames, has = false) => {
      const rules = lintRules[ruleName];
      if (!rules.has(tag)) return;
      for (const targetTag of rules.get(tag)!) {
        // 检测应该存在的标签时，只检查锁定标签，方便快速点赞
        if (hasTag(has ? lockTags : tagList, targetTag) === has) continue;
        newWarnList[ruleName] ||= new Map([[tag, []]]);
        const warn = newWarnList[ruleName];
        if (!warn.has(tag)) warn.set(tag, []);
        warn.get(tag)!.push(targetTag);
      }
    };

    for (const tag of tagList) {
      checkRules(tag, 'prerequisite', true);
      checkRules(tag, 'conflict');
      if (isManga) checkRules(tag, 'possibleConflict');
      checkRules(tag, 'combo', true);
    }

    const addOtherWarn = (text: string, tags: string[]) => {
      newWarnList.other ||= [];
      newWarnList.other.push([text, tags]);
    };

    // 涉及到图库类型的，比较复杂的检查
    if (
      querySelector('#gdc > .cs.ct2') &&
      isMissingNamespace(tagList, 'parody')
    )
      addOtherWarn(t('eh_tag_lint.miss_parody'), ['parody:original']);
    if (
      isManga &&
      isMissingTags(
        tagList,
        'female:females_only',
        'female:futanari',
        'female:shemale',
      ) &&
      isMissingNamespace(tagList, 'male', 'mixed')
    )
      addOtherWarn(t('eh_tag_lint.miss_female'), ['female:females_only']);

    setWarnList(newWarnList);

    if (!root?.isConnected) {
      root = document.createElement('div');
      root.id = 'comidread-tag-lint';
      querySelector('#taglist')!.append(root);
    }
    dispose?.();
    dispose = render(
      () => (
        <Show when={Object.keys(warnList()).length}>
          <hr />
          <ul>
            <For each={warnList().other}>
              {([text, tags]) => (
                <li>
                  {text}
                  <For each={tags}>
                    {(tagName) => <Tag name={tagName} weak />}
                  </For>
                </li>
              )}
            </For>
            <WarnItem
              warnList={warnList().prerequisite}
              text={t('eh_tag_lint.prerequisite')}
              weak={false}
            />
            <WarnItem
              warnList={warnList().conflict}
              text={t('eh_tag_lint.conflict')}
            />
            <WarnItem
              warnList={warnList().possibleConflict}
              text={t('eh_tag_lint.possible_conflict')}
            />
            <WarnItem
              warnList={warnList().combo}
              text={t('eh_tag_lint.combo')}
              weak
            />
          </ul>
        </Show>
      ),
      root,
    );
  });

  updateLint();

  // 投票后重新渲染
  hijackFn('tag_update_vote', updateLint);
};