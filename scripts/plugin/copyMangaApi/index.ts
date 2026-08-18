import { codeEdit } from '../codeEdit';
import { fetchValidHosts } from './hosts';

let hostsCache: Awaited<ReturnType<typeof fetchValidHosts>> | undefined;

/** 获取拷贝漫画节点列表，并在模块内缓存，避免多次请求 */
export const getCopyMangaHosts = async () =>
  (hostsCache ??= await fetchValidHosts());

export const copyApi = codeEdit('self-copyApi', async (code) => {
  if (!code.includes('apiList#copyManga')) return; // 无关产物不触发网络请求
  const hosts = await getCopyMangaHosts();
  return code
    .replace(
      /['"]apiList#copyManga['"]/u,
      () => `'${hosts.content.map((host) => `https://${host}`).join("', '")}'`,
    )
    .replace(
      /['"]apiList#copyMangaMobile['"]/u,
      () => `'${hosts.mobile.map((host) => `https://${host}`).join("', '")}'`,
    )
    .replace(/['"]appVersion#copyManga['"]/u, () => `'${hosts.appVersion}'`);
});
