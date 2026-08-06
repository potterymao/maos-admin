<!-- components/PlateDesigner/PlateCanvas.vue -->
<template>
  <div class="panel plate-canvas-container">
    <div class="design-panel-title">
      <Icon name="ic:baseline-brush" class="text-blue-500" />
      <h2>{{ $t("_designer.designArea") }}</h2>
    </div>

    <div class="canvas-wrapper">
      <div class=" flex flex-col items-center">
        <!-- 盤子背景 -->
        <div ref="plateContainerRef" class="plate-container relative" :class="{ 'flipped': designStore.isFlipped }"
          :style="{
            background: currentPlate?.image
              ? `url(${currentPlate.image}) no-repeat center / contain`
              : '#ffffff',
            width: currentPlate ? `${Number(currentPlate.size.width) * DESIGN_SCALE}px` : '0',
            height: currentPlate ? `${Number(currentPlate.size.height) * DESIGN_SCALE}px` : '0',
            padding: '0',

          }" @click="clearSelection">
          <!-- <div v-if="placedPatterns.length === 0"
            class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <i class="i-mdi-plus-circle text-6xl mb-4 opacity-30"></i>
            <p class="text-lg">點擊左側圖案添加到盤子上</p>
          </div> -->
          <div :class="{ 'pattern-back': designStore.isFlipped }">

            <div v-for="pattern in placedPatterns" :key="pattern.id" class="pattern-on-plate"
              :class="{ selected: pattern.selected }" :style="{
                left: pattern.x * DESIGN_SCALE + 'px',
                top: pattern.y * DESIGN_SCALE + 'px',
                transform: `rotate(${pattern.rotation}deg)`,
                width: pattern.size.width * DESIGN_SCALE + 'px',
                height: pattern.size.height * DESIGN_SCALE + 'px',
                fontSize: getPatternSize(pattern.patternId) + 'px',
              }" @mousedown="startDrag(pattern.id, $event)" @touchstart.stop="startDrag(pattern.id, $event)">
              <div class="pattern-item" v-html="getPatternSvg(pattern.patternId)" :style="{
                width: '100%',
                height: '100%',
              }" />

              <div class="pattern-controls">
                <button class="rotate-handle" @mousedown.stop="startRotate(pattern.id, $event)" @touchstart.stop="startRotate(pattern.id, $event)">
                  <Icon name="ic:baseline-cached" class="text-blue-500" />
                </button>
                <button class="delete-btn" @click.stop="removePattern(pattern.id)">
                  <Icon name="ic:baseline-close" class="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4 pb-2">
          <el-button type="danger" @click="resetDesign">
            <Icon name="ic:round-restart-alt" class="text-[20px] mr-1" />
            重新設計
          </el-button>
          <el-button type="primary" @click="previewDesign">
            <i class="i-mdi-eye mr-1"></i>
            預覽設計
          </el-button>
          <!-- <el-button @click="designStore.exportDesign">
            <i class="i-mdi-export mr-1"></i>
            匯出設計
          </el-button> -->
        </div>
        <p v-if="boundaryError" class="boundary-error">已超出器皿範圍喔!</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const designStore = useDesignStore();
const DESIGN_SCALE = 4;

// 計算屬性
const currentPlate = computed(() => designStore.currentPlate);
const placedPatterns = computed(() => designStore.placedPatterns || []);
const selectedPattern = computed(() => designStore.selectedPattern);
const boundaryError = ref(false);

type Point = { x: number; y: number };

const pointInPolygon = (point: Point, polygon: Point[]) => {
  let inside = false;
  for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current, current += 1) {
    const a = polygon[current];
    const b = polygon[previous];
    const intersects = ((a.y > point.y) !== (b.y > point.y))
      && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
};

const isPointInsidePlate = (point: Point, plate: any) => {
  const width = Number(plate?.size?.width || 0);
  const height = Number(plate?.size?.height || width);
  if (!width || !height) return false;

  const mainPlateId = String(designStore.currentMainPlate?.id || "");
  if (mainPlateId === "69f2f7eaf29a57c710185414") {
    const houseOutline = [
      { x: width * 0.47, y: 0 },
      { x: width * 0.53, y: 0 },
      { x: width, y: height * 0.40 },
      { x: width, y: height },
      { x: 0, y: height },
      { x: 0, y: height * 0.40 },
    ];
    return pointInPolygon(point, houseOutline);
  }

  const normalizedX = (point.x - width / 2) / (width / 2);
  const normalizedY = (point.y - height / 2) / (height / 2);
  return normalizedX ** 2 + normalizedY ** 2 <= 0.98 ** 2;
};

const isPatternInsidePlate = (pattern: any, plate: any) => {
  const width = Number(pattern.size?.width || 0);
  const height = Number(pattern.size?.height || 0);
  const centerX = Number(pattern.x || 0) + width / 2;
  const centerY = Number(pattern.y || 0) + height / 2;
  const angle = Number(pattern.rotation || 0) * Math.PI / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const samples: Point[] = [];

  for (let step = 0; step <= 8; step += 1) {
    const ratio = step / 8;
    samples.push(
      { x: -width / 2 + width * ratio, y: -height / 2 },
      { x: -width / 2 + width * ratio, y: height / 2 },
      { x: -width / 2, y: -height / 2 + height * ratio },
      { x: width / 2, y: -height / 2 + height * ratio },
    );
  }

  return samples.every((sample) => isPointInsidePlate({
    x: centerX + sample.x * cos - sample.y * sin,
    y: centerY + sample.x * sin + sample.y * cos,
  }, plate));
};

const hasOutOfBoundsPattern = () => {
  const surfaces = designStore.currentMainPlate?.children || [];
  return (designStore.totalPatterns || []).some((patterns: any[], index: number) => {
    const plate = surfaces[index] || designStore.currentPlate;
    return (patterns || []).some((pattern) => !isPatternInsidePlate(pattern, plate));
  });
};

const previewDesign = () => {
  boundaryError.value = hasOutOfBoundsPattern();
  if (boundaryError.value) {
    designStore.showPreview = false;
    return;
  }
  designStore.finishDesign();
};

const resetDesign = () => {
  boundaryError.value = false;
  designStore.resetPlate();
};

const clearSelection = () => {
  designStore.patterns.forEach((p) => (p.selected = false));
};

// 建立圖片元素的 SVG 內容
const getPatternSvg = (patternId: string) => {
  const pattern = designStore.getPatternById(patternId);
  return `<img src="${pattern?.image}" />`;
};

// 計算圖案尺寸
const getPatternSize = (patternId: string) => {
  const pattern = designStore.getPatternById(patternId);
  return pattern?.defaultSize || 100;
};


const plateContainerRef = ref<HTMLElement | null>(null);
// 拖曳相關變數
let isDragging = false;
let dragTargetId: string | null = null;
let dragStartX = 0, dragStartY = 0;
let originalLeft = 0, originalTop = 0;

// 取得事件坐標的輔助函式（相容滑鼠與平板觸控）
const getEventClientXY = (e: any) => {
  if (e.touches && e.touches.length > 0) {
    return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
  }
  return { clientX: e.clientX, clientY: e.clientY };
};

// 取容器尺寸 
const getContainerRect = () => {
  if (!plateContainerRef.value) return;
  const rect = plateContainerRef.value.getBoundingClientRect();
  return rect;
};

// 更新圖案位置
const updatePatternPosition = (id: any, newLeft: number, newTop: number) => {
  // const pattern = patterns.value.find(p => p.id === id);
  if (!selectedPattern.value) return;
  const maxLeft = Math.max(0, Number(currentPlate.value?.size?.width || 0) - Number(selectedPattern.value.size.width));
  const maxTop = Math.max(0, Number(currentPlate.value?.size?.height || 0) - Number(selectedPattern.value.size.height));
  selectedPattern.value.x = Math.min(Math.max(0, newLeft), maxLeft);
  selectedPattern.value.y = Math.min(Math.max(0, newTop), maxTop);
};

// 更新图案角度
const updatePatternAngle = (id: any, newAngleDeg: any) => {
  // const pattern = patterns.value.find(p => p.id === id);
  if (!selectedPattern.value) return;
  // 确保角度在 0~360 范围，但不影响体验
  selectedPattern.value.rotation = Number(((((newAngleDeg % 360) + 360) % 360).toFixed(2)));
};

// 获取图案中心点在屏幕上的坐标（相对于浏览器视口）
const getPatternScreenCenter = (pattern: any) => {
  if (!plateContainerRef.value) return null;
  const containerRect = getContainerRect();
  if (!containerRect) return;
  // 图案在容器内的绝对坐标 left, top (未旋转时的位置)
  const absLeft = containerRect.left + pattern.x * DESIGN_SCALE;
  const absTop = containerRect.top + pattern.y * DESIGN_SCALE;
  const centerX = absLeft + pattern.size.width * DESIGN_SCALE / 2;
  const centerY = absTop + pattern.size.height * DESIGN_SCALE / 2;
  return { x: centerX, y: centerY };
};

// 開始拖曳圖案
const startDrag = (patternId: any, event: any) => {
  designStore.selectPattern(patternId);
  if (!selectedPattern.value) return;

  if (event.target.classList && (event.target.classList.contains('delete-btn') || event.target.classList.contains('rotate-handle'))) return;

  const { clientX, clientY } = getEventClientXY(event);

  dragTargetId = patternId;
  dragStartX = clientX;
  dragStartY = clientY;
  originalLeft = selectedPattern.value.x;
  originalTop = selectedPattern.value.y;
  isDragging = true;
  document.body.style.cursor = 'grabbing';
  
  // 阻止預設行為（例如平板上拖曳會導致整個網頁被拉動滾動）
  if (event.cancelable) event.preventDefault();
};


let rotatingId: string | null = null;
let startAngleRad = 0;     // 初始鼠标相对于中心点的弧度
let initialPatternAngle = 0; // 图案初始角度（度）
let isRotating = false;
let centerX = 0, centerY = 0; // 图案中心点的屏幕坐标（在旋转开始时记录）

// 旋转开始 (记录鼠标相对于图案中心点的角度)
const startRotate = (patternId: string, event: any) => {
  designStore.selectPattern(patternId);

  if (!selectedPattern.value) return;
  const center = getPatternScreenCenter(selectedPattern.value);
  if (!center) return;

  const { clientX, clientY } = getEventClientXY(event);

  const dx = clientX - center.x;
  const dy = clientY - center.y;
  let angleRad = Math.atan2(dy, dx);  // 范围 -PI 到 PI

  rotatingId = patternId;
  startAngleRad = angleRad;

  // initialPatternAngle = selectedPattern.value.angle;
  // 修正：原代碼中為 .angle，應改為 .rotation 對應你的資料結構
  initialPatternAngle = selectedPattern.value.rotation || 0;

  isRotating = true;
  centerX = center.x;
  centerY = center.y;
  document.body.style.cursor = 'grabbing';

  if (event.cancelable) event.preventDefault();
};




// 刪除圖案
const removePattern = (id: string) => {
  designStore.removePattern(id);
};

// 旋轉圖案
// let isDragging = false
let lastAngle = 0;
// let isRotating = ref(false);
// const rotateStart: any = { x: 0, y: 0, startAngle: 0, rotation: 0 };
// const startRotate = (patternId: string, event: any) => {
//   designStore.selectPattern(patternId);

//   // isDragging.value = true;
//   // lastAngle = getAngle(e);
//   // document.addEventListener("mousemove", onDrag);
//   // document.addEventListener("mouseup", stopDrag);

//   // this.selectedPatternIndex = index;
//   // isRotating.value = true;

//   // const pattern = this.patternsOnPlate[index];
//   const rect = event.target.closest(".plate-container").getBoundingClientRect();

//   let clientX, clientY;

//   if (event.type.includes("touch")) {
//     clientX = event.touches[0].clientX;
//     clientY = event.touches[0].clientY;
//   } else {
//     clientX = event.clientX;
//     clientY = event.clientY;
//   }

//   // 計算圖案中心點
//   const centerX = rect.left += (designStore.selectedPattern?.x ?? 0) + (designStore.selectedPattern?.size?.width ?? 0);
//   const centerY = rect.top + (designStore.selectedPattern?.y ?? 0) + (designStore.selectedPattern?.size?.height ?? 0);

//   // 計算起始角度
//   const startAngle = Math.atan2(clientY - centerY, clientX - centerX);

//   rotateStart.value = {
//     patternId: patternId,
//     x: centerX,
//     y: centerY,
//     startAngle: startAngle,
//     rotation: designStore.selectedPattern?.rotation ?? 0,
//   };

// document.addEventListener("mousemove", doRotate);
// document.addEventListener("mouseup", stopRotate);
// document.addEventListener("touchmove", doRotate, { passive: false });
// document.addEventListener("touchend", stopRotate);

// if (event.type.includes("touch")) {
//   event.preventDefault();
// }
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
// };

// const doRotate = (event: any) => {
//   // if (!rotateData.value) return;

//   // const start = rotateData.value;
//   const currentAngle = Math.atan2(
//     event.clientY - rotateStart.centerY,
//     event.clientX - rotateStart.x
//   );

//   const angleDiff = (currentAngle - rotateStart.startAngle) * (180 / Math.PI);

//   let newRotation = (rotateStart.rotation + angleDiff) % 360;
//   if (newRotation < 0) newRotation += 360;

//   designStore.updatePatternRotation(rotateStart.patternId, newRotation);
// };

// const stopRotate = () => {
//   rotateStart.value = null;
//   document.removeEventListener("mousemove", doRotate);
//   document.removeEventListener("mouseup", stopRotate);
// };

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

// const rotatePattern = (patternId: string) => {
//   const patternIndex = placedPatterns.value.findIndex((p) => p.id === patternId);
//   if (patternIndex !== -1) {
//     placedPatterns.value[patternIndex].rotation += 45;
//     if (placedPatterns.value[patternIndex].rotation >= 360) {
//       placedPatterns.value[patternIndex].rotation = 0;
//     }
//   }
// };

// const updatePatternPosition = (patternId: string, x: number, y: number) => {
//   designStore.updatePatternPosition(patternId, x, y);
// };

// const updatePatternRotation = (patternId: string, rotation: number) => {
//   designStore.updatePatternRotation(patternId, rotation);
// };

// const updatePatternScale = (patternId: string, scale: number) => {
//   designStore.updatePatternScale(patternId, scale);
// };

// const selectPattern = (patternId: string) => {
//   designStore.selectPattern(patternId);
// };

// const deletePattern = (patternId: string) => {
//   designStore.removePattern(patternId);
// };

// const deleteSelectedPattern = () => {
//   if (selectedPattern.value) {
//     designStore.removePattern(selectedPattern.value.id);
//   }
// };

// const updateSelectedRotation = (value: number) => {
//   if (selectedPattern.value) {
//     designStore.updatePatternRotation(selectedPattern.value.id, value);
//   }
// };

// const updateSelectedScale = (value: number) => {
//   if (selectedPattern.value) {
//     designStore.updatePatternScale(selectedPattern.value.id, value);
//   }
// };

// const updateBackground = (color: string | null) => {
//   if (color) {
//     designStore.setBackgroundColor(color);
//   }
// };

// const clearAll = () => {
//   designStore.clearAllPatterns();
// };

// const deselectAll = () => {
//   designStore.selectPattern("");
// };

// const saveDesign = () => {
//   const design = designStore.saveDesign();
//   ElMessage.success("設計已保存！");
// };

// 初始化
// designStore.loadPlates();
// designStore.loadPatterns();

// 全局事件處理
const onGlobalMouseMove = (e: any) => {
  // // 【關鍵修正】只有當使用者真的在「拖曳」或「旋轉」圖案時，才阻止網頁捲動
  // if (isDragging || isRotating) {
  //   if (e.cancelable) {
  //     e.preventDefault(); 
  //   }
  // } else {
  //   // 如果只是普通的手指在滑網頁，直接放行，不干涉
  //   return;
  // }

  // 如果是觸控事件，且正在操作，防止平板視窗滾動
  if ((isDragging || isRotating) && e.cancelable) {
    e.preventDefault();
  }

  const { clientX, clientY } = getEventClientXY(e);

  if (isDragging && selectedPattern.value && selectedPattern.value.id !== null) {
    const dx = clientX - dragStartX;
    const dy = clientY - dragStartY;
    const newLeft = originalLeft + dx / DESIGN_SCALE;
    const newTop = originalTop + dy / DESIGN_SCALE;
    updatePatternPosition(dragTargetId, newLeft, newTop);
  }
  else if (isRotating && rotatingId !== null) {
    // 计算当前鼠标相对于原图案中心的角度
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    let currentAngleRad = Math.atan2(dy, dx);
    // 角度差（弧度）
    let deltaRad = currentAngleRad - startAngleRad;
    // 转换为度数
    let deltaDeg = deltaRad * 180 / Math.PI;
    let newAngle = initialPatternAngle + deltaDeg;
    // 保持角度在 0~360 范围便于显示
    newAngle = ((newAngle % 360) + 360) % 360;
    updatePatternAngle(rotatingId, newAngle);
  }
};

const onGlobalMouseUp = () => {
  if (isDragging) {
    isDragging = false;
    dragTargetId = null;
  }
  if (isRotating) {
    isRotating = false;
    rotatingId = null;
  }
  document.body.style.cursor = 'default';
};

const handleWindowResize = () => {
  if (!plateContainerRef.value) return;
  placedPatterns.value.forEach(p => {
    const maxLeft = Math.max(0, Number(currentPlate.value?.size?.width || 0) - Number(p.size.width));
    const maxTop = Math.max(0, Number(currentPlate.value?.size?.height || 0) - Number(p.size.height));
    p.x = Math.min(Math.max(0, p.x), maxLeft);
    p.y = Math.min(Math.max(0, p.y), maxTop);
  });
};

onMounted(() => {
  window.addEventListener('mousemove', onGlobalMouseMove);
  window.addEventListener('mouseup', onGlobalMouseUp);

  // 平板觸控監聽
  window.addEventListener('touchmove', onGlobalMouseMove, { passive: false });
  window.addEventListener('touchend', onGlobalMouseUp);
  window.addEventListener('touchcancel', onGlobalMouseUp); // 防止手指劃出螢幕邊緣斷開

  window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onGlobalMouseMove);
  window.removeEventListener('mouseup', onGlobalMouseUp);

  window.removeEventListener('touchmove', onGlobalMouseMove);
  window.removeEventListener('touchend', onGlobalMouseUp);
  window.removeEventListener('touchcancel', onGlobalMouseUp);
  window.removeEventListener('resize', handleWindowResize);
});
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
  box-sizing: border-box;
  margin-bottom: 20px;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.plate-container.flipped {
  transform: rotateY(180deg);
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.pattern-item :deep(svg) {
  width: 100%;
  height: 100%;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.boundary-error {
  width: 100%;
  margin: 0 0 8px;
  color: #dc2626;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
}

.pattern-item :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.selected-info {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.pattern-on-plate {
  position: absolute;
  cursor: grab;
  will-change: left, top, transform;
  transition: box-shadow 0.1s;
  transform-origin: center center;
  /* backface-visibility: hidden; */
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

.pattern-back {
  transform: rotateY(180deg);
}

/* .pattern-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
} */

/* 設計按鈕 */
/* .control-btn {
  border-radius: 50%;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: all 0.3s ease;
}

.control-btn:hover {
  transform: scale(1.8);
}

.control-btn.rotate:hover {
  cursor: pointer;
} */

.rotate-handle {
  position: absolute;
  /* bottom: -12px; */
  right: 40px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-size: 18px;
  font-weight: bold;
  color: white;
  transition: 0.1s;
}

.rotate-handle:active {
  cursor: grabbing;
  background: #d3e9f8;
}

.rotate-handle:hover {
  /* background: #ffaa44; */
  transform: scale(1.1);
}

.delete-btn {
  position: absolute;
  /* top: -12px;s */
  right: -40px;
  width: 26px;
  height: 26px;
  /* background: #ff5e6c; */
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: 0.1s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 20;
  font-family: monospace;
}

.delete-btn:hover {
  background: #f8d0d4;
  transform: scale(1.1);
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
