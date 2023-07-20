import { sleep } from '../../../../../../helper';
import { store } from '../..';
import type { TaskState } from './helper';
import {
  setMessage,
  download,
  request,
  messageMap,
  createFormData,
  createOptions,
} from './helper';

/** 获取部署服务的可用翻译 */
export const getValidTranslators = async () => {
  try {
    const res = await request('http://127.0.0.1:5003');
    const translatorsText = res.responseText.match(
      /(?<=validTranslators: ).+?(?=,\n)/,
    )?.[0];
    if (!translatorsText) return undefined;
    const list = JSON.parse(translatorsText.replaceAll(`'`, `"`)) as string[];
    return createOptions(list);
  } catch (_) {
    return undefined;
  }
};

/** 使用自部署服务器翻译指定图片 */
export const selfhostedTranslation = async (i: number) => {
  if (!(await getValidTranslators())) throw new Error('无法连接到服务器');

  const img = store.imgList[i];
  setMessage(i, '正在下载图片');
  let imgBlob: Blob;
  try {
    imgBlob = await download(img.src);
  } catch (error) {
    console.error(error);
    throw new Error('下载图片失败');
  }

  let task_id: string;
  // 上传图片取得任务 id
  try {
    const res = await request('http://127.0.0.1:5003/submit', {
      method: 'POST',
      data: createFormData(imgBlob),
    });

    const resData = JSON.parse(res.responseText) as {
      task_id: string;
      status: string;
    };

    task_id = resData.task_id;
  } catch (error) {
    console.error(error);
    throw new Error('上传图片失败');
  }

  let errorNum = 0;
  let taskState: TaskState | undefined;
  // 等待翻译完成
  while (!taskState?.finished) {
    try {
      await sleep(200);
      const res = await request(
        `http://127.0.0.1:5003/task-state?taskid=${task_id}`,
      );
      taskState = JSON.parse(res.responseText) as TaskState;
      setMessage(i, `${messageMap[taskState.state] ?? taskState.state}`);
    } catch (error) {
      console.error(error);
      if (errorNum > 5) throw new Error('检查图片状态失败过多');
      errorNum += 1;
    }
  }

  return `http://127.0.0.1:5003/result/${task_id}`;
};
