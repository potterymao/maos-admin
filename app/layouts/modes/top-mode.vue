<template>
  <div class="app-wrapper">
    <div class="fixed-header layout-header">
      <div class="content">
        <Logo v-if="showLogo" :collapse="false" class="logo" />
        <nav-bar class="nav-bar" />
      </div>
      <!-- <TagsView v-show="showTagsView" /> -->
    </div>

    <!-- <div :class="{ hasTagsView: showTagsView }" class="main-container"> -->
    <div class="main-container">
      <AppMain class="app-main" />
    </div>
  </div>
</template>
<script setup lang="ts">
const settingsStore = useSettingsStore();
const { showLogo } = storeToRefs(settingsStore);
</script>

<style lang="scss" scoped>
// @use "@/assets/styles/mixins.scss" as *;
/* $transition-time: 0.35s; */

.app-wrapper {
  /* @extend %clearfix; */
  width: 100%;
}

.fixed-header {
  position: fixed;
  top: 0;
  z-index: 1002;
  width: 100%;
  .logo {
    width: var(--sidebar-width);
  }
  .content {
    display: flex;
    .nav-bar {
      flex: 1;
    }
  }
}

.layout-header {
  background-color: var(--header-bg-color);
  box-shadow: var(--header-box-shadow);
  border-bottom: var(--header-border-bottom);
}

.main-container {
  min-height: 100%;
}

.app-main {
  /* transition: padding-left $transition-time; */
  padding-top: var(--navbar-height);
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    padding-top: var(--header-height);
  }
}
</style>
