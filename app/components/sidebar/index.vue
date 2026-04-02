<template>
  <div :class="{ 'has-logo': isLogo }">
    <Logo v-if="isMobile" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="$route.path"
        background-color="var(--sidebar-menu-bg-color)"
        text-color="var(--sidebar-menu-text-color)"
        :active-text-color="activeTextColor"
        :collapse-transition="false"
        :mode="!isMobile ? 'horizontal' : 'vertical'"
        class="justify-end"
      >
        <Item v-for="noHiddenRoute in navsMain" :key="noHiddenRoute.path" :item="noHiddenRoute" :base-path="noHiddenRoute.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
// import { usePermissionStore } from "@/stores/modules/permission";
import { useSettingsStore } from "@/stores/settings";
// import { useDevice } from "@/hooks/useDevice";
// import { useLayoutMode } from "@/hooks/useLayoutMode";
// import { getCssVar } from "@/utils/css";
// import { Logo } from "../index";
// import Item from "./Item.vue";

// const sidebarMenuBgColor = getCssVar("--sidebar-menu-bg-color");
// const sidebarMenuTextColor = getCssVar("--sidebar-menu-text-color");
// const sidebarMenuActiveTextColor = getCssVar("--sidebar-menu-active-text-color");

const { isMobile } = useDevice();
// const { isLeft, isTop } = useLayoutMode();
// const route = useRoute();
const appStore = useAppStore();
// const permissionStore = usePermissionStore();
const settingsStore = useSettingsStore();

// const activeMenu = computed(() => route.meta.activeMenu || route.path);
// const noHiddenRoutes = computed(() => useNavMenu());
const { navsMain } = useNavMenu()
const isCollapse = computed(() => !appStore.sidebar.opened);
const isLogo = computed(() => settingsStore.showLogo);
// const backgroundColor = computed(() => (isLeft.value ? sidebarMenuBgColor : undefined));
// const textColor = computed(() => (isLeft.value ? sidebarMenuTextColor : undefined));
// const activeTextColor = computed(() => (isLeft.value ? sidebarMenuActiveTextColor : undefined));
const activeTextColor = computed(() => "var(--sidebar-menu-active-text-color)");
// const sidebarMenuItemHeight = computed(() => (!isTop.value ? "var(--sidebar-menu-item-height)" : "var(--navbar-height)"));
// const sidebarMenuHoverBgColor = computed(() => (!isTop.value ? "var(--sidebar-menu-hover-bg-color)" : "transparent"));
// const tipLineWidth = computed(() => (!isTop.value ? "2px" : "0px"));
const sidebarMenuItemHeight = "var(--sidebar-menu-item-height)";
const sidebarMenuHoverBgColor = "var(--sidebar-menu-hover-bg-color)";
const tipLineWidth = "0px";
</script>

<style lang="scss" scoped>
%tip-line {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: v-bind(tipLineWidth);
    height: 100%;
    background-color: var(--sidebar-menu-tip-line-bg-color);
  }
}

.has-logo {
  .el-scrollbar {
    height: calc(100% - var(--header-height));
  }
}

.el-scrollbar {
  height: 100%;
  :deep(.scrollbar-wrapper) {
    // 限制水平宽度
    overflow-x: hidden;
  }
  // 滚动条
  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      // 隐藏水平滚动条
      display: none;
    }
  }
}

.el-menu {
  user-select: none;
  border: none;
  width: 100%;
}

.el-menu--horizontal {
  height: v-bind(sidebarMenuItemHeight);
}
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title),
:deep(.el-sub-menu .el-menu-item),
:deep(.el-menu--horizontal .el-menu-item) {
  height: v-bind(sidebarMenuItemHeight);
  line-height: v-bind(sidebarMenuItemHeight);
  &.is-active,
  &:hover {
    background-color: v-bind(sidebarMenuHoverBgColor);
  }
}

:deep(.el-sub-menu) {
  &.is-active {
    > .el-sub-menu__title {
      color: v-bind(activeTextColor);
    }
  }
}

// :deep(.el-menu-item.is-active) {
//   @extend %tip-line;
// }

.el-menu--collapse {
  :deep(.el-sub-menu.is-active) {
    .el-sub-menu__title {
      // @extend %tip-line;
      background-color: v-bind(sidebarMenuHoverBgColor);
    }
  }
}
</style>
