<!-- components/PlateDesigner/PlateCanvas.vue -->
<template>
  <div class="plate-canvas-container">
    <div class="design-panel-title">
      <Icon name="ic:baseline-brush" class="text-blue-500" />
      <h2>{{ $t("_designer.designArea") }}</h2>
    </div>

    <div class="canvas-wrapper">
      <div class="flex flex-col items-center">
        <!-- 盤子背景 -->
        <div
          ref="plateContainer"
          class="relative rounded-full shadow-lg mt-6 mb-8"
          :style="{
            background: currentPlate?.image ? `url(${currentPlate.image}) no-repeat center / cover` : '#ffffff',
            // backgroundColor: currentPlate?.color,
            // boxShadow: `0 10px 30px ${currentPlate?.shadowColor}`,
            width:  currentPlate?.size.width * 2 + 'px',
            height: currentPlate?.size.height * 2 + 'px',
          }"
          @click="clearSelection"
        >
          <div v-if="placedPatterns.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <i class="i-mdi-plus-circle text-6xl mb-4 opacity-30"></i>
            <p class="text-lg">點擊左側圖案添加到盤子上</p>
          </div>

          <div
            v-for="pattern in placedPatterns"
            :key="pattern.id"
            class="pattern-on-plate"
            :class="{ selected: pattern.selected }"
            :style="{
              left: pattern.x + 'px',
              top: pattern.y + 'px',
              transform: `rotate(${pattern.rotation}deg) scale(${pattern.scale})`,
              fontSize: getPatternSize(pattern.patternId) + 'px',
              width: pattern.size.width* 2 + 'px',
              height: pattern.size.height* 2 + 'px',
            }"
            @mousedown="startDrag(pattern.id, $event)"
            @click="selectPatternOnPlate(pattern.id)"
          >
            <div
              class="pattern-item"
              v-html="getPatternSvg(pattern.patternId)"
              :style="{
                width: pattern.size.width * 2 + 'px',
                height: pattern.size.height * 2 + 'px',
              }"
            />
            <div class="pattern-controls">
              <!-- <button class="control-btn rotate" @mousedown.stop="startRotate(pattern.id, $event)" @touchstart.stop="startRotate(pattern.id, $event)">
                <Icon name="ic:baseline-cached" class="text-blue-500" />
              </button> -->
              <button class="control-btn rotate" @click.stop="rotatePattern(pattern.id)">
                <Icon name="ic:baseline-cached" class="text-blue-500" />
              </button>
              <button class="control-btn delete" @click.stop="removePattern(pattern.id)">
                <Icon name="ic:baseline-close" class="text-red-500" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-3 py-4">
          <el-button type="danger" @click="designStore.resetPlate">
            <Icon name="ic:round-restart-alt" class="text-[20px] mr-1" />
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
        </div>
      </div>
    </div>

    <!-- 當前選擇資訊 -->
    <!-- <div v-if="selectedPattern" class="selected-info">
      <h4>{{ $t("selectedPattern") }}</h4>
      <div class="pattern-controls">
        <el-slider v-model="rotationValue" :min="0" :max="360" :step="1" @input="updateSelectedRotation" show-input>
          <template #prepend>{{ $t("rotation") }}</template>
        </el-slider>

        <el-slider v-model="scaleValue" :min="0.1" :max="3" :step="0.1" @input="updateSelectedScale" show-input>
          <template #prepend>{{ $t("scale") }}</template>
        </el-slider>

        <el-button type="danger" @click="deleteSelectedPattern" icon="Delete">
          {{ $t("deleteSelected") }}
        </el-button>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
// import { computed, ref, watch } from "vue";

// import { useDesignStore } from "~/stores/useDesignStore";
// import { usePlateDesignerStore } from "~/stores/useDesignStore";
import DraggableItem from "../ui/DraggableItem.vue";
// import { Delete, Check } from "@element-plus/icons-vue";

// const store = usePlateDesignerStore();
const designStore = useDesignStore();

// 計算屬性
const currentPlate = computed(() => designStore.currentPlate);
const placedPatterns = computed(() => designStore.placedPatterns);
const selectedPattern = computed(() => designStore.selectedPattern);
const patterns = computed(() => designStore.patterns);

const plateSize = computed(() => currentPlate.value?.size || { width: 300, height: 300 });

const rotationValue = ref(0);
const scaleValue = ref(1);
const backgroundColor = ref("#FFFFFF");

// 預定義顏色
const predefinedColors = ["#FFFFFF", "#F5F5DC", "#FFF8DC", "#FAEBD7", "#FFE4C4", "#DEB887", "#D2B48C"];

const clearSelection = () => {
  designStore.patterns.forEach((p) => (p.selected = false));
};

// 監聽選擇的圖案變化
watch(selectedPattern, (newPattern) => {
  if (newPattern) {
    rotationValue.value = newPattern.rotation;
    scaleValue.value = newPattern.scale;
  }
});

// watch(currentPlate, (newPlate) => {
//   if (newPlate) {
//     designStore.selectPlate(newPlate.id);
//   }
// });

// 方法
const getPatternSvg = (patternId: string) => {
  const pattern = designStore.getPatternById(patternId);
  return `<img src="${pattern?.image}" />`;
};

// 計算圖案尺寸
const getPatternSize = (patternId: string) => {
  const pattern = designStore.getPatternById(patternId);
  return pattern?.defaultSize || 50;
};

// 選擇盤子上的圖案
const selectPatternOnPlate = (patternId: string) => {
  designStore.selectPattern(patternId);
};

// 拖曳相關變數
const isDragging = ref(false);
const dragPatternId = ref(null);
const dragStart = ref({ x: 0, y: 0 });
const patternStart = ref({ x: 0, y: 0 });
// 開始拖曳圖案
const startDrag = (patternId: any, event: any) => {
  isDragging.value = true;
  dragPatternId.value = patternId;
  dragStart.value = { x: event.clientX, y: event.clientY };

  const pattern = placedPatterns.value.find((p) => p.id === patternId);
  if (pattern) {
    // patternStart.value = { ...pattern?.position };
    patternStart.value = { x: pattern.x, y: pattern.y };
    designStore.selectedPattern = pattern;
  }

  // 添加全局事件監聽器
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
};

// 處理拖曳
const handleDrag = (event: any) => {
  if (!isDragging.value || !dragPatternId.value) return;

  const deltaX = event.clientX - dragStart.value.x;
  const deltaY = event.clientY - dragStart.value.y;

  const patternIndex = placedPatterns.value.findIndex((p) => p.id === dragPatternId.value);
  if (patternIndex !== -1) {
    const newX = patternStart.value.x + deltaX;
    const newY = patternStart.value.y + deltaY;

    // 確保圖案不會超出盤子邊界
    const maxX = plateSize.value.width * 2 - getPatternSize(placedPatterns.value[patternIndex].patternId);
    const maxY = plateSize.value.height * 2 - getPatternSize(placedPatterns.value[patternIndex].patternId);

    placedPatterns.value[patternIndex].x = Math.max(0, Math.min(newX, maxX));
    placedPatterns.value[patternIndex].y = Math.max(0, Math.min(newY, maxY));
  }
};

// 停止拖曳
const stopDrag = () => {
  isDragging.value = false;
  dragPatternId.value = null;

  // 移除全局事件監聽器
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
};

// 刪除圖案
const removePattern = (id: string) => {
  designStore.removePattern(id);
};

// 旋轉圖案
// let isDragging = false
let lastAngle = 0;
let isRotating = ref(false);
const rotateStart: any = { x: 0, y: 0, startAngle: 0, rotation: 0 };
const startRotate = (patternId: string, event: any) => {
  designStore.selectPattern(patternId);

  // isDragging.value = true;
  // lastAngle = getAngle(e);
  // document.addEventListener("mousemove", onDrag);
  // document.addEventListener("mouseup", stopDrag);

  // this.selectedPatternIndex = index;
  isRotating.value = true;

  // const pattern = this.patternsOnPlate[index];
  const rect = event.target.closest(".plate-container").getBoundingClientRect();

  let clientX, clientY;

  if (event.type.includes("touch")) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  // 計算圖案中心點
  const centerX = rect.left + (designStore.selectedPattern?.x ?? 0) + (designStore.selectedPattern?.size?.width ?? 0) / 2;
  const centerY = rect.top + (designStore.selectedPattern?.y ?? 0) + (designStore.selectedPattern?.size?.height ?? 0) / 2;

  // 計算起始角度
  const startAngle = Math.atan2(clientY - centerY, clientX - centerX);

  rotateStart.value = {
    x: centerX,
    y: centerY,
    startAngle: startAngle,
    rotation: designStore.selectedPattern?.rotation ?? 0,
  };

  document.addEventListener("mousemove", doRotate);
  document.addEventListener("mouseup", stopRotate);
  document.addEventListener("touchmove", doRotate, { passive: false });
  document.addEventListener("touchend", stopRotate);

  if (event.type.includes("touch")) {
    event.preventDefault();
  }
  // const pattern = designStore.patterns[patternIndex];
  // const plateContainer = document.querySelector(".plate-container");
  // if (!plateContainer) return;

  // const rect = plateContainer.getBoundingClientRect();

  // const centerX = rect.left + pattern.x + pattern.width / 2;
  // const centerY = rect.top + pattern.y + pattern.height / 2;

  // const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);

  // rotateData.value = {
  //   patternIndex,
  //   startRotation: pattern.rotation,
  //   centerX,
  //   centerY,
  //   startAngle,
  // };

  // document.addEventListener("mousemove", doRotate);
  // document.addEventListener("mouseup", stopRotate);
};

const doRotate = (event: any) => {
  // if (!rotateData.value) return;

  // const start = rotateData.value;
  const currentAngle = Math.atan2(event.clientY - rotateStart.centerY, event.clientX - rotateStart.x);

  const angleDiff = (currentAngle - rotateStart.startAngle) * (180 / Math.PI);

  let newRotation = (rotateStart.rotation + angleDiff) % 360;
  if (newRotation < 0) newRotation += 360;

  designStore.updatePatternRotation(rotateStart.patternId, newRotation);
};

const stopRotate = () => {
  rotateStart.value = null;
  document.removeEventListener("mousemove", doRotate);
  document.removeEventListener("mouseup", stopRotate);
};

// 取得相對於圖案中心的角度
// const getAngle = (event: any) => {
//   // const rect = event.target.closest('.rotator-container').getBoundingClientRect()
//   const rect = event.target.querySelector(".plate-container").getBoundingClientRect();
//   const centerX = rect.left + rect.width / 2;
//   const centerY = rect.top + rect.height / 2;
//   const dx = event.clientX - centerX;
//   const dy = event.clientY - centerY;
//   return Math.atan2(dy, dx) * (180 / Math.PI);
// };

const rotatePattern = (patternId: string) => {
  const patternIndex = placedPatterns.value.findIndex((p) => p.id === patternId);
  if (patternIndex !== -1) {
    placedPatterns.value[patternIndex].rotation += 45;
    if (placedPatterns.value[patternIndex].rotation >= 360) {
      placedPatterns.value[patternIndex].rotation = 0;
    }
  }
};

const updatePatternPosition = (patternId: string, x: number, y: number) => {
  designStore.updatePatternPosition(patternId, x, y);
};

const updatePatternRotation = (patternId: string, rotation: number) => {
  designStore.updatePatternRotation(patternId, rotation);
};

const updatePatternScale = (patternId: string, scale: number) => {
  designStore.updatePatternScale(patternId, scale);
};

const selectPattern = (patternId: string) => {
  designStore.selectPattern(patternId);
};

// const deletePattern = (patternId: string) => {
//   designStore.removePattern(patternId);
// };

const deleteSelectedPattern = () => {
  if (selectedPattern.value) {
    designStore.removePattern(selectedPattern.value.id);
  }
};

const updateSelectedRotation = (value: number) => {
  if (selectedPattern.value) {
    designStore.updatePatternRotation(selectedPattern.value.id, value);
  }
};

const updateSelectedScale = (value: number) => {
  if (selectedPattern.value) {
    designStore.updatePatternScale(selectedPattern.value.id, value);
  }
};

const updateBackground = (color: string | null) => {
  if (color) {
    designStore.setBackgroundColor(color);
  }
};

const clearAll = () => {
  designStore.clearAllPatterns();
};

const deselectAll = () => {
  designStore.selectPattern("");
};

const saveDesign = () => {
  const design = designStore.saveDesign();
  ElMessage.success("設計已保存！");
};

// 初始化
// designStore.loadPlates();
// designStore.loadPatterns();
</script>

<style scoped>
.plate-canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* .panel-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
  display: flex;
  align-items: center;
  gap: 10px;
} */

.canvas-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

.plate-container {
  /* width: 400px;
  height: 400px; */
  position: relative;
  margin-bottom: 20px;
}

.plate-background {
  position: relative;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.pattern-item {
  pointer-events: none;
}

.pattern-item :deep(svg) {
  width: 100%;
  height: 100%;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.selected-info {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.pattern-on-plate {
  position: absolute;
  cursor: move;
  user-select: none;
  transition: transform 0.2s ease;
  z-index: 10;
}

.pattern-on-plate.selected {
  outline: 2px dashed #3498db;
  outline-offset: 5px;
}

.pattern-controls {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  /* background: white; */
  padding: 8px 15px;
  border-radius: 25px;
  /* box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); */
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pattern-on-plate.selected .pattern-controls {
  opacity: 1;
}

/* .pattern-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
} */

/* 設計按鈕 */
.control-btn {
  /* width: 30px;
  height: 30px; */
  border-radius: 50%;
  border: none;
  /* background: #3498db; */
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: all 0.3s ease;
}

.control-btn:hover {
  /* background: #2980b9; */
  transform: scale(1.8);
}

.control-btn.delete {
  /* background: #e74c3c; */
}

.control-btn.delete:hover {
  /* background: #c0392b; */
}

.control-btn.rotate {
  /* background: #2ecc71; */
}

.control-btn.rotate:hover {
  /* background: #27ae60; */
  cursor: pointer;
}

@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }

  .plate-container {
    width: 350px;
    height: 350px;
  }
}

@media (max-width: 768px) {
  .plate-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .pattern-options {
    grid-template-columns: repeat(3, 1fr);
  }

  .plate-container {
    width: 300px;
    height: 300px;
  }

  .preview-plate {
    width: 200px;
    height: 200px;
  }
}
</style>
