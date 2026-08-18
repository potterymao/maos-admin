<template>
  <div v-if="isMobile" class="mobile-designer">
    <main class="mobile-designer-content">
      <header class="mobile-intro">
        <h1>{{ $t("_designer.designer_title") }}</h1>
        <p>{{ $t("_designer.designer_title_desc") }}</p>
      </header>

      <section class="mobile-canvas-section" aria-label="設計區域">
        <PlateCanvas />
      </section>

      <nav class="mobile-tool-tabs" aria-label="設計工具">
        <button
          v-for="tool in mobileTools"
          :key="tool.key"
          type="button"
          :class="{ active: mobileTool === tool.key }"
          :aria-selected="mobileTool === tool.key"
          role="tab"
          @click="mobileTool = tool.key"
        >
          <Icon :name="tool.icon" />
          <span>{{ tool.label }}</span>
        </button>
      </nav>

      <section class="mobile-tool-panel" role="tabpanel">
        <PlateSelector v-show="mobileTool === 'vessel'" />
        <PatternSelector v-show="mobileTool === 'pattern'" />
        <PatternEditor v-show="mobileTool === 'adjust'" />
      </section>

      <DesignPreview v-if="designStore.showPreview" />
    </main>
  </div>

  <div v-else class="desktop-designer">
    <div class="designer-intro container mx-auto p-8 space-y-6">
      <header class="text-center mb-4">
        <h1 class="text-3xl md:text-5xl m-2">{{ $t("_designer.designer_title") }}</h1>
        <p class="text-xl text-gray-600">{{ $t("_designer.designer_title_desc") }}</p>
      </header>
    </div>

    <div class="designer-content p-4 md:p-6">
      <div class="flex flex-col lg:flex-row gap-6 mb-8">
        <div class="lg:w-4/5 space-y-6">
          <PlateSelector />
        </div>
        <div class="lg:w-1/5" />
      </div>

      <div class="flex flex-col lg:flex-row gap-6 mb-8">
        <div class="lg:w-1/5 space-y-6"><PatternSelector /></div>
        <div class="lg:w-3/5 space-y-6"><PlateCanvas /></div>
        <div class="lg:w-1/5"><PatternEditor /></div>
      </div>

      <DesignPreview v-if="designStore.showPreview" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDesignStore } from "~/stores/useDesignStore";

definePageMeta({
  hideMobileChrome: true,
});

// const { startDrag, startResize, startRotate } = usePlateDesigner();

const designStore = useDesignStore();
const { isMobile } = useDevice();
type MobileTool = "vessel" | "pattern" | "adjust";
const mobileTool = ref<MobileTool>("vessel");
const mobileTools: Array<{ key: MobileTool; label: string; icon: string }> = [
  { key: "vessel", label: "器皿", icon: "material-symbols:dinner-dining-rounded" },
  { key: "pattern", label: "花紙", icon: "material-symbols:category-rounded" },
  { key: "adjust", label: "調整", icon: "material-symbols:tune-rounded" },
];

_setToken('');
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
  .mobile-designer {
    min-height: 100dvh;
    background: #ffea75;
  }

  .mobile-designer-content {
    padding: 12px;
  }

  .mobile-intro {
    padding: 18px 12px 20px;
    color: #26364a;
    text-align: center;
  }

  .mobile-intro h1 {
    margin: 0 0 6px;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .mobile-intro p {
    margin: 0;
    color: #596273;
    font-size: 0.95rem;
    line-height: 1.45;
  }

  .mobile-canvas-section,
  .mobile-tool-panel {
    overflow: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
  }

  .mobile-canvas-section :deep(.panel),
  .mobile-tool-panel :deep(.panel) {
    padding: 14px 12px;
  }

  .mobile-tool-tabs {
    position: sticky;
    top: 0;
    z-index: 35;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3px;
    margin: 12px 0 8px;
    padding: 3px;
    border: 1px solid #d9dde5;
    border-radius: 8px;
    background: #f3f5f8;
  }

  .mobile-tool-tabs button {
    display: flex;
    min-width: 0;
    min-height: 48px;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 0;
    border-radius: 6px;
    color: #596273;
    background: transparent;
    font-size: 15px;
    font-weight: 700;
  }

  .mobile-tool-tabs button.active {
    color: #1d4ed8;
    background: #fff;
    box-shadow: 0 1px 4px rgb(15 23 42 / 14%);
  }

  .mobile-tool-tabs button :deep(svg) {
    width: 21px;
    height: 21px;
  }

  .mobile-tool-panel {
    min-height: 180px;
  }
}
</style>
