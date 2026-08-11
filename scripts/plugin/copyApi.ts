import axios from 'axios';

import { codeEdit } from './codeEdit';

// 引导主机：官方 APP 的默认 API 域名，用于获取节点列表。
// 若失效，去 fumiama/copymanga 的 app/src/main/res/values/strings.xml 里找 &hosturl; 的最新值替换
const BOOTSTRAP_HOST = 'api.2024manga.com';

// 测试章节：能返回图片数据说明该节点在正常服务漫画内容
// 使用 v1 的 /chapter/ 路径（chapter2 接口已被官方迁移/废弃）
const TEST_PATH =
  '/api/v3/comic/andayudaocunnew/chapter/27a0e0f4-b413-11e9-aea4-00163e0ca5bd?platform=3';

// 模仿官方 APP 的请求头，避免被 WAF 拦截
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 Edg/141.0.0.0',
  'x-requested-with': 'com.manga2020.app',
  platform: '3',
  version: '2024.4.28',
  webp: '1',
  accept: 'application/json',
};

let hostsCache: string[] | undefined;

/** 获取节点列表并逐个验证，返回可用主机 */
const fetchValidHosts = async () => {
  // 1. 从引导主机拿节点列表
  const { data } = await axios(
    `https://${BOOTSTRAP_HOST}/api/v3/system/network2?platform=3`,
    { headers: HEADERS, timeout: 10_000 },
  );
  const { api, share } = data?.results ?? {};
  const candidates = [
    ...new Set<string>([
      BOOTSTRAP_HOST,
      ...(Array.isArray(api) ? api.flat() : []),
      ...(Array.isArray(share) ? share : []),
    ]),
  ].filter(
    (host): host is string => typeof host === 'string' && host.length > 0,
  );

  // 2. 并行验证每个候选主机（含引导主机，能过验证就自动加入）
  const valid: string[] = [];
  await Promise.all(
    candidates.map(async (host) => {
      try {
        const res = await axios(`https://${host}${TEST_PATH}`, {
          headers: HEADERS,
          timeout: 10_000,
          validateStatus: () => true,
        });
        const contents = res.data?.results?.chapter?.contents;
        if (
          res.status === 200 &&
          Array.isArray(contents) &&
          contents.length > 0 &&
          contents.every(
            (item) => typeof item?.url === 'string' && item.url.length > 0,
          )
        )
          valid.push(host);
        else console.error(`[copyApi] ${host} 验证失败: 未返回章节图片数据`);
      } catch (error) {
        console.error(`[copyApi] ${host} 验证失败:`, error);
      }
    }),
  );

  if (valid.length === 0) throw new Error('所有候选 API 主机均验证失败');
  return valid;
};

export const copyApi = codeEdit('self-copyApi', async (code) => {
  if (!code.includes('apiList#copyManga')) return; // 无关产物不触发网络请求
  const hosts = (hostsCache ??= await fetchValidHosts().catch((error) => {
    // 构建时网络失败或全部验证失败：退化为默认主机 + 醒目警告
    console.error(
      `[copyApi] 获取 API 主机列表失败，退化为 ${BOOTSTRAP_HOST}`,
      error,
    );
    return [BOOTSTRAP_HOST];
  }));
  return code.replace(
    /['"]apiList#copyManga['"]/,
    () => `'${hosts.join("', '")}'`,
  );
});
