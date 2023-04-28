/*
 * 用于测试时显示组件
 */
import MdQueue from '@material-design-icons/svg/round/queue.svg';
import { IconButton } from '.';

export default function Display() {
  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
      }}
    >
      <IconButton tip="test" placement="left">
        <MdQueue />
      </IconButton>
    </div>
  );
}
