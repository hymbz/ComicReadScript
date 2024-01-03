import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config

export default defineConfig({
  lang: 'zh-CN',
  title: 'ComicRead Script',
  description: 'A VitePress Site',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
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
      { text: '无法支持', link: '/无法支持' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hymbz/ComicReadScript' },
    ],

    docFooter: { prev: false, next: false },

    externalLinkIcon: true,
  },
});
