<template>
  <div class="layout-logo-container layout-mode-top" :class="{ collapse: props.collapse }">
    <transition name="layout-logo-fade">
      <router-link to="/">
        <img :src="logo" class="layout-logo-text p-4" />
      </router-link>
    </transition>
    <!-- <transition name="layout-logo-fade">
      <nuxt-link v-if="props.collapse" key="collapse" to="/">
        <img :src="logo" class="layout-logo" />
      </nuxt-link>
      <nuxt-link v-else key="expand" to="/">
        <img :src="logo" class="layout-logo-text p-[10px]" />
      </nuxt-link>
    </transition> -->
    <!-- <transition name="layout-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/">
        <img :src="logo" class="layout-logo" />
      </router-link>
      <router-link v-else key="expand" to="/">
        <img :src="logo" class="layout-logo-text p-[10px]" />
      </router-link>
    </transition> -->
  </div>
</template>
<script setup lang="ts">
import logo from "@/assets/images/logo/logo.webp";

interface Props {
  collapse?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapse: true,
});
</script>

<style lang="scss" scoped>
img {
  display: unset;
}

.layout-logo-container {
  position: relative;
  width: 100%;
  height: var(--header-height);
  line-height: var(--header-height);
  text-align: center;
  overflow: hidden;
  .layout-logo {
    display: none;
  }
  .layout-logo-text {
    max-height: 100%;
    max-width: 100%;
    vertical-align: middle;
  }
}

.layout-mode-top {
  height: var(--navbar-height);
  line-height: var(--navbar-height);
}
</style>
