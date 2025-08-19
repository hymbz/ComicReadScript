import type { JSX } from 'solid-js';

import MDLaunch from '@material-design-icons/svg/round/launch.svg';
import { createSignal, Show } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { render } from 'solid-js/web';

import { domParse, hijackFn, querySelector, useStyle } from 'helper';
import { request } from 'main';

import type { GalleryContext } from './helper';

import { escHandler } from './helper';

/** 快捷查看标签定义 */
export const quickTagDefine = (_: GalleryContext) => {
  const tagContent = createMutable<Record<string, JSX.Element>>({});

  const saveTagContent = async (tag: string) => {
    if (Reflect.has(tagContent, tag)) return;

    const url = `https://ehwiki.org/wiki/${tag.replaceAll(/[a-z]+:\s?/gi, '')}`;
    const res = await request(url, { noCheckCode: true });
    if (res.status !== 200) {
      tagContent[tag] = <h3>{`${res.status} - ${res.statusText}`}</h3>;
      return;
    }

    const html = domParse(res.responseText);
    const content = html.querySelector('#mw-content-text')!;

    // 将相对链接转换成正确的链接
    for (const dom of content.querySelectorAll<HTMLImageElement>(
      'img[src^="/"]',
    ))
      dom.setAttribute('src', `https://ehwiki.org${dom.getAttribute('src')}`);
    for (const dom of content.getElementsByTagName('a')) {
      const href = dom.getAttribute('href') ?? '';
      if (href.startsWith('/'))
        dom.setAttribute('href', `https://ehwiki.org${href}`);
      dom.target = '_blank';
    }

    // 删掉附加图
    for (const dom of content.querySelectorAll('.thumb')) dom.remove();

    tagContent[tag] = (
      <>
        <h1>
          <a href={url} target="_blank">
            {tag}
            <MDLaunch />
          </a>
        </h1>
        {content}
      </>
    );
  };

  useStyle(`
    #comidread-tag-define {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      text-align: start;
      padding: 0 1em;
      box-sizing: border-box;
    }

    #taglist {
      position: relative;
    }

    #comidread-tag-define h1 {
      border-bottom: 1px solid #a2a9b1;
      margin: 0.4em 0;
    }

    #comidread-tag-define h1 svg {
      height: 0.7em;
      margin-left: 0.2em;
    }

    #comidread-tag-define ul {
      margin: 0.3em 0 0 1.6em;
      padding: 0;
    }

    #comidread-tag-define li {
      margin-bottom: 0.2em;
    }

    #comidread-tag-define div a {
      text-decoration: underline;
    }

    #comidread-tag-define dd {
      margin-left: 1.6em;
    }

    #comidread-tag-define dl {
      margin-top: 0.2em;
      margin-bottom: 0.5em;
    }
  `);

  const [show, setShow] = createSignal(false);

  const root = querySelector('#taglist')!;
  let background = 'rgba(0, 0, 0, 0)';
  let dom = root;
  while (background === 'rgba(0, 0, 0, 0)') {
    background = getComputedStyle(dom).backgroundColor;
    dom = dom.parentElement!;
  }

  render(
    () => (
      <Show when={show()}>
        <span
          id="comidread-tag-define"
          style={{ background, height: `${root.scrollHeight}px` }}
        >
          {tagContent[unsafeWindow.selected_tagname] ?? <h3>loading...</h3>}
        </span>
      </Show>
    ),
    root,
  );

  // 直接覆盖原有的函数
  unsafeWindow.tag_define = async () => {
    if (!unsafeWindow.selected_tagname) return;

    if (show()) return setShow(false);
    setShow(true);

    try {
      await saveTagContent(unsafeWindow.selected_tagname);
    } catch (error) {
      console.error(error);
      setShow(false);
    }
  };

  hijackFn('toggle_tagmenu', () => setShow(false));

  escHandler.set('关闭显示标签定义', () => (show() ? setShow(false) : true));
};
