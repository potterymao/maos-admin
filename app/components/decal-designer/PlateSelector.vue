<template>
  <div class="panel plate-selector-panel">
    <h2 class="design-panel-title">
      <Icon name="material-symbols:circle" class="text-blue-500" />
      <span>{{ $t("_designer.selectPlate") }}</span>
    </h2>
    <div class="plate-list grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="plate in plates" :key="plate.id"
        :class="['plate-card', 'main-plate-card', { active: designStore.currentMainPlate?.id === plate.id }]"
        role="button" tabindex="0"
        @click="designStore.selectMainPlate(plate.id)"
        @keydown.enter.space.prevent="designStore.selectMainPlate(plate.id)">
        <div class="plate-image rounded-full mx-auto mb-2 flex items-center justify-center">
          <img :src="plate.image" class="w-18 h-18 object-contain" :alt="appStore.locale === 'zh-TW' ? plate.name_zh : plate.name_en" />
        </div>
        <div class="text-center plate-info text-gray-800">
          <h4>{{ appStore.locale === "zh-TW" ? plate.name_zh : plate.name_en }}</h4>
        </div>
        <div class="plate-info text-gray-800">
          <!-- <p>{{ $t("_designer.size") }}: {{ plate.size.width }} × {{ plate.size.height }}mm</p> -->
          <p>{{ $t("_designer.size") }}: {{ plate.size_label }}</p>
          <p>{{ $t("_designer.price") }}: ${{ plate.price }}</p>
        </div>
      </div>
    </div>

    <div class="surface-list grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
      <div v-for="(child, i) in currentMainPlate?.children" :key="child.id"
        :class="['plate-card', 'surface-card', { active: designStore.currentPlate?.id === child.id }]"
        role="button" tabindex="0"
        @click="designStore.selectPlate(child.id, i)"
        @keydown.enter.space.prevent="designStore.selectPlate(child.id, i)">
        <div class="surface-image rounded-full mx-auto mb-2 flex items-center justify-center">
          <img :src="child.image" class="w-18 h-18 object-contain" :alt="appStore.locale === 'zh-TW' ? child.name_zh : child.name_en" />
        </div>
        <div class="text-center plate-info text-gray-800 mt-4">
          <h4>{{ appStore.locale === "zh-TW" ? child.name_zh : child.name_en }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetImage } from "@/api";
import { cropTransparentImage } from "@/utils/crop-transparent-image";
import { parsePhysicalDimensions } from "@/utils/physical-size";
// import IconPlate from "@/assets/images/svg/plate.svg";

const appStore = useAppStore();
const designStore = useDesignStore();

const plates = ref([]);
const currentMainPlate = computed(() => designStore.currentMainPlate);

const initData = async () => {
  await designStore.fetchPlates();
  await getPlates();
};

// 獲取圖案列表
const getPlates = async () => {
  let platesData: any = [];
  const response: any = computed(() => designStore.plates).value;

  if (response && response.items) {
    for (const [i, item] of response.items.entries()) {
      // console.log("Processing plate:", item);
      const physicalSize = parsePhysicalDimensions(item.feed_variations.size);
      platesData.push({
        id: item.id,
        name_en: item.title_translations.en,
        name_zh: item.title_translations["zh-hant"],
        image: item.medias?.[0]?.images.source.url
          ? await cropTransparentImage(await GetImage(item.medias[0].images.source.url))
          : "",
        type: item.type,
        size_label: item.feed_variations.size,
        size: physicalSize,
        price: item.lowest_price.dollars || 0,
        children: [],
      });

      if (item.variations && item.variations.length > 0) {
        for (const [j, variation] of item.variations.entries()) {
          const variationSize = parsePhysicalDimensions(
            variation.feed_variations?.size,
            physicalSize,
          );
          const isSideSurface = item.id === "69f2f69560e697a7e0148919" && j === 2;
          const surfaceSize = isSideSurface
            ? {
                width: variationSize.width,
                height: variationSize.width,
                depth: variationSize.depth || physicalSize.depth || 20,
              }
            : variationSize;
          platesData[i].children.push({
            id: variation.id,
            name_en: item.variant_options[j].name_translations.en,
            name_zh: item.variant_options[j].name_translations["zh-hant"],
            image: variation.media?.images.source.url
              ? await cropTransparentImage(await GetImage(variation.media.images.source.url))
              : "",
            type: item.type,
            size: surfaceSize,
            physical_size: variationSize,
            surface: isSideSurface ? "side" : (j === 1 ? "back" : "front"),
            price: variation.price.dollar || 0,
          });
        }
      }
    }
    plates.value = platesData; // 直接更新本地 plates 變數
    designStore.SetPlates(platesData);
  }
};

// 初始化數據
// Image conversion uses FileReader, so plate data must be prepared in the browser.
onMounted(initData);

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

@media (max-width: 768px) {
  .plate-selector-panel {
    padding: 14px 12px;
  }

  .plate-list {
    display: flex;
    gap: 10px;
    padding: 2px 2px 10px;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
  }

  .main-plate-card {
    flex: 0 0 min(168px, 46vw);
    min-height: 166px;
    padding: 10px;
    scroll-snap-align: start;
  }

  .plate-image {
    height: 76px;
    margin-bottom: 4px;
  }

  .main-plate-card h4 {
    min-height: 40px;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
  }

  .surface-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
    gap: 8px;
    margin-top: 14px;
  }

  .surface-card {
    min-width: 0;
    min-height: 112px;
    padding: 8px 5px;
  }

  .surface-image {
    height: 60px;
    margin-bottom: 2px;
  }

  .surface-card .plate-info {
    margin-top: 4px;
  }

  .surface-card h4 {
    overflow-wrap: anywhere;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.3;
  }
}
</style>
