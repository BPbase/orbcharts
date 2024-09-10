// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/orbcharts/' : '/',
    buildAssetsDir: '/static/',
    head: {
      titleTemplate: '%s | OrbCharts',
      htmlAttrs: {
        lang: 'zh-Hant-TW',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: '從資料到視覺化 - 為資料格式設計的圖表框架。' },
        { name: 'keywords', content: 'chart,graph,visualization,infographic,d3,rxjs,svg' },
        { name: 'author', content: '藍星球資訊 BluePlanet Technology' },
        { name: 'copyright', content: 'Copyright © 2024 BluePlanet Technology All Rights Reserved. 本網頁著作權屬藍星球資訊' },

        // Open Graph
        { property: 'og:url', content: 'https://bpbase.github.io/orbcharts/' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'OrbCharts'},
        { property: 'og:description', content: '從資料到視覺化 - 為資料格式設計的圖表框架'},
        { property: 'og:image', content: 'https://bpbase.github.io/orbcharts/orbcharts_logo_temp.png'},

        // 在手機上，加入主畫面的名稱
        { name: 'apple-mobile-web-app-title', content: 'OrbCharts' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      ]
    }
  },
  nitro: {
    prerender:{
      failOnError:false,
    }
  }
})
