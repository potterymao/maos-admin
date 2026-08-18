<template>
  <div class="panel pattern-selector-panel">
    <h2 class="design-panel-title">
      <Icon name="material-symbols:category-rounded" class="text-blue-500 text-[28px]" />
      {{ $t("_designer.selectPattern") }}
    </h2>

    <USelectMenu
      v-model="activeCategory"
      :items="categories"
      value-key="key"
      class="pattern-category-select w-full mb-4"
    />

    <div class="patterns-grid">
      <div v-for="pattern in filteredPatterns" :key="pattern.id" class="pattern-card" @click="addPattern(pattern.id)"
        @dragstart="onDragStart(pattern, $event)" draggable="true">
        <!-- <div class="pattern-thumbnail" v-html="pattern.svg" /> -->
        <div class="pattern-img">
          <img :src="pattern.image" :alt="pattern.name" class="w-full h-full object-contain" />
        </div>
        <!-- <div class="pattern-info">
          <span class="pattern-name">{{ appStore.locale === "zh-TW" ? pattern.name_zh : pattern.name_en }}</span>
        </div> -->
      </div>
    </div>

    <!-- <div class="grid grid-cols-4 gap-3">
      <div v-for="pattern in designStore.patternOptions" :key="pattern.id" class="pattern-option" @click="designStore.addPattern(pattern)">
        <img :src="pattern.image" :alt="pattern.name" class="w-10 h-10 mx-auto mb-1 object-contain" />
        <div class="text-xs text-center text-gray-600 truncate">
          {{ pattern.name }}
        </div>
      </div>
    </div> -->

    <div class="pattern-help mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-bold text-gray-800 mb-2">{{ $t("_designer.pattern_selector_desc") }}</h3>
      <ul class="text-sm text-gray-600 space-y-1">
        <li>{{ $t("_designer.pattern_selector_desc_1") }}</li>
        <li>• 拖拽圖案調整位置</li>
        <li>• 拖拽角落控制點調整大小</li>
        <li>• 拖拽頂部控制點旋轉圖案</li>
        <li>• 點擊圖案右上角×按鈕刪除</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { onMounted } from "vue";
import type { SelectMenuItem } from "@nuxt/ui";
import { GetImage } from "@/api";
import { parsePhysicalDimensions } from "@/utils/physical-size";

const appStore = useAppStore();
const designStore = useDesignStore();
// const { patterns } = storeToRefs(designStore)
// onMounted(async () => {
//   await useFetchPatterns();
// });


// 分類選項
const categories = ref<SelectMenuItem[]>([
  { key: "all", label: $t("patterns.all") },
  { key: "pets", label: $t("patterns.pets") },
  { key: "alphabet", label: $t("patterns.alphabet") }
]);
const activeCategory = ref("all");

// 計算屬性
const patterns = ref([]);
// const patterns = computed(() => designStore.patterns);
// const placedPatterns = computed(() => designStore.placedPatterns);

const initData = async () => {
  await designStore.fetchPatterns();
  await getPatterns();
};

// 獲取圖案列表
const getPatterns = async () => {
  let patternsData: any = [];
  const response: any = computed(() => designStore.patterns).value;
  // const response = await GetPatterns();
  if (response && response.items) {
    for (const item of response.items) {
      if (item.variations && item.variations.length > 0) {
        for (const [i, variation] of item.variations.entries()) {
          const feedVariation = variation.feed_variations || {};
          const physicalSize = parsePhysicalDimensions(
            feedVariation.size,
            { width: 50, height: 50 },
          );
          patternsData.push({
            id: variation.id,
            parent_id: item.id,
            name_en: feedVariation.custom?.en
              || item.variant_options?.[i]?.name_translations?.en
              || item.title_translations?.en
              || "",
            name_zh: feedVariation.custom?.["zh-hant"]
              || item.variant_options?.[i]?.name_translations?.["zh-hant"]
              || item.title_translations?.["zh-hant"]
              || "",
            image: variation.media?.images.source.url ? await GetImage(variation.media.images.source.url) : "",
            price: variation.price.dollars || 0,
            price_label: variation.price.label,
            tags: item.tags || [],
            size_label: feedVariation.size || "",
            physical_size: physicalSize,
            size: physicalSize,
            defaultSize: null,
          })
        }
      }
    }
    patterns.value = patternsData; // 直接更新本地 patterns 變數
    designStore.SetPatterns(patternsData);
    // console.log("Fetched patterns: 2");
  }
};
// getPatterns();

// 初始化數據
// Pattern images are converted with FileReader and must load in the browser.
onMounted(initData);

// 過濾圖案
const filteredPatterns = computed(() => {
  let filtered = patterns.value || [];

  // 分類過濾
  if (activeCategory.value !== "all") {
    filtered = filtered.filter((pattern: any) => pattern.tags.find((tag: any) => tag === activeCategory.value));
  }

  return filtered;
});

// 方法
const addPattern = (patternId: string) => {
  designStore.addPattern(patternId);
};

const onDragStart = (pattern: any, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", pattern.id);
    event.dataTransfer.effectAllowed = "copy";
  }
};
</script>

<style scoped>
.pattern-selector-panel {
  background: #fff;
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  padding: 16px 0;
}

.pattern-card {
  cursor: pointer;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.pattern-card:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pattern-img {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pattern-info {
  text-align: center;
}

.pattern-name {
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
  color: #333;
}

@media (max-width: 768px) {
  .pattern-selector-panel {
    width: 100%;
    padding: 12px 16px 10px;
  }

  .pattern-selector-panel .design-panel-title {
    margin-bottom: 8px;
    font-size: 1.25rem;
  }

  .pattern-category-select {
    margin-bottom: 8px;
  }

  .patterns-grid {
    display: flex;
    gap: 8px;
    padding: 2px 0 6px;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scrollbar-width: thin;
    scroll-snap-type: x proximity;
  }

  .pattern-card {
    flex: 0 0 70px;
    min-height: 70px;
    padding: 5px;
    scroll-snap-align: start;
  }

  .pattern-img {
    width: 56px;
    height: 56px;
  }

  .pattern-help {
    display: none;
  }
}
</style>
