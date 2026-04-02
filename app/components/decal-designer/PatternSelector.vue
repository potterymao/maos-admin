<template>
  <div class="panel">
    <h2 class="design-panel-title">
      <Icon name="material-symbols:category-rounded" class="text-blue-500 text-[28px]" />
      {{ $t('_designer.selectPattern')}}
    </h2>

    <USelectMenu v-model="activeCategory" :items="categories" value-key="key" class="w-full mb-4" />

    <div class="patterns-grid">
      <div v-for="pattern in filteredPatterns" :key="pattern.id" class="pattern-card" @click="addPattern(pattern.id)" @dragstart="onDragStart(pattern, $event)" draggable="true">
        <!-- <div class="pattern-thumbnail" v-html="pattern.svg" /> -->
         <div class="pattern-img">
          <img :src="pattern.image" :alt="pattern.name" class="w-full h-full object-contain" />
         </div>
        <!-- <img :src="pattern.image" :alt="pattern.name" class="pattern-img" /> -->
        <div class="pattern-info">
          <span class="pattern-name">{{ appStore.locale === "zh-TW" ? pattern.name_zh : pattern.name_en }}</span>
          <!-- <el-tag size="small">{{ $t(pattern.category) }}</el-tag> -->
        </div>
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

    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
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
import type { SelectMenuItem } from "@nuxt/ui";
// import { GetPatterns } from "@/api"
const appStore = useAppStore();
const designStore = useDesignStore();

designStore.loadPatterns();

// 分類選項
const categories = ref<SelectMenuItem[]>([
  { key: "all", label: $t("patterns.all") },
  { key: "flower", label: $t("patterns.flowers") },
  { key: "animal", label: $t("patterns.animals") },
  { key: "geometric", label: $t("patterns.geometrics") },
]);
const activeCategory = ref("all");

// 計算屬性
const patterns = computed(() => designStore.patterns);
const placedPatterns = computed(() => designStore.placedPatterns);

// 過濾圖案
const filteredPatterns = computed(() => {
  let filtered = [...patterns.value];

  // 分類過濾
  if (activeCategory.value !== "all") {
    filtered = filtered.filter((pattern) => pattern.category === activeCategory.value);
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


// const getPatterns = async () => {
//   const response = await GetPatterns();
//   console.log("Fetched patterns:", response);
//   // return response;
// };
// getPatterns();
</script>

<style scoped>
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
</style>
