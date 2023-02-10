/* eslint-disable react/function-component-definition */
/*
 * 用于测试时显示组件
 */
import Filter1 from '@material-design-icons/svg/round/looks_one.svg';
import Filter2 from '@material-design-icons/svg/round/looks_two.svg';
import Filter3 from '@material-design-icons/svg/round/looks_3.svg';

import { useState } from 'react';
import { Fab } from '.';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'normalize.css';
import { IconButton } from '../IconButton';

const speedDial = [
  () => (
    <IconButton placement="left" tip="Filter1">
      <Filter1 />
    </IconButton>
  ),
  () => (
    <IconButton placement="left" tip="Filter2">
      <Filter2 />
    </IconButton>
  ),
  () => (
    <IconButton placement="left" tip="Filter3" enabled>
      <Filter3 />
    </IconButton>
  ),
];

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

      <div
        style={{
          position: 'fixed',
          zIndex: 999999999,
          right: '3em',
          bottom: '2em',
        }}
      >
        <Fab
          progress={progress}
          tip={tip}
          speedDial={speedDial}
          onClick={alert}
        />
      </div>
    </div>
  );
}
