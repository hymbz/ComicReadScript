import { type useInit, t } from 'main';
import type { AsyncReturnType } from 'type-fest';

// 因为直接放到 site/other 里会导致打包时自动加入 import solidjs 的代码，
// 所以只能单独放这好打包进 main 里

/** 提示当前开启了自动进入阅读模式的弹窗 */
export const autoReadModeMessage =
  (setOptions: AsyncReturnType<typeof useInit>['setOptions']) => () => (
    <div>
      {t('site.simple.auto_read_mode_message')}
      <button on:click={() => setOptions({ autoShow: false })}>
        {t('other.disable')}
      </button>
    </div>
  );
