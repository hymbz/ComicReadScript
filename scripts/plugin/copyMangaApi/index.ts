import { codeEdit } from '../codeEdit';
import { fetchValidHosts } from './hosts';

let hostsCache: Awaited<ReturnType<typeof fetchValidHosts>> | undefined;

export const copyApi = codeEdit('self-copyApi', async (code) => {
  if (!code.includes('apiList#copyManga')) return; // 无关产物不触发网络请求
  const hosts = (hostsCache ??= await fetchValidHosts());
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
