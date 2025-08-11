import type { GraphModel } from '@tensorflow/tfjs';

import { env, loadGraphModel, setBackend } from '@tensorflow/tfjs';
import { webgpu_util } from '@tensorflow/tfjs-backend-webgpu';

import { log, wait } from 'helper';

import { base64ToArrayBuffer, mainFn } from './workHelper';

// 引用一下，避免被 rullup treeshake 掉
console.log(webgpu_util); // oxlint-disable-line no-console

let model: GraphModel | undefined;

let loading = false;

export const getModel = async () => {
  if (model) return model;
  if (loading) return wait(() => model);

  loading = true;

  try {
    await setBackend('webgpu');
  } catch (error) {
    mainFn.toast.warn(mainFn.t('upscale.webgpu_tip'));
    log.error('切换 WebGPU 出错', error);
  }

  const { buffer, base64, json } = await mainFn.getModel();
  // 修改 tfjs 里的 fetch 来加载模型
  Reflect.set(env().platform, 'fetch', () => ({
    ok: true,
    json: () => JSON.parse(json),
    arrayBuffer: () => buffer || base64ToArrayBuffer(base64),
  }));
  model = await loadGraphModel('xxx');
  return model!;
};
