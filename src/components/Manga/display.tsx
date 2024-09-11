/*
 * 用于测试时显示组件
 */

import { createSequence, log } from 'helper';

import { type MangaProps, Manga } from '.';

import 'normalize.css';

const imgList = [
  [
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
    'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  ],
  [
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141011480001.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141015010002.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141017930003.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141021040004.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141023760005.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/16501426330006.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141029220007.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141031680008.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141034290009.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141036860010.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141039470011.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141042230012.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141044830013.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141047160014.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141049620015.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141052260016.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141054960017.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141057620018.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141060190019.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141062740020.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141065380021.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141068040022.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141070850023.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141073540024.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141076250025.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141078800026.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141081570027.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141084110028.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141086810029.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141089460030.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141092110031.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141094750032.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141097270033.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141099840034.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141102420035.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141104750036.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141107430037.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141110050038.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141112950039.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141115500040.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141118200041.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141120930042.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141123420043.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141126020044.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141128630045.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141131160046.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141133900047.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141136550048.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141139350049.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141142160050.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141145250051.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141147980052.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141150630053.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141153180054.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141155890055.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141158490056.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141161060057.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141163640058.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141166360059.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141169110060.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141171670061.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141174500062.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141177320063.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141180110064.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141183050065.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141185790066.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141188800067.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141191520068.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141194280069.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141196840070.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141199620071.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141202140072.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141204610073.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141207170074.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141209610075.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141212150076.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141214660077.jpg.c800x.jpg',
    'https://hi77-overseas.mangafuna.xyz/hmymvdkt/02e58/1650141217260078.jpg.c800x.jpg',
    // '',
  ],
  // 测试识别图片背景色
  [
    'https://images.dmzj.com/m/梦幻女仆的茶点时光/第01话/001.jpg',
    'https://images.dmzj.com/m/梦幻女仆的茶点时光/第01话/002+3.jpg',
    'https://images.dmzj.com/m/梦幻女仆的茶点时光/第01话/004.jpg',
    'https://images.dmzj.com/m/梦幻女仆的茶点时光/第01话/005.jpg',
    'https://images.dmzj.com/m/梦幻女仆的茶点时光/第01话/006.jpg',
    'https://images.dmzj.com/m/梦幻女仆的茶点时光/第01话/007.jpg',
    'https://images.dmzj.com/m/梦幻女仆的茶点时光/第01话/008.jpg',
    'https://images.dmzj.com/m/梦幻女仆的茶点时光/第01话/staff.jpg',
    'https://images.dmzj.com/m/梦幻女仆的茶点时光/第01话/阿云-2.jpg',
    'https://images.dmzj.com/g/广井菊里的深酒日记/第01话/033.jpg',
    'https://img5.qy0.ru/data/2656/71/51.jpg',
  ],
  createSequence(70).map(
    (i) => `http://127.0.0.1:3000/${`${i + 1}`.padStart(4, '0')}.jpg`,
  ),
];

export default function DisplayManga() {
  const onExit: MangaProps['onExit'] = () => {
    log('end func 点击');
  };

  const option: MangaProps['option'] = {
    // scrollMode: true,
  };

  const duplicateArray = (arr: string[], count: number) =>
    ([] as string[]).concat(
      ...Array.from<string[]>({ length: count }).fill(arr),
    );

  const _imgList = duplicateArray(imgList[2], 1);
  log.warn('个数', _imgList.length);

  return <Manga imgList={_imgList} onExit={onExit} option={option} />;
}
