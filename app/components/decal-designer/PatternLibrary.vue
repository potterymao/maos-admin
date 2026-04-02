<!-- components/PlateDesigner/PatternLibrary.vue -->
<template>
  <div class="pattern-library">
    <div class="library-header">
      <h3>{{ $t("patternLibrary") }}</h3>
      <el-input v-model="searchQuery" :placeholder="$t('searchPatterns')" clearable style="width: 200px" />
    </div>

    <el-tabs v-model="activeCategory" class="pattern-categories">
      <el-tab-pane v-for="category in categories" :key="category.key" :label="$t(category.label)" :name="category.key">
        <div class="patterns-grid">
          <div
            v-for="pattern in filteredPatterns"
            :key="pattern.id"
            class="pattern-card"
            @click="addPattern(pattern.id)"
            @dragstart="onDragStart(pattern, $event)"
            draggable="true"
          >
            <div class="pattern-thumbnail" v-html="pattern.svg" />
            <div class="pattern-info">
              <span class="pattern-name">{{ pattern.name }}</span>
              <el-tag size="small">{{ $t(pattern.category) }}</el-tag>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 最近使用的圖案 -->
    <div v-if="recentPatterns.length > 0" class="recent-patterns">
      <h4>{{ $t("recentPatterns") }}</h4>
      <div class="recent-grid">
        <div v-for="pattern in recentPatterns" :key="pattern.id" class="recent-pattern" @click="addPattern(pattern.id)">
          <div class="recent-thumbnail" v-html="pattern.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { usePlateDesignerStore } from "~/stores/useDesignStore";

const store = usePlateDesignerStore();
const searchQuery = ref("");
const activeCategory = ref("all");

// 分類選項
const categories = [
  { key: "all", label: "allPatterns" },
  { key: "flower", label: "flowers" },
  { key: "animal", label: "animals" },
  { key: "geometric", label: "geometrics" },
  { key: "text", label: "texts" },
  { key: "custom", label: "custom" },
];

// 計算屬性
const patterns = computed(() => store.patterns);
const placedPatterns = computed(() => store.placedPatterns);

// 過濾圖案
const filteredPatterns = computed(() => {
  let filtered = [...patterns.value];

  // 搜尋過濾
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((pattern) => pattern.name.toLowerCase().includes(query) || pattern.category.toLowerCase().includes(query));
  }

  // 分類過濾
  if (activeCategory.value !== "all") {
    filtered = filtered.filter((pattern) => pattern.category === activeCategory.value);
  }

  return filtered;
});

// 最近使用的圖案
const recentPatterns = computed(() => {
  const recentIds = [...new Set(placedPatterns.value.map((p) => p.patternId))];
  return recentIds
    .map((id) => store.getPatternById(id))
    .filter(Boolean)
    .slice(0, 5);
});

// 方法
const addPattern = (patternId: string) => {
  store.addPattern(patternId);
};

const onDragStart = (pattern: any, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", pattern.id);
    event.dataTransfer.effectAllowed = "copy";
  }
};
</script>

<style scoped>
.pattern-library {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.pattern-thumbnail {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pattern-thumbnail :deep(svg) {
  width: 100%;
  height: 100%;
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

.recent-patterns {
  border-top: 1px solid #e8e8e8;
  padding-top: 16px;
}

.recent-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.recent-pattern {
  cursor: pointer;
  width: 48px;
  height: 48px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 4px;
  transition: border-color 0.3s;
}

.recent-pattern:hover {
  border-color: #409eff;
}

.recent-thumbnail {
  width: 100%;
  height: 100%;
}
</style>
