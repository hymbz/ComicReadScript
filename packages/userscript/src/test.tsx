console.log('start');

// 匹配站点
switch (window.location.hostname) {
  case 'i.dmzj.com':
  case 'm.dmzj.com':
  case 'manhua.dmzj.com': {
    // '@@DMZJScript.@@';
    break;
  }
  default: {
    // other
  }
}
