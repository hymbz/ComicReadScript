/* eslint-disable react/function-component-definition */
/*
 * 用于测试时显示组件
 */
import { useState } from 'react';
import { Fab } from '.';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'normalize.css';

export default function DisplayManga() {
  const [progress, setProgress] = useState(0);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setProgress(+e.target.value / 10);
  };

  return (
    <div style={{ height: '300vh' }}>
      <input type="number" onChange={handleChange} />
      <Fab progress={progress}>
        {/* <div>
          <p>288</p>
          <hr />
          <p>288</p>
        </div> */}
      </Fab>
    </div>
  );
}
