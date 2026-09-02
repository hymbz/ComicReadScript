import { toast } from 'core';
import { querySelector, t } from 'helper';
import { request } from 'request';

let contentKey: string | undefined;
let decryptKey: string | undefined;

const getKeys = async (url?: string): Promise<[string, string]> => {
  if (contentKey !== undefined && decryptKey !== undefined)
    return [contentKey, decryptKey];

  // 热辣漫画放在网页元素里
  if (querySelector('.disData[contentkey]')) {
    contentKey = querySelector('.disData[contentkey]')!.getAttribute(
      'contentkey',
    )!;
    decryptKey = querySelector('.disPass[contentkey]')!.getAttribute(
      'contentkey',
    )!;
    return [contentKey, decryptKey];
  }

  // 拷贝 PC 端直接放在网页变量里，不过另一个变量的名字会变
  if (unsafeWindow.contentKey !== undefined && unsafeWindow.cct !== undefined) {
    contentKey = unsafeWindow.contentKey; // oxlint-disable-line prefer-destructuring
    decryptKey = unsafeWindow.cct;
    return [contentKey!, decryptKey!];
  }

  // 如果另一个变量的名字变了，或者是在拷贝的移动端，就得从 PC 端的网页里解析获取了
  if (url) {
    const html = await request(url, {
      fetch: false,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36',
      },
    });

    const match =
      /(?:var\s+contentKey\s*=\s*['"](?<contentKey>[^'"]*)['"])|(?:var\s+(?!contentKey\b)[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*['"](?<decryptKey>[^'"]*)['"])/gsu.exec(
        html.responseText,
      )?.groups;
    if (!match) {
      toast.error(t('site.changed_load_failed'));
      throw new Error(t('site.changed_load_failed'));
    }

    ({ contentKey, decryptKey } = match);
    return [contentKey, decryptKey];
  }

  toast.error(t('site.changed_load_failed'));
  throw new Error(t('site.changed_load_failed'));
};

// by: https://github.com/MapoMagpie/comic-looms/blob/7799f87fdd5a8ac73c878f338b7ae6aa5c0b2d18/src/platform/matchers/mangacopy.ts#L96-L125
// 通过在目录页找 `/chapters` api 请求的启动器，可以顺着调用堆栈找到官方的解析代码
export const decryptData = async (raw: string, key?: string) => {
  key ||= (await getKeys())[1]; // oxlint-disable-line no-await-expression-member

  const cipher = raw.slice(16);
  const iv = raw.slice(0, 16);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: new TextEncoder().encode(iv) },
    await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      { name: 'AES-CBC' },
      false,
      ['decrypt'],
    ),
    new Uint8Array(
      cipher.match(/.{1,2}/gu)!.map((byte) => Number.parseInt(byte, 16)),
    ).buffer,
  );
  return JSON.parse(new TextDecoder().decode(decryptedBuffer));
};

/** 通过解析网页变量获取图片列表 */
export const getImglistByHtml = async (pageUrl?: string) => {
  const keys = await getKeys(pageUrl);
  const res: { url: string }[] = await decryptData(...keys);
  return res.map(({ url }) => url.replace(/(?<=[/.])c800x/u, 'c1500x'));
};
