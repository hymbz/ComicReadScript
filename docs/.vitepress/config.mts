import { defineConfig } from 'vitepress';

import { imgSize } from './imgSize';

export default defineConfig({
  lang: 'zh-CN',
  title: 'ComicRead Script',
  description: 'ComicRead Script Docs',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  markdown: { config: (md) => md.use(imgSize) },
  themeConfig: {
    nav: [
      {
        text: 'Greasy Fork',
        link: 'https://sleazyfork.org/zh-CN/scripts/374903',
      },
      { text: 'PWA', link: 'https://comic-read.pages.dev' },
    ],

    outline: { level: 'deep' },

    sidebar: [
      { text: '简介', link: '/index' },
      { text: '设置项说明', link: '/设置项说明' },
      { text: '判断漫画左右页位置是否正确', link: '/判断左右页位置' },

      {
        text: '功能',
        items: [
          { text: '页面填充', link: '/功能/页面填充' },
          { text: '卷轴模式', link: '/功能/卷轴模式' },
          { text: 'PWA', link: '/功能/PWA' },
        ],
      },

      { text: '最简单的本地部署翻译服务流程', link: '/本地部署翻译' },
      { text: 'NPM 模块', link: '/NPM 模块' },
      { text: '无法解决的问题', link: '/无法解决的问题' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hymbz/ComicReadScript' },
    ],

    docFooter: { prev: false, next: false },

    externalLinkIcon: true,
  },
});
