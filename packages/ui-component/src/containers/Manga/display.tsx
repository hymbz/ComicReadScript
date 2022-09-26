/* eslint-disable react/function-component-definition */
/*
 * 用于测试时显示组件
 */

import type { MangaProps } from '.';
import { Manga } from '.';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'normalize.css';

const imgUrlList = [
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9b9e9c18-8f73-11e9-a9ff-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9c012fc2-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9c486356-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9c95b688-8f73-11e9-a9ff-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9cd0c566-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9d0a1d98-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9d55f970-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9d8f0454-8f73-11e9-83b7-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9dd28e90-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9e25b070-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9e4e785c-8f73-11e9-a9ff-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9e8f7e4c-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9ec8eaec-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9eff5546-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9f373ede-8f73-11e9-a9ff-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9f731fa8-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/9fce4036-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a024cbfe-8f73-11e9-a9ff-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a05fb84a-8f73-11e9-8f01-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a09af9be-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a0d75508-8f73-11e9-a9ff-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a12dc906-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a16bc9c2-8f73-11e9-83b7-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a1c57f30-8f73-11e9-8f01-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a221f792-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a25ecdf2-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a29945f4-8f73-11e9-a9ff-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a2f50600-8f73-11e9-8f01-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a34dbb88-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a38c4574-8f73-11e9-8f01-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a3f26ce6-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a428f37e-8f73-11e9-b2a5-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a4663a90-8f73-11e9-a9ff-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a4cb92be-8f73-11e9-83b7-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://1767566263.rsc.cdn77.org/comic/shirenzhuangsharenshijian/8d3f1/a58daea8-8f73-11e9-a9ff-00163e0ca5bd.png!kb_w_read_large_webp',
  'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
];

export default function DisplayManga() {
  // const editButtonList: MangaProps['editButtonList'] = (list) =>
  //   list.slice(0, 1);

  const onExit: MangaProps['onExit'] = () => {
    console.log('end func 点击');
  };

  return <Manga imgUrlList={imgUrlList} onExit={onExit} />;
}
