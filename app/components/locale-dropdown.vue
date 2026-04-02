<template>
  <el-dropdown trigger="click" @command="setLang">
    <span class="el-dropdown-link flex items-center">
      <template v-if="currenti18n.locale.value === 'en'">
        <img src="@/assets/images/flags/en.png" />
      </template>
      <template v-if="currenti18n.locale.value === 'zh-TW'">
        <img src="@/assets/images/flags/zh_tw.png" />
      </template>
      <text>{{ $t(currenti18n.locale.value) }}</text> <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in langMap" :key="item.lang" :command="item.lang">
          <img :src="item.icon" class="h-22px mr-10px" />
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";
// import { useDesign } from "@/hooks/useDesign";
// import { useTitle } from "@/hooks/useTitle";
// import { getLocale } from "@/utils/local-storage";
// import i18n from "@/plugins/i18n";

// const { getPrefixCls } = useDesign();
// const prefixCls = getPrefixCls("locale-dropdown");

const router = useRouter();
const appStore = useAppStore();

const currenti18n = useI18n();
currenti18n.locale.value = getLocale() || "";
// let currentIcon = "";

const setLang = (command: string) => {
  currenti18n.locale.value = command;
  appStore.setCurrentLocale(command);
  // change title locale
  const { setTitle } = useTitle();
  let setTile = "";
  setTile = $t(router.currentRoute.value.meta.title + "");
  if (router.currentRoute.value.params.customer_id) {
    setTile = $t("tags_customer_detail", { customer_id: router.currentRoute.value.params.customer_id });
  }
  setTitle(setTile);
  appStore.routeKey++;
};

// initial
if (currenti18n.locale.value === "") {
  setLang("zh-TW");
}
</script>

<style lang="scss" scoped>
img {
  height: 22px;
  margin-right: 10px;
}
</style>
