<template>
  <footer class="pt-30px pb-20px px-5% bg-#FEFDE6">
    <template v-if="!isMobile"> 
      <div class="layout-footer mt-20px">&copy {{ new Date().getFullYear() }} Mao's studio</div>
    </template>
  </footer>
  <!-- <footer class="pb-24 pt-12">
    <div class="container mx-auto px-8">
      <div class="flex flex-wrap justify-center space-x-8">
        <NuxtLink href="https://www.facebook.com/vuedesigner" aria-label="facebook" external target="_blank">
          <UIcon name="i-logos-facebook" class="text-2xl" width="28px" />
        </NuxtLink>
        <NuxtLink href="https://twitter.com/vuedesigner" aria-label="twitter" external target="_blank">
          <UIcon name="i-logos-twitter" class="text-2xl" width="28px" />
        </NuxtLink>
        <NuxtLink href="https://discord.gg/BYp45Nnu5T" aria-label="discord" external target="_blank">
          <UIcon name="i-logos-discord-icon" class="text-2xl" width="28px" />
        </NuxtLink>
        <NuxtLink href="https://www.youtube.com/@vuedesigner" aria-label="youtube" external target="_blank">
          <UIcon name="i-logos-youtube-icon" class="text-2xl" width="28px" />
        </NuxtLink>
      </div>
    </div>

     <div class="layout-footer mt-20px">&copy {{ new Date().getFullYear() }} Mao's studio</div>
  </footer> -->
</template>
<script setup lang="ts">
const { isMobile } = useDevice();
</script>

<style scoped>
.layout-footer {
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00284c;
}
</style>
