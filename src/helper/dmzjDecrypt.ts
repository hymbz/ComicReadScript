import type { BigInteger } from 'jsencrypt/lib/lib/jsbn/jsbn';
import { parseBigInt } from 'jsencrypt/lib/lib/jsbn/jsbn';
import { b64tohex } from 'jsencrypt/lib/lib/jsbn/base64';
import { JSEncryptRSAKey } from 'jsencrypt/lib/JSEncryptRSAKey';
import { Root } from 'protobufjs';

/**
 * 针对 dmzj v4api 的解密
 *
 * 代码来源于 https://greasyfork.org/zh-CN/scripts/466729-动漫之家解除屏蔽
 * 仅因为不想修改 jsencrypt 库的代码，加上希望打包出来的代码尽量小点所以调整了下结构
 */

const V4_PRIVATE_KEY =
  'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAK8nNR1lTnIfIes6oRWJNj3mB6OssDGx0uGMpgpbVCpf6+VwnuI2stmhZNoQcM417Iz7WqlPzbUmu9R4dEKmLGEEqOhOdVaeh9Xk2IPPjqIu5TbkLZRxkY3dJM1htbz57d/roesJLkZXqssfG5EJauNc+RcABTfLb4IiFjSMlTsnAgMBAAECgYEAiz/pi2hKOJKlvcTL4jpHJGjn8+lL3wZX+LeAHkXDoTjHa47g0knYYQteCbv+YwMeAGupBWiLy5RyyhXFoGNKbbnvftMYK56hH+iqxjtDLnjSDKWnhcB7089sNKaEM9Ilil6uxWMrMMBH9v2PLdYsqMBHqPutKu/SigeGPeiB7VECQQDizVlNv67go99QAIv2n/ga4e0wLizVuaNBXE88AdOnaZ0LOTeniVEqvPtgUk63zbjl0P/pzQzyjitwe6HoCAIpAkEAxbOtnCm1uKEp5HsNaXEJTwE7WQf7PrLD4+BpGtNKkgja6f6F4ld4QZ2TQ6qvsCizSGJrjOpNdjVGJ7bgYMcczwJBALvJWPLmDi7ToFfGTB0EsNHZVKE66kZ/8Stx+ezueke4S556XplqOflQBjbnj2PigwBN/0afT+QZUOBOjWzoDJkCQClzo+oDQMvGVs9GEajS/32mJ3hiWQZrWvEzgzYRqSf3XVcEe7PaXSd8z3y3lACeeACsShqQoc8wGlaHXIJOHTcCQQCZw5127ZGs8ZDTSrogrH73Kw/HvX55wGAeirKYcv28eauveCG7iyFR0PFB/P/EDZnyb+ifvyEFlucPUI0+Y87F';

// https://github.com/xiaoyaocz/flutter_dmzj/blob/23b04c2af930cb7c18a74665e8ec0bf1ccc6f09b/lib/protobuf/comic/detail_response.proto
const ComicDetailInfoProto = {
  nested: {
    proto: {
      fields: {
        comicInfo: {
          type: 'ComicInfo',
          id: 3,
        },
      },
    },
    ComicInfo: {
      fields: {
        id: {
          type: 'int64',
          id: 1,
        },
        title: {
          type: 'string',
          id: 2,
        },
        direction: {
          type: 'int64',
          id: 3,
        },
        islong: {
          type: 'int64',
          id: 4,
        },
        cover: {
          type: 'string',
          id: 6,
        },
        description: {
          type: 'string',
          id: 7,
        },
        last_updatetime: {
          type: 'int64',
          id: 8,
        },
        last_update_chapter_name: {
          type: 'string',
          id: 9,
        },
        first_letter: {
          type: 'string',
          id: 11,
        },
        comic_py: {
          type: 'string',
          id: 12,
        },
        hidden: {
          type: 'int64',
          id: 13,
        },
        hot_num: {
          type: 'int64',
          id: 14,
        },
        hit_num: {
          type: 'int64',
          id: 15,
        },
        last_update_chapter_id: {
          type: 'int64',
          id: 18,
        },
        types: {
          type: 'Types',
          id: 19,
          rule: 'repeated',
        },
        status: {
          type: 'Status',
          id: 20,
        },
        authors: {
          type: 'Authors',
          id: 21,
          rule: 'repeated',
        },
        subscribe_num: {
          type: 'int64',
          id: 22,
        },
        chapters: {
          type: 'Chapters',
          id: 23,
          rule: 'repeated',
        },
        is_need_login: {
          type: 'int64',
          id: 24,
        },
        dh_url_links: {
          type: 'DhUrlLink',
          id: 27,
          rule: 'repeated',
        },
      },
    },
    Types: {
      fields: {
        tag_id: {
          type: 'int64',
          id: 1,
        },
        tag_name: {
          type: 'string',
          id: 2,
        },
      },
    },
    Status: {
      fields: {
        tag_id: {
          type: 'int64',
          id: 1,
        },
        tag_name: {
          type: 'string',
          id: 2,
        },
      },
    },
    Authors: {
      fields: {
        tag_id: {
          type: 'int64',
          id: 1,
        },
        tag_name: {
          type: 'string',
          id: 2,
        },
      },
    },
    Data: {
      fields: {
        chapter_id: {
          type: 'int64',
          id: 1,
        },
        chapter_title: {
          type: 'string',
          id: 2,
        },
        updatetime: {
          type: 'int64',
          id: 3,
        },
        filesize: {
          type: 'int64',
          id: 4,
        },
        chapter_order: {
          type: 'int64',
          id: 5,
        },
      },
    },
    Chapters: {
      fields: {
        title: {
          type: 'string',
          id: 1,
        },
        data: {
          type: 'Data',
          id: 2,
          rule: 'repeated',
        },
      },
    },
    DhUrlLink: {
      fields: {
        title: {
          type: 'string',
          id: 1,
        },
      },
    },
  },
};
export interface ComicDetailInfo {
  comicInfo: {
    title: string;
    last_updatetime: number;
    chapters: {
      title: string;
      data: {
        chapter_id: number;
        chapter_order: number;
        chapter_title: string;
        updatetime: number;
      }[];
    }[];
  };
}

const key = new JSEncryptRSAKey(V4_PRIVATE_KEY);
const message = Root.fromJSON(ComicDetailInfoProto).lookupType('proto');

const base64ToArrayBuffer = (str: string) => {
  const binaryString = window.atob(str);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++)
    bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

const arrayBufferToBase64 = (buffer: Uint8Array) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
};

const pkcs1unpad2 = (d: BigInteger, n: number) => {
  const b = d.toByteArray();
  let i = 0;
  while (i < b.length && b[i] === 0) ++i;
  if (b.length - i !== n - 1 || b[i] !== 2) return null;
  ++i;
  while (b[i] !== 0) if (++i >= b.length) return null;
  const bytes: number[] = [];
  while (++i < b.length) bytes.push(b[i]);
  return bytes;
};

const customDecrypt = (t: string) => {
  const e = parseBigInt(t, 16);
  const i = key.doPrivate(e);
  if (i == null) return null;
  // eslint-disable-next-line no-bitwise
  return pkcs1unpad2(i, (((key as any).n.bitLength() as number) + 7) >> 3);
};

const utilsDmzjDecrypt = (str: string) => {
  const decode = base64ToArrayBuffer(str);
  const { length } = decode;
  let i10 = 0;
  let i11 = 0;
  let bytes: number[] = [];
  while (length - i10 > 0) {
    bytes = bytes.concat(
      customDecrypt(
        b64tohex(arrayBufferToBase64(decode.slice(i10, i10 + 128))),
      )!,
    );
    i11++;
    i10 = i11 * 128;
  }
  return Uint8Array.from(bytes);
};

export default <T = ComicDetailInfo>(str: string) => {
  const bytes = utilsDmzjDecrypt(str);
  return message.decode(bytes) as T;
};
