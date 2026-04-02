<template>
  <div :class="layoutClasses" class="app-wrapper">
    <div v-if="layoutClasses.mobile && layoutClasses.openSidebar" class="drawer-bg" @click="handleClickOutside" />

    <Sidebar class="sidebar-container" />

    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }" class="layout-header">
        <nav-bar />
      </div>

      <app-main class="app-main" />
    </div>
  </div>
</template>
<script setup lang="ts">
// import NavBar from '~/components/nav-bar.vue';

const appStore = useAppStore();
const settingsStore = useSettingsStore();

const { fixedHeader } = storeToRefs(settingsStore);

const layoutClasses = computed(() => {
  return {
    hideSidebar: !appStore.sidebar.opened,
    openSidebar: appStore.sidebar.opened,
    withoutAnimation: appStore.sidebar.withoutAnimation,
    mobile: appStore.device === DeviceEnum.Mobile,
  };
});

/** mobile 端側邊欄遮罩層的事件 */
const handleClickOutside = () => {
  appStore.closeSidebar(false);
};
</script>

<style lang="scss" scoped>
$transition-time: 0.35s;

.app-wrapper {
//   @extend %clearfix;
  position: relative;
  width: 100%;
}

.drawer-bg {
  background-color: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.sidebar-container {
  background-color: var(--sidebar-menu-bg-color);
  box-shadow: var(--el-box-shadow-lighter);

  transition: width $transition-time;
  width: var(--sidebar-width) !important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  border-right: var(--sidebar-border-right);
}

.main-container {
  min-height: 100%;
  transition: margin-left $transition-time;
  margin-left: var(--sidebar-width);
  position: relative;
}

.fixed-header {
  position: fixed !important;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - var(--sidebar-width));
  transition: width $transition-time;
}

.layout-header {
  position: relative;
  z-index: 9;
  background-color: var(--header-bg-color);
  box-shadow: var(--el-box-shadow-lighter);
  border-bottom: var(--header-border-bottom);
}

.app-main {
  min-height: calc(100vh - var(--navbar-height));
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: var(--navbar-height);
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - var(--header-height));
  }
  .fixed-header + .app-main {
    padding-top: var(--header-height);
  }
}

.hideSidebar {
  .sidebar-container {
    width: var(--sidebar-hide-width) !important;
  }
  .main-container {
    margin-left: var(--sidebar-hide-width);
  }
  .fixed-header {
    width: calc(100% - var(--sidebar-hide-width));
  }
}

// mobile 端
.mobile {
  .sidebar-container {
    transition: transform $transition-time;
    width: var(--sidebar-width) !important;
  }
  .main-container {
    margin-left: 0px;
  }
  .fixed-header {
    width: 100%;
  }
  &.openSidebar {
    position: fixed;
    top: 0;
  }
  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(calc(0px - var(--sidebar-width)), 0, 0);
    }
  }
  // 既是 mobile 又是顶部或混合布局模式
  // &.noLeft {
  //   .sidebar-container {
  //     background-color: var(--el-bg-color);
  //   }
  // }
}

.withoutAnimation {
  .sidebar-container,
  .main-container {
    transition: none;
  }
}
</style>
