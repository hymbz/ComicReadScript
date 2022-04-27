import { useStore } from './hooks/useStore';

export default () => {
  console.log('import Manga');

  /**
   * APP 测试
   */
  const Manga: React.FC = () => {
    const bears = useStore((state) => state.bears);
    const addBear = useStore((state) => state.addBear);

    return (
      <>
        <div className="py-8 px-8">{bears}</div>
        <button
          type="button"
          onClick={addBear}
          // TODO:类名太长了，需要用 unncss 的功能优化下
          className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          add
        </button>
      </>
    );
  };

  return { Manga, css: `\n@unocss-placeholder` };
};
