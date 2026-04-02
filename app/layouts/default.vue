<template>
  <div>
    <left-mode v-if="isMobile" />

    <top-mode v-else />
  </div>
</template>

<script setup lang="ts">
import LeftMode from './modes/left-mode.vue';
import TopMode from './modes/top-mode.vue';

useResize();

const { isMobile } = useDevice();
// const appStore = useAppStore();

// if(appStore.firstPage === "") {
//   // appStore.setFirestPage('/designer/decal-designer');
//   navigateTo('/designer/decal-designer');
// }
</script>

<style lang="scss" scoped>
.main-container {
  min-height: 100%;
}

.app-main {
  /* transition: padding-left $transition-time; */
  padding-top: var(--navbar-height);
  height: 100vh;
  overflow: auto;
}
</style>
