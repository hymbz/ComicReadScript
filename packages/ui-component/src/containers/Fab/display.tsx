/* eslint-disable react/function-component-definition */
/*
 * 用于测试时显示组件
 */
import { useState } from 'react';
import { Fab } from '.';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'normalize.css';

export default function Display() {
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState('');

  return (
    <div style={{ height: '300vh' }}>
      <input
        type="number"
        onChange={(e) => {
          setProgress(+e.target.value / 10);
        }}
      />
      <input
        type="text"
        onChange={(e) => {
          setTip(e.target.value);
        }}
      />

      <Fab progress={progress} tip={tip} />
    </div>
  );
}
