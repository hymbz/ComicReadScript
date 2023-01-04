// #import

// 匹配站点
switch (window.location.hostname) {
  case 'manhua.dmzj.com': {
    // #dmzj
    break;
  }
  case 'm.dmzj.com': {
    // #dmzj_phone
    break;
  }
  case 'i.dmzj.com': {
    // #dmzj_user_info
    break;
  }

  case 'exhentai.org':
  case 'e-hentai.org': {
    // #ehentai
    break;
  }

  case 'nhentai.net': {
    // #nhentai
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
    // #copymanga
    break;
  }

  case 'tel.dm5.com':
  case 'en.dm5.com':
  case 'www.dm5.com':
  case 'www.dm5.cn':
  case 'www.1kkk.com': {
    // #dm5
    break;
  }

  case 'www.mangabz.com':
  case 'mangabz.com': {
    // #mangabz
    break;
  }

  case 'www.manhuagui.com':
  case 'www.mhgui.com':
  case 'tw.manhuagui.com': {
    // #manhuagui
    break;
  }

  case 'www.manhuadb.com': {
    // #manhuaDB
    break;
  }

  case 'www.manhuacat.com':
  case 'www.maofly.com': {
    // #manhuacat
    break;
  }

  default: {
    // #other
  }
}
