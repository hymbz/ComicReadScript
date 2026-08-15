import axios from 'axios';
import { unzipSync } from 'fflate';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { pathResolve } from '../../lib/utils';

// 从这个项目的 apk 中反编译提取拷贝漫画的所有可用域名列表
const REPO = 'LittleSurvival/copymanga-copy20';
const INDEX_URL = `https://raw.githubusercontent.com/${REPO}/main/index.json`;
const APK_URL = (version: string, apkName: string) =>
  `https://github.com/${REPO}/releases/download/v${version}/${apkName}`;

// .tmp 不会被 git 记录，用于缓存 APK 版本号与提取出的域名
// 以项目根目录（rootDir）为基准解析，copyMangaApi 文件夹放在任意层级都不受影响
const TMP_DIR = pathResolve('.tmp');
const CACHE_FILE = `${TMP_DIR}/copyMangaHosts.json`;

// dex 字符串池中 ASCII 字符串连续存储（MUTF-8 与 ASCII 一致），可直接用正则提取域名
// 带边界的裸域名匹配，避免命中 URL 中带路径的域名与相邻字符串拼接
const DOMAIN_REGEX =
  /(?<![\w.])[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(?![\w./])/gu;

/** 从 index.json 获取 copymanga 扩展的当前版本号与 APK 文件名 */
const fetchApkInfo = async () => {
  const { data } = await axios<{ pkg: string; apk: string; version: string }[]>(
    INDEX_URL,
    { timeout: 10_000 },
  );
  const entry = data?.find(
    (item) => item.pkg === 'eu.kanade.tachiyomi.extension.zh.copymanga',
  );
  if (!entry?.apk || !entry?.version)
    throw new Error('index.json 中未找到拷贝漫画扩展');
  return { version: entry.version, apkName: entry.apk };
};

/** 解压 APK 并从 classes.dex 中提取所有域名 */
const extractDomains = (apk: Uint8Array) => {
  const dex = unzipSync(apk)['classes.dex'];
  if (!dex) throw new Error('APK 中未找到 classes.dex');
  const text = new TextDecoder().decode(dex);
  return [...new Set([...text.matchAll(DOMAIN_REGEX)].map((m) => m[0]))].filter(
    (domain) => !domain.startsWith('v2.pref.'),
  );
};

const readCache = (): { version: string; domains: string[] } | undefined => {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    return undefined;
  }
};

/**
 * 获取扩展 APK 中的域名列表：
 * 缓存与最新版本号一致时直接使用缓存；否则下载 APK 重新提取并更新缓存
 */
export const getApkDomains = async () => {
  const cached = readCache();
  const apkInfo = await fetchApkInfo().catch(() => {});

  // 版本号一致，或无法获取最新版本但已有缓存，直接使用缓存
  if (cached && (!apkInfo || cached.version === apkInfo.version))
    return cached.domains;
  if (!apkInfo) throw new Error('获取扩展版本信息失败');

  const { version, apkName } = apkInfo;
  const { data } = await axios(APK_URL(version, apkName), {
    responseType: 'arraybuffer',
    timeout: 60_000,
  });
  const domains = extractDomains(new Uint8Array(data));
  mkdirSync(TMP_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify({ version, domains }));
  return domains;
};
