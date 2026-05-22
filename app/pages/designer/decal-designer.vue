<template>
  <div class="container  mx-auto p-8 space-y-6">
    <!-- 標題 -->
    <header class="text-center mb-4">
      <h1 class="text-3xl md:text-5xl  m-2">
        <!-- <i class="i-mdi-palette mr-2"></i> -->
        {{ $t("_designer.designer_title") }}
      </h1>
      <p class="text-xl text-gray-600 ">
      {{ $t("_designer.designer_title_desc") }}
      </p>
    </header>
  </div>

  <div class="p-4 md:p-6">
    <div class="flex flex-col lg:flex-row gap-6 mb-8">
      <!-- 左側：盤子和圖案選擇 -->
      <!-- <div class="lg:w-1/5 space-y-6">
        <PatternSelector />
      </div> -->

      <!-- 中間：設計區域 -->
      <div class="lg:w-4/5 space-y-6">
        <PlateSelector />
        <!-- <PlateCanvas /> -->
      </div>

      <!-- 右側：圖案控制 -->
      <div class="lg:w-1/5">
        <!-- <PatternEditor /> -->
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 mb-8">
      <!-- 左側：盤子和圖案選擇 -->
      <div class="lg:w-1/5 space-y-6">
        <PatternSelector />
      </div>

      <!-- 中間：設計區域 -->
      <div class="lg:w-3/5 space-y-6">
        <PlateCanvas />
      </div>

      <!-- 右側：圖案控制 -->
      <div class="lg:w-1/5">
        <PatternEditor />
      </div>
    </div>

    <!-- 預覽區域 -->
    <DesignPreview v-if="designStore.showPreview" />
  </div>
</template>

<script setup lang="ts">
import { useDesignStore } from "~/stores/useDesignStore";

// const { startDrag, startResize, startRotate } = usePlateDesigner();

const designStore = useDesignStore();
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
