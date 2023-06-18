/*
 * 用于测试时显示组件
 */

import { createSignal } from 'solid-js';

import Filter1 from '@material-design-icons/svg/round/looks_one.svg';
import Filter2 from '@material-design-icons/svg/round/looks_two.svg';
import Filter3 from '@material-design-icons/svg/round/looks_3.svg';

import { Fab } from '.';

import { IconButton } from '../IconButton';

export default function Display() {
  const [progress, setProgress] = createSignal(0);
  const [tip, setTip] = createSignal('提示文本');
  const [autoTrans, setAutoTrans] = createSignal(false);
  const [focus, setFocus] = createSignal(false);
  // const [show, setShow] = createSignal(true);

  const speedDial = [
    () => (
      <IconButton
        placement="left"
        tip="切换是否自动半透明"
        enabled={autoTrans()}
        onClick={() => setAutoTrans((v) => !v)}
      >
        <Filter1 />
      </IconButton>
    ),
    () => (
      <IconButton
        placement="left"
        tip="切换聚焦状态"
        enabled={focus()}
        onClick={() => setFocus((v) => !v)}
      >
        <Filter2 />
      </IconButton>
    ),
    () => (
      <IconButton placement="left" tip="Filter3" enabled>
        <Filter3 />
      </IconButton>
    ),
  ];

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
        value={tip()}
        onChange={(e) => {
          setTip(e.target.value);
        }}
      />
      {/* <button
        type="button"
        onClick={() => {
          setShow((s) => !s);
        }}
      >
        切换是否显示
      </button> */}

      <div
        style={{
          position: 'fixed',
          'z-index': 999999999,
          right: '3em',
          bottom: '2em',
        }}
      >
        <Fab
          // show={show()}
          progress={progress()}
          tip={tip()}
          speedDial={speedDial}
          autoTrans={autoTrans()}
          focus={focus()}
          onClick={alert}
        />
      </div>
    </div>
  );
}
