<template>
  <div class="fixed-header layout-header">
    <div class="content">
      <logo v-if="showLogo" :collapse="false" class="logo" />
      <nav-bar class="nav-bar" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();
const { showLogo } = storeToRefs(settingsStore);
</script>

<style lang="scss" scoped>
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
</style>
