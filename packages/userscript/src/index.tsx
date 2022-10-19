// #import

// 匹配站点
switch (window.location.hostname) {
  case 'i.dmzj.com':
  case 'm.dmzj.com':
  case 'manhua.dmzj.com': {
    // #dmzj
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

  default: {
    // #other
  }
}
