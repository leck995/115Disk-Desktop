import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '115Disk',
  description: '基于 Tauri 2 + React + TypeScript 的 115 网盘桌面客户端',
  head: [['link', { rel: 'icon', href: '/icon.png' }]],

  bundler: viteBundler(),

  theme: defaultTheme({
    logo: '/logo.png',
    repo: 'https://github.com/leck995/115disk',
    docsDir: 'docs',
    // 标题大纲放到右侧「本页目录」，左侧只保留文档列表
    sidebarDepth: 0,
    navbar: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '指南',
        link: '/guide/',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          children: [
            { text: '使用指南', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
          ],
        },
        {
          text: '网盘管理',
          children: [
            { text: '网盘文件管理', link: '/guide/file-manager' },
            { text: '上传与下载', link: '/guide/transfer' },
            { text: '云下载与磁力', link: '/guide/cloud-download' },
          ],
        },
        {
          text: '媒体库（重点）',
          children: [
            { text: '媒体库', link: '/guide/media-library' },
            { text: '媒体库 · 刮削', link: '/guide/media-scrape' },
            { text: '在线播放', link: '/guide/playback' },
          ],
        },
        {
          text: '其他',
          children: [
            { text: '设置与更新', link: '/guide/settings' },
            { text: '赞助与体验', link: '/guide/sponsor' },
          ],
        },
      ],
    },
    editLink: false,
    lastUpdated: false,
    contributors: false,
  }),
})

