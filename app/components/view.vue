<template>
  <v-main class="grey lighten-3">
    <div class="core-view">
      <v-fade-transition mode="out-in">
        <nuxt></nuxt>
      </v-fade-transition>
    </div>

    <!-- <core-footer /> -->
  </v-main>
</template>

<script setup lang="ts">
// import Footer from "@/components/core/Footer";
// export default {
//   name: "CoreView",
//   components: {
//     CoreFooter: Footer,
//   },
// };
</script>

<style lang="scss" scoped>

.container {
  padding: 0 12px !important;
}
</style>
