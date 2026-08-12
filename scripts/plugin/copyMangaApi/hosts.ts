import axios from 'axios';

import { getApkDomains } from './apk';

// 引导主机：官方 APP 的默认 API 域名，用于获取节点列表。
// 若失效，去 fumiama/copymanga 的 app/src/main/res/values/strings.xml 里找 &hosturl; 的最新值替换
const BOOTSTRAP_HOST = 'api.2024manga.com';

// 测试章节：能返回图片数据说明该节点在正常服务漫画内容
const TEST_PATH =
  '/api/v3/comic/andayudaocunnew/chapter/27a0e0f4-b413-11e9-aea4-00163e0ca5bd?platform=3';

// 测试移动端 APP 特有功能（评论、阅读记录等）：
// 能返回评论列表说明该节点支持 APP 专有接口
const ROASTS_PATH =
  '/api/v3/roasts?chapter_id=27a0e0f4-b413-11e9-aea4-00163e0ca5bd&limit=1&offset=0&_update=true';

// 章节图片探活请求头，静态字段需与运行时 pcApi.headers（src/site/copymanga.tsx）保持一致
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 Edg/141.0.0.0',
  'x-requested-with': 'com.manga2020.app',
  platform: '3',
  version: '2024.4.28',
  webp: '1',
  accept: 'application/json',
};

// 移动端 APP 特有功能接口要求新版 APP 的请求头，旧版 APP 的请求头会被 code:210 拒绝
// 版本号在构建时自动拉取官方最新值覆盖，避免版本校验收紧后失效
// 静态字段需与运行时 mobileApi.headers（src/site/copymanga.tsx）保持一致
const APP_HEADERS = {
  webp: '1',
  region: '1',
  'User-Agent': 'COPY/3.0.0',
  version: '3.0.9',
  source: 'copyApp',
  referer: 'com.copymanga.app-3.0.0',
  accept: 'application/json',
};

// 兜底主机：官方 API 域名，在候选主机列表为空或拉取版本号时使用
const FALLBACK_HOST = 'api.mangacopy.com';

/**
 * 获取最新版本号
 *
 * version 头需要跟着更新，否则会被版本校验拒绝 code:210
 */
const getLatestVersion = async () => {
  try {
    const { data } = await axios(
      `https://${FALLBACK_HOST}/api/v3/system/appVersion/last`,
      { headers: APP_HEADERS, timeout: 10_000, validateStatus: () => true },
    );
    const version = data?.results?.android?.version;
    if (typeof version === 'string' && version.length > 0) return version;
  } catch {}
  throw new Error('未获取到 APP 版本号');
};

/** 获取节点列表并逐个验证，按能力分成「章节图片」和「移动端 APP 特有功能」两个可用主机列表 */
export const fetchValidHosts = async () => {
  // 1. 拉取最新 APP 版本号更新请求头
  let appVersion = APP_HEADERS.version;
  try {
    appVersion = await getLatestVersion();
    APP_HEADERS.version = appVersion;
  } catch (error) {
    console.error('[copyApi] 获取 APP 版本号失败，使用兜底版本', error);
  }

  // 2. 从引导主机拿节点列表
  const { data } = await axios(
    `https://${BOOTSTRAP_HOST}/api/v3/system/network2?platform=3`,
    { headers: HEADERS, timeout: 10_000 },
  );
  const { api, share } = data?.results ?? {};

  // 3. 合并候选项：引导主机 + network2 节点 + 从扩展 APK 中提取的域名
  const apkDomains = await getApkDomains().catch((error) => {
    console.error('[copyApi] 获取扩展 APK 域名失败，使用内置域名', error);
    return [] as string[];
  });
  const candidates = [
    ...new Set<string>([
      BOOTSTRAP_HOST,
      ...(Array.isArray(api) ? api.flat() : []),
      ...(Array.isArray(share) ? share : []),
      ...apkDomains,
    ]),
  ].filter(
    (host): host is string => typeof host === 'string' && host.length > 0,
  );

  // 4. 对每个候选主机分别做章节图片、移动端 APP 特有功能两种检查
  const content: string[] = [];
  const mobile: string[] = [];
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
          content.push(host);
      } catch {}

      try {
        const res = await axios(`https://${host}${ROASTS_PATH}`, {
          headers: APP_HEADERS,
          timeout: 10_000,
          validateStatus: () => true,
        });
        if (
          res.status === 200 &&
          res.data?.code === 200 &&
          Array.isArray(res.data?.results?.list)
        )
          mobile.push(host);
      } catch {}
    }),
  );

  // 5. 任一功能没有可用主机时，使用兜底主机
  if (content.length === 0) {
    console.error(
      '[copyApi] 没有候选主机能获取章节图片，改用兜底主机：',
      FALLBACK_HOST,
    );
    content.push(FALLBACK_HOST);
  }
  if (mobile.length === 0) {
    console.error(
      '[copyApi] 没有候选主机能提供移动端 APP 特有功能，改用兜底主机：',
      FALLBACK_HOST,
    );
    mobile.push(FALLBACK_HOST);
  }
  return { content, mobile, appVersion };
};
