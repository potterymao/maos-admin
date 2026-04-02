<template>
  <div></div>
</template>

<script setup lang="ts">
const appStore = useAppStore();

if(appStore.firstPage === "") {
  navigateTo('/designer/decal-designer');
}
</script>
