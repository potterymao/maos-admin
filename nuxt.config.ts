// https://nuxt.com/docs/api/configuration/nuxt-config

/// <reference types="@nuxtjs/i18n" />
/// <reference types="@vite-pwa/nuxt" />

export default defineNuxtConfig({
  // compatibilityDate: "2025-07-15",

  // SSR (SEO)
  ssr: true, // 关闭服务器端渲染，启用客户端渲染

  devtools: { enabled: false },

  // devServer: {
  //   host: "0.0.0.0",
  //   port: 3000,
  // },

  // generate: {
  //   routes: ["/"], // 只生成首页
  // },
  // 确保构建后的资源路径是相对路径
  // build: {
  //   publicPath: "./_nuxt/", // 注意：Nuxt 3 中可能需要额外配置
  // },

  // 启用 TypeScript 和 JSX 支持
  typescript: {
    strict: true,
    shim: false,
  },

  // 元件自動引入
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  modules: ["@nuxt/devtools", "@nuxt/ui", "@element-plus/nuxt", "@pinia/nuxt", "@nuxtjs/i18n", "dayjs-nuxt", "nuxt-svgo", "@vite-pwa/nuxt"],

  css: ["element-plus/dist/index.css", "~/assets/index.scss", "~/assets/css/main.css"],

  // // UnoCSS 配置
  // unocss: {
  //   // uno: true,
  //   icons: true,
  //   attributify: true,
  //   preflight: true, // 类似 Tailwind 的 reset
  // },

  plugins: [
    // { src: '~/plugins/i18n.js' },
  ],

  // i18n 設定
  i18n: {
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en.json",
      },
      {
        code: "zh-TW",
        iso: "zh-TW",
        name: "繁體中文",
        file: "zh-TW.json",
      },
    ],
    defaultLocale: "zh-TW",
    strategy: "prefix_and_default",
    langDir: "locales", // 語言檔目錄
  },

  // 應用設定
  app: {
    head: {
      title: "客製化貼花設計器 | Plate Designer",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "線上客製化貼花設計工具，自由選擇貼花樣式、添加圖案，創造獨一無二的貼花設計",
        },
        { name: "keywords", content: "貼花設計,客製化,DIY,圖案設計,餐具設計" },
        { name: "author", content: "Plate Designer" },
        // Open Graph
        { property: "og:title", content: "客製化貼花設計器" },
        { property: "og:description", content: "線上客製化貼花設計工具" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://plate-designer.com" },
        { property: "og:image", content: "/og-image.jpg" },
        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "客製化貼花設計器" },
        { name: "twitter:description", content: "線上客製化貼花設計工具" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    // baseURL: process.env.NODE_ENV === "production" ? "/maos-admin/" : "/",
    // baseURL: "/maos-admin/",
    buildAssetsDir: "/static/",
  },

  // --- PWA 核心設定區塊 ---
  pwa: {
    registerType: "autoUpdate", // 當有新版本部署時，自動更新 Service Worker 檔案
    manifest: {
      name: "客製化貼花設計器 | Plate Designer",
      short_name: "貼花設計器",
      description: "線上客製化貼花設計工具，自由選擇貼花樣式、添加圖案，創造獨一無二的貼花設計",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone", // 重要：平板安裝後會隱藏瀏覽器網址列，像原生應用程式一樣全螢幕運作
      start_url: "/",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable" // 確保在部分 Android 平板上圖示不會被強制切成奇怪的形狀
        }
      ]
    },
    workbox: {
      navigateFallback: "/",
      // 確保設計器專用的圖檔（如 .svg, .png）也能加入離線快取快取
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"]
    },
    devOptions: {
      enabled: true // 開發環境 (npm run dev) 也啟動 PWA 方便你在本地端用平板測試
    }
  },

  nitro: {
    // routeRules: {
    //   // 将所有以 /image-proxy/ 开头的请求代理到目标图片服务器
    //   "/image-proxy/**": {
    //     proxy: "https//img.shoplineapp.com/**",
    //   },
    // },
    // server: {
    //   cors: {
    //     origin: ['http://localhost:3000', 'http://192.168.0.244:3000/maos-admin'],
    //     methods: ['GET', 'OPTIONS'],
    //     allowedHeaders: ['*']
    //   }
    // },
    // preset: "github_pages", // 為GitHub Pages做優化打包
    prerender: {
      // routes: ["/"], // 指定要預渲染 (prerender)的頁面
      crawlLinks: true, // 自動尋找連結生成 HTML
      failOnError: false, // 即使某頁報錯(如 window is not defined)，也強制完成 build 產出 index.html
    },
    // devProxy: {
    //   "/shopline_api": {
    //     target: "https://open.shopline.io/v1", // 替換為真實的 API Base URL
    //     changeOrigin: true,
    //   },
    // },
  },

  runtimeConfig: {
    public: {
      shoplineApi: process.env.SHOPLINE_API_URL || 'https://open.shopline.io/v1',
      shoplineAccessKey: process.env.SHOPLINE_ACCESS_KEY || '',
      shoplinePlateId: process.env.SHOPLINE_PLATE_CATEGORY_ID || '',
      shoplinePatternId: process.env.SHOPLINE_PATTERN_CATEGORY_ID || '',
      shoplineMerchantId: process.env.SHOPLINE_MERCHANT_ID || ''
    }
  },

  routeRules: {
    "/**": { prerender: true }, // 告訴Nuxt所有路由都要prerender
  },
});
