<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

useHead({
  meta: [
    { charset: "utf-8" },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: useI18n().locale.value,
  },
});

useSeoMeta({
  title: "客製化盤子設計器 | Plate Designer",
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1",
  description: "線上客製化盤子設計工具，自由選擇盤子樣式、添加圖案，創造獨一無二的盤子設計",
  keywords: "盤子設計,客製化,DIY,圖案設計,餐具設計",
  author: "Plate Designer",
  
  // Open Graph
  ogTitle: "客製化盤子設計器",
  ogDescription: "線上客製化盤子設計工具",
  ogType: "website",
  ogUrl: "https://plate-designer.com",
  ogImage: "/og-image.jpg",
  
  // Twitter Card
  twitterCard: "summary_large_image",
  twitterTitle: "客製化盤子設計器",
  twitterDescription: "線上客製化盤子設計工具",
})

</script>

<style>
/* * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
  background-color: #f5f5f5;
  color: #333;
} */

#__nuxt {
  min-height: 100vh;
}
</style>
