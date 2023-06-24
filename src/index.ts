inject('import');

// 匹配站点
switch (window.location.hostname) {
  // #百合会——「记录阅读历史，体验优化」
  case 'bbs.yamibo.com': {
    inject('yamibo');
    break;
  }
  // #百合会新站
  case 'www.yamibo.com': {
    inject('newYamibo');
    break;
  }

  // #动漫之家——「解锁隐藏漫画」
  case 'manhua.idmzj.com':
  case 'manhua.dmzj.com': {
    inject('dmzj');
    break;
  }
  case 'm.idmzj.com':
  case 'm.dmzj.com': {
    inject('dmzj_phone');
    break;
  }
  case 'www.idmzj.com':
  case 'www.dmzj.com': {
    inject('dmzj_www');
    break;
  }
  // 懒得整理导入导出的代码了，应该也没人用了吧，等有人需要的时候再说
  // case 'i.dmzj.com': {
  //   // dmzj_user_info
  //   break;
  // }

  // #ehentai——「匹配 nhentai 漫画」
  case 'exhentai.org':
  case 'e-hentai.org': {
    inject('ehentai');
    break;
  }

  // #nhentai——「彻底屏蔽漫画，自动翻页」
  case 'nhentai.net': {
    inject('nhentai');
    break;
  }

  // #明日方舟泰拉记事社
  case 'terra-historicus.hypergryph.com': {
    inject('terraHistoricus');
    break;
  }

  // #禁漫天堂
  case 'jmcomic.me':
  case 'jmcomic1.me':
  case '18comic.org':
  case '18comic.cc':
  case '18comic.vip': {
    inject('jm');
    break;
  }

  // #拷贝漫画(copymanga)
  case 'copymanga.site':
  case 'copymanga.info':
  case 'copymanga.net':
  case 'copymanga.org':
  case 'copymanga.tv':
  case 'copymanga.com':
  case 'www.copymanga.site':
  case 'www.copymanga.info':
  case 'www.copymanga.net':
  case 'www.copymanga.org':
  case 'www.copymanga.tv':
  case 'www.copymanga.com': {
    inject('copymanga');
    break;
  }

  // #漫画柜(manhuagui)
  case 'www.manhuagui.com':
  case 'www.mhgui.com':
  case 'tw.manhuagui.com': {
    inject('manhuagui');
    break;
  }

  // #漫画DB(manhuadb)
  case 'www.manhuadb.com': {
    inject('manhuaDB');
    break;
  }

  // #漫画猫(manhuacat)
  case 'www.manhuacat.com':
  case 'www.maofly.com': {
    inject('manhuacat');
    break;
  }

  // #动漫屋(dm5)
  case 'tel.dm5.com':
  case 'en.dm5.com':
  case 'www.dm5.com':
  case 'www.dm5.cn':
  case 'www.1kkk.com': {
    inject('dm5');
    break;
  }

  // #绅士漫画(wnacg)
  case 'www.wnacg.com': {
    inject('wnacg');
    break;
  }

  // #mangabz
  case 'www.mangabz.com':
  case 'mangabz.com': {
    inject('mangabz');
    break;
  }

  // #welovemanga
  case 'nicomanga.com':
  case 'weloma.art':
  case 'welovemanga.one': {
    inject('welovemanga');
    break;
  }

  default: {
    inject('other');
  }
}
