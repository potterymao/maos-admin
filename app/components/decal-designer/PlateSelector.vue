<template>
  <div class="">
    <h2 class="design-panel-title">
      <Icon name="material-symbols:circle" class="text-blue-500" />
      <span>{{ $t("_designer.selectPlate") }}</span>
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="plate in plates" :key="plate.id" :class="['plate-card', { active: designStore.currentPlate?.id === plate.id }]" @click="designStore.selectPlate(plate.id)">
        <!-- <div class="w-18 h-18 rounded-full mx-auto mb-2 flex items-center justify-center" :style="{ backgroundColor: plate.color }">
          <i :class="plate.icon" :style="{ color: plate.iconColor, fontSize: '1.5rem' }"></i>
        </div> -->
        <div class="rounded-full mx-auto mb-2 flex items-center justify-center">
          <img :src="plate.image" :alt="plate.name" class="w-18 h-18 object-contain" />
        </div>
        <div class="text-center plate-info text-gray-800">
          <!-- <h4>{{ plate.name }}</h4> -->
          <h4>{{ appStore.locale === "zh-TW" ? plate.name_zh : plate.name_en }}</h4>
        </div>
        <div class="plate-info text-gray-800">
          <p>{{ $t("_designer.size") }}: {{ plate.size.width }} × {{ plate.size.height }}mm</p>
          <p>{{ $t("_designer.price") }}: ${{ plate.price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import IconPlate from "@/assets/images/svg/plate.svg";
const appStore = useAppStore();
const designStore = useDesignStore();

designStore.loadPlates();

const plates = computed(() => designStore.plates);
</script>

<style lang="scss" scoped>
.plate-card {
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.plate-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  background-color: #f0f7ff;
}

.plate-card.active {
  border-color: #667eea;
  // background: linear-gradient(135deg, #667eea11 0%, #764ba211 100%);
  background-color: #e6f2ff;
}

.plate-info p {
  margin: 2px 0;
  font-size: 12px;
  color: #666;
}
</style>
