import { sleep } from 'helper';
import { t } from 'helper/i18n';
import { log } from 'helper/logger';
import { store } from '../..';
import type { TaskState } from './helper';
import {
  setMessage,
  download,
  request,
  createFormData,
  createOptions,
} from './helper';

const url = () => store.option.translation.localUrl || 'http://127.0.0.1:5003';

/** 获取部署服务的可用翻译 */
export const getValidTranslators = async () => {
  try {
    const res = await request(`${url()}`);
    const translatorsText = res.responseText.match(
      /(?<=validTranslators: ).+?(?=,\n)/,
    )?.[0];
    if (!translatorsText) return undefined;
    const list = JSON.parse(translatorsText.replaceAll(`'`, `"`)) as string[];
    return createOptions(list);
  } catch (e) {
    log.error(t('translation.tip.get_translator_list_error'), e);
    return undefined;
  }
};

/** 使用自部署服务器翻译指定图片 */
export const selfhostedTranslation = async (i: number) => {
  if (!(await getValidTranslators()))
    throw new Error(t('alert.server_connect_failed'));

  const img = store.imgList[i];
  setMessage(i, t('translation.tip.img_downloading'));
  let imgBlob: Blob;
  try {
    imgBlob = await download(img.src);
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.download_img_failed'));
  }

  let task_id: string;
  // 上传图片取得任务 id
  try {
    const res = await request(`${url()}/submit`, {
      method: 'POST',
      data: createFormData(imgBlob),
    });

    const resData = JSON.parse(res.responseText) as {
      task_id: string;
      status: string;
    };

    task_id = resData.task_id;
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.upload_error'));
  }

  let errorNum = 0;
  let taskState: TaskState | undefined;
  // 等待翻译完成
  while (!taskState?.finished) {
    try {
      await sleep(200);
      const res = await request(`${url()}/task-state?taskid=${task_id}`);
      taskState = JSON.parse(res.responseText) as TaskState;
      setMessage(
        i,
        `${t(`translation.status.${taskState.state}`) || taskState.state}`,
      );
    } catch (error) {
      log.error(error);
      if (errorNum > 5)
        throw new Error(t('translation.tip.check_img_status_failed'));
      errorNum += 1;
    }
  }

  return URL.createObjectURL(await download(`${url()}/result/${task_id}`));
};
