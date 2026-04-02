<template>
  <section class="app-main">
    <div class="app-scrollbar">
      <router-view v-slot="{ Component, route }" :key="route.path">
        <transition name="el-fade-in" mode="out-in">
          <keep-alive>
            <component :is="Component" class="app-container-grow" />
          </keep-alive>
        </transition>
      </router-view>

      <app-footer />
    </div>

    <!-- 返回顶部 -->
    <el-backtop />
    <!-- 返回顶部（固定 Header 情况下） -->
    <el-backtop target=".app-scrollbar" />
  </section>
</template>

<script setup lang="ts">
const route = useRoute();
</script>

<style lang="scss" scoped>
@use "@/assets/mixins.scss" as *;

.app-main {
  width: 100%;
  display: flex;
}

.app-scrollbar {
  flex-grow: 1;
  overflow: auto;
  // @extend %scrollbar;
  display: flex;
  flex-direction: column;

  .app-container-grow {
    flex-grow: 1;
  }
}
</style>
