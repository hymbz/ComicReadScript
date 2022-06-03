import shadowRoot from 'react-shadow';
import { useStore } from './hooks/useStore';

interface MangaProps {
  imgUrlList: string[];
}

const css = `@unocss-placeholder`;

/**
 * APP 测试
 *
 * @param imgUrlList 图片列表
 */
export const Manga: React.FC<MangaProps> = (imgUrlList) => {
  return (
    <shadowRoot.div>
      <style type="text/css">{css}</style>

      {/* <div className="i-twemoji-grinning-face-with-smiling-eyes hover:i-twemoji-face-with-tears-of-joy" />
      <button
        type="button"
        // TODO:类名太长了，需要用 unncss 的功能优化下
        className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        add
      </button> */}
    </shadowRoot.div>
  );
};
