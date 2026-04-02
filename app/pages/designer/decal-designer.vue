<template>
  <div class="container  mx-auto p-8 space-y-6">
    <!-- 標題 -->
    <header class="text-center mb-4">
      <h1 class="text-3xl font-bold md:text-4xl text-gray-800 mb-2">
        <i class="i-mdi-palette text-blue-500 mr-2"></i>
        盤子設計器
      </h1>
      <p class="text-gray-600">選擇盤子並添加圖案來設計您的專屬盤子！</p>
    </header>
  </div>

  <div class="p-4 md:p-6">
    <div class="flex flex-col lg:flex-row gap-6 mb-8">
      <!-- 左側：盤子和圖案選擇 -->
      <div class="lg:w-1/5 space-y-6">
        <!-- <PlateSelector /> -->
        <PatternSelector />
      </div>

      <!-- 中間：設計區域 -->
      <div class="panel lg:w-3/5">
        <PlateSelector />
        <PlateCanvas class="mt-6" />
        <!-- <div class="panel">
          <div class="flex flex-col items-center"> -->
        <!-- 盤子容器 -->
        <!-- <div
              ref="plateContainer"
              class="relative w-96 h-96 rounded-full shadow-lg mb-6 overflow-hidden"
              :style="{
                backgroundColor: designStore.selectedPlate.color,
                boxShadow: `0 10px 30px ${designStore.selectedPlate.shadowColor}`,
              }"
              @click="clearSelection"
            > -->
        <!-- 圖案元素 -->
        <!-- <PatternElement
                v-for="(pattern, index) in designStore.patterns"
                :key="pattern.id"
                :pattern="pattern"
                :index="index"
                @select="handleSelectPattern"
                @remove="handleRemovePattern"
                @start-resize="handleStartResize"
                @start-rotate="handleStartRotate"
              /> -->

        <!-- 空白狀態 -->
        <!-- <div v-if="designStore.patterns.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <i class="i-mdi-plus-circle text-6xl mb-4 opacity-30"></i>
                <p class="text-lg">點擊左側圖案添加到盤子上</p>
              </div> -->
        <!-- </div> -->

        <!-- 操作按鈕 -->
        <!-- <div class="flex gap-3">
              <el-button type="danger" @click="designStore.resetPlate">
                <i class="i-mdi-refresh mr-1"></i>
                重置盤子
              </el-button>
              <el-button type="primary" @click="designStore.finishDesign">
                <i class="i-mdi-eye mr-1"></i>
                預覽設計
              </el-button>
              <el-button @click="designStore.exportDesign">
                <i class="i-mdi-export mr-1"></i>
                匯出設計
              </el-button>
            </div> -->
        <!-- </div>
        </div> -->
      </div>

      <!-- 右側：圖案控制 -->
      <div class="sidebar lg:w-1/5">
        <PatternEditor />
      </div>
    </div>

    <!-- 預覽區域 -->
    <DesignPreview v-if="designStore.showPreview" />
  </div>

  <!-- <div class="plate-designer-page">
    <div class="page-header">
      <h1>{{ $t("plateDesigner") }}</h1>
      <p>{{ $t("pageDescription") }}</p>
    </div>

    <div class="main-content"> -->
      <!-- 左側 - 盤子選擇 -->
      <!-- <div class="sidebar left-sidebar"> -->
        <!-- <div class="section">
          <h3>{{ $t("selectPlate") }}</h3>
          <div class="plates-grid">
            <div v-for="plate in plates" :key="plate.id" class="plate-card" :class="{ active: plate.id === currentPlate?.id }" @click="selectPlate(plate.id)">
              <div class="plate-image-wrapper">
                <i :class="plate.icon" :style="{ color: plate.iconColor, fontSize: '2rem' }"></i>
              </div>
              <div class="plate-info">
                <h4>{{ plate.name }}</h4>
                <p>{{ $t("size") }}: {{ plate.size.width }} × {{ plate.size.height }}mm</p>
                <p>{{ $t("price") }}: ${{ plate.price }}</p>
              </div>
            </div>
          </div>
        </div> -->

        <!-- 圖案庫 -->
        <!-- <div class="section">
          <PatternLibrary />
        </div> -->
      <!-- </div> -->

      <!-- 中間 - 設計畫布 -->
      <!-- <div class="design-area">
        <PlateCanvas />
      </div> -->

      <!-- 右側 - 控制面板 -->
      <!-- <div class="sidebar right-sidebar"> -->
        <!-- <div class="section">
          <h3>{{ $t("designInfo") }}</h3>
          <div class="info-card">
            <div class="info-item">
              <span class="label">{{ $t("selectedPlate") }}:</span>
              <span class="value">{{ currentPlate?.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ $t("patternCount") }}:</span>
              <span class="value">{{ totalPatternsCount }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ $t("totalPrice") }}:</span>
              <span class="value price">${{ designPrice }}</span>
            </div>
          </div>
        </div> -->

        <!-- 設計工具 -->
        <!-- <div class="section">
          <h3>{{ $t("designTools") }}</h3>
          <div class="tools-grid">
            <el-button @click="undo" icon="Back" :disabled="!canUndo">
              {{ $t("undo") }}
            </el-button>
            <el-button @click="redo" icon="Right" :disabled="!canRedo">
              {{ $t("redo") }}
            </el-button>
            <el-button @click="resetDesign" icon="Refresh">
              {{ $t("reset") }}
            </el-button>
            <el-button type="primary" @click="preview" icon="View">
              {{ $t("preview") }}
            </el-button>
            <el-button type="success" @click="exportDesign" icon="Download">
              {{ $t("export") }}
            </el-button>
          </div>
        </div> -->

        <!-- 設計歷史 -->
        <!-- <div class="section">
          <h3>{{ $t("designHistory") }}</h3>
          <div class="history-list">
            <div v-for="design in designHistory" :key="design.createdAt.getTime()" class="history-item" @click="loadDesign(design)">
              <div class="history-preview">
                <div class="mini-plate">
                  <span>{{ design.patterns.length }} {{ $t("patterns") }}</span>
                </div>
              </div>
              <div class="history-info">
                <span class="date">{{ formatDate(design.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div> -->
      <!-- </div> -->
    <!-- </div> -->

    <!-- 預覽彈窗 -->
    <!-- <PreviewModal v-model:visible="showPreview" :design="currentDesign" /> -->
  <!-- </div> -->
</template>

<script setup lang="ts">
// import { usePlateDesigner } from "~/composables/usePlateDesigner";
import { useDesignStore } from "~/stores/useDesignStore";

const { startDrag, startResize, startRotate } = usePlateDesigner();

const designStore = useDesignStore();
// const plateContainer = ref<HTMLElement>();

// const clearSelection = () => {
//   designStore.patterns.forEach((p) => (p.selected = false));
// };

// const handleSelectPattern = (index: number) => {
//   designStore.selectPattern(index);
// };

// const handleRemovePattern = (index: number) => {
//   designStore.removePattern(index);
// };

// const handleStartResize = (event: MouseEvent | TouchEvent, direction: string) => {
//   if (designStore.selectedPatternIndex !== null) {
//     if ("touches" in event) {
//       // 處理觸摸事件
//       const touchEvent = event as TouchEvent;
//       const mouseEvent = new MouseEvent("mousedown", {
//         clientX: touchEvent.touches[0].clientX,
//         clientY: touchEvent.touches[0].clientY,
//       });
//       startResize(designStore.selectedPatternIndex, mouseEvent, direction);
//     } else {
//       startResize(designStore.selectedPatternIndex, event as MouseEvent, direction);
//     }
//   }
// };

// const handleStartRotate = (event: MouseEvent | TouchEvent) => {
//   if (designStore.selectedPatternIndex !== null) {
//     if ("touches" in event) {
//       const touchEvent = event as TouchEvent;
//       const mouseEvent = new MouseEvent("mousedown", {
//         clientX: touchEvent.touches[0].clientX,
//         clientY: touchEvent.touches[0].clientY,
//       });
//       startRotate(designStore.selectedPatternIndex, mouseEvent);
//     } else {
//       startRotate(designStore.selectedPatternIndex, event as MouseEvent);
//     }
//   }
// };

// import { computed, ref } from "vue";
// import { usePlateDesignerStore } from "~/stores/useDesignStore";
// import PlateCanvas from "~/components/decal-designer/PlateCanvas.vue";
// import PatternLibrary from "~/components/decal-designer/PatternLibrary.vue";
// // import PreviewModal from "~/components/decal-designer/PreviewModal.vue";
// import { Back, Right, Refresh, View, Download } from "@element-plus/icons-vue";

// const store = usePlateDesignerStore();

// // 計算屬性
// const plates = computed(() => store.plates);
// const currentPlate = computed(() => store.currentPlate);
// const totalPatternsCount = computed(() => store.totalPatternsCount);
// const designPrice = computed(() => store.designPrice);
// const designHistory = computed(() => store.designHistory.slice(0, 5));

// // const currentDesign = computed(() => ({
// //   plate: currentPlate.value,
// //   patterns: store.placedPatterns,
// //   backgroundColor: store.backgroundColor,
// // }));

// // 狀態
// const showPreview = ref(false);
// const canUndo = ref(false);
// const canRedo = ref(false);

// // 方法
// const selectPlate = (plateId: string) => {
//   store.selectPlate(plateId);
// };

// const undo = () => {
//   // 實現撤銷邏輯
// };

// const redo = () => {
//   // 實現重做邏輯
// };

// const resetDesign = () => {
//   store.clearAllPatterns();
//   ElMessage.info("設計已重置");
// };

// const preview = () => {
//   store.togglePreviewMode();
//   showPreview.value = true;
// };

// const exportDesign = () => {
//   // 實現導出邏輯
//   ElMessage.success("正在導出設計...");
// };

// const loadDesign = (design: any) => {
//   // 實現加載設計邏輯
// };

// const formatDate = (date: Date) => {
//   return date.toLocaleDateString();
// };
</script>

<style scoped>
.plate-designer-page {
  /* min-height: 100vh; */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.page-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.page-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main-content {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

/* .sidebar {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
} */

.section {
  margin-bottom: 30px;
}

.section h3 {
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #667eea;
}

.plates-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* .plate-card {
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.plate-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.plate-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea11 0%, #764ba211 100%);
}

.plate-image-wrapper {
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.plate-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plate-info h4 {
  margin: 0 0 4px 0;
  color: #333;
}

.plate-info p {
  margin: 2px 0;
  font-size: 12px;
  color: #666;
} */

.panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* .info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none; 
}*/

/* .label {
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

.value.price {
  color: #52c41a;
  font-weight: bold;
  font-size: 1.2rem;
} */

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.tools-grid .el-button {
  width: 100%;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.history-item:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.mini-plate {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.history-info {
  flex: 1;
}

.date {
  color: #666;
  font-size: 12px;
}

@media (max-width: 768px) {
  .designer-main {
    grid-template-columns: 1fr;
  }

  .left-sidebar {
    position: fixed;
    top: 64px;
    left: 0;
    bottom: 56px;
    width: 280px;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .left-sidebar.show {
    transform: translateX(0);
  }

  .header-right {
    display: none;
  }
}
</style>
