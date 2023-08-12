/*
 * 用于测试时显示组件
 */

import { toast } from '.';
import { Toaster } from './Toaster';

export default function Display() {
  const duration = 1000 * 3;

  return (
    <div style={{ height: '100vh' }}>
      <button on:click={() => toast('加载图片中，请稍候', { duration })}>
        文字
      </button>

      <button
        on:click={() =>
          toast(() => <div>加载图片中，请稍候</div>, { duration })
        }
      >
        JSX
      </button>

      <button
        on:click={() => toast.success('加载图片中，请稍候', { duration })}
      >
        success
      </button>
      <button on:click={() => toast.warn('加载图片中，请稍候', { duration })}>
        warn
      </button>
      <button on:click={() => toast.error('加载图片中，请稍候', { duration })}>
        error
      </button>

      <button
        on:click={() =>
          toast.error('加载图片中，请稍候', { duration: Infinity })
        }
      >
        永久显示
      </button>

      <button
        on:click={() =>
          toast.error('加载图片中，请稍候', { duration, id: '1' })
        }
      >
        更新
      </button>

      <Toaster />
    </div>
  );
}
