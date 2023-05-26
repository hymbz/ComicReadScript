/*
 * 用于测试时显示组件
 */

import { toast } from '.';
import { Toaster } from './Toaster';

export default function Display() {
  const duration = 1000 * 3;

  return (
    <div style={{ height: '100vh' }}>
      <button onClick={() => toast('加载图片中，请稍候', { duration })}>
        文字
      </button>

      <button
        onClick={() => toast(() => <div>加载图片中，请稍候</div>, { duration })}
      >
        JSX
      </button>

      <button onClick={() => toast.success('加载图片中，请稍候', { duration })}>
        success
      </button>
      <button onClick={() => toast.warn('加载图片中，请稍候', { duration })}>
        warn
      </button>
      <button onClick={() => toast.error('加载图片中，请稍候', { duration })}>
        error
      </button>

      <button
        onClick={() =>
          toast.error('加载图片中，请稍候', { duration: Infinity })
        }
      >
        永久显示
      </button>

      <button
        onClick={() => toast.error('加载图片中，请稍候', { duration, id: '1' })}
      >
        更新
      </button>

      <Toaster />
    </div>
  );
}
