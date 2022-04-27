import { useState, useRef } from 'react';
import { useStore } from './hooks/useStore';

export default () => {
  console.log('import Button');

  /**
   * APP 测试
   */
  const Button: React.FC = () => {
    const bears = useStore((state) => state.bears);
    const addBear = useStore((state) => state.addBear);

    return (
      <>
        <div className="py-8 px-8">{bears}</div>
        <button
          type="button"
          onClick={addBear}
          className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          add
        </button>
      </>
    );
  };

  return Button;
};
