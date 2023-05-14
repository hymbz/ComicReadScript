inject('import');

// 匹配站点
switch (window.location.hostname) {
  case 'bbs.yamibo.com': {
    inject('yamibo');
    break;
  }
  case 'www.yamibo.com': {
    inject('newYamibo');
    break;
  }

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

  case 'exhentai.org':
  case 'e-hentai.org': {
    inject('ehentai');
    break;
  }

  case 'nhentai.net': {
    inject('nhentai');
    break;
  }

  case 'terra-historicus.hypergryph.com': {
    inject('terraHistoricus');
    break;
  }

  case 'copymanga.site':
  case 'copymanga.info':
  case 'copymanga.net':
  case 'copymanga.org':
  case 'copymanga.com':
  case 'www.copymanga.site':
  case 'www.copymanga.info':
  case 'www.copymanga.net':
  case 'www.copymanga.org':
  case 'www.copymanga.com': {
    inject('copymanga');
    break;
  }

  case 'tel.dm5.com':
  case 'en.dm5.com':
  case 'www.dm5.com':
  case 'www.dm5.cn':
  case 'www.1kkk.com': {
    inject('dm5');
    break;
  }

  case 'www.mangabz.com':
  case 'mangabz.com': {
    inject('mangabz');
    break;
  }

  case 'www.manhuagui.com':
  case 'www.mhgui.com':
  case 'tw.manhuagui.com': {
    inject('manhuagui');
    break;
  }

  case 'www.manhuadb.com': {
    inject('manhuaDB');
    break;
  }

  case 'www.manhuacat.com':
  case 'www.maofly.com': {
    inject('manhuacat');
    break;
  }

  case 'jmcomic.me':
  case 'jmcomic1.me':
  case '18comic.org':
  case '18comic.cc':
  case '18comic.vip': {
    inject('jm');
    break;
  }

  default: {
    inject('other');
  }
}
