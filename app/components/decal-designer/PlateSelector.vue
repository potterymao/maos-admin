<template>
  <div class="panel">
    <h2 class="design-panel-title">
      <Icon name="material-symbols:circle" class="text-blue-500" />
      <span>{{ $t("_designer.selectPlate") }}</span>
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="plate in plates" :key="plate.id"
        :class="['plate-card', { active: designStore.currentMainPlate?.id === plate.id }]"
        @click="designStore.selectMainPlate(plate.id)">
        <div class="rounded-full mx-auto mb-2 flex items-center justify-center">
          <img :src="plate.image" :alt="plate.name" class="w-18 h-18 object-contain" />
        </div>
        <div class="text-center plate-info text-gray-800">
          <h4>{{ appStore.locale === "zh-TW" ? plate.name_zh : plate.name_en }}</h4>
        </div>
        <div class="plate-info text-gray-800">
          <p>{{ $t("_designer.size") }}: {{ plate.size.width }} × {{ plate.size.height }}mm</p>
          <p>{{ $t("_designer.price") }}: ${{ plate.price }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <div v-for="(child, i) in designStore.currentMainPlate?.variations" :key="child.id"
        :class="['plate-card', { active: designStore.currentPlate?.id === child.id }]"
        @click="designStore.selectPlate(child.id)">
        <div class="rounded-full mx-auto mb-2 flex items-center justify-center">
          <img :src="child.media.images.source.url" :alt="child.name" class="w-18 h-18 object-contain" />
        </div>
        <div class="text-center plate-info text-gray-800 mt-4">
          <h4>{{ appStore.locale === "zh-TW" ?
            designStore.currentMainPlate?.variant_options[i].name_translations['zh-hant'] :
            designStore.currentMainPlate?.variant_options[i].name_translations.en }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetPlates, GetImage } from "@/api";
// import IconPlate from "@/assets/images/svg/plate.svg";

const appStore = useAppStore();
const designStore = useDesignStore();

const plates = ref([]);

// 獲取圖案列表
const getPlates = async () => {
  let platesData: any = [];
  const response = await GetPlates();
  if (response && response.items) {
    for (const [i, item] of response.items.entries()) {
      platesData.push({
        id: item.id,
        name_en: item.title_translations.en,
        name_zh: item.title_translations["zh-hant"],
        image: item.medias?.[0]?.images.source.url ? await GetImage(item.medias?.[0]?.images.source.url) : "",
        type: item.type,
        size: { width: 350, height: 350 },
        price: item.price.dollar || 300,
        children: [],
        variations: item.variations || [],
        variant_options: item.variant_options || [],
      });

      if (item.variations && item.variations.length > 0) {
        for (const [j, variation] of item.variations.entries()) {
          platesData[i].children.push({
            id: variation.id,
            name_en: item.variant_options[j].name_translations.en,
            name_zh: item.variant_options[j].name_translations["zh-hant"],
            image: variation.media?.images.source.url ? await GetImage(variation.media.images.source.url) : "",
            type: item.type,
            size: { width: 350, height: 350 },
            price: variation.price.dollar || 300,
          });
        }
      }
    }
    plates.value = platesData; // 直接更新本地 patterns 變數
    designStore.SetPlates(platesData);
  }
};
getPlates();
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
