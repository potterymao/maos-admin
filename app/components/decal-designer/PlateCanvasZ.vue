<!-- components/PlateDesigner/PlateCanvas.vue -->
<template>
  <div class="panel plate-canvas-container">
    <div class="design-panel-title">
      <Icon name="ic:baseline-brush" class="text-blue-500" />
      <h2>{{ $t("_designer.designArea") }}</h2>
    </div>

    <div class="canvas-wrapper">
      <div class="flex flex-col items-center">
        <!-- 盤子背景 -->
        <div ref="plateContainer" class="plate-container relative shadow-lg" :style="{
          background: currentPlate?.image ? `url(${currentPlate.image}) no-repeat center / contain` : '#ffffff',
          width: currentPlate?.size.width * 2 + 'px',
          height: currentPlate?.size.height * 2 + 'px',
        }" style="background-origin: content-box;background-clip: content-box;padding: 10px" @click="clearSelection">
          <div v-if="placedPatterns.length === 0"
            class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <i class="i-mdi-plus-circle text-6xl mb-4 opacity-30"></i>
            <p class="text-lg">點擊左側圖案添加到盤子上</p>
          </div>



          <!-- <div v-for="pattern in placedPatterns" :key="pattern.id" :ref="el => { if (el) patternRefs[pattern.id] = el }"
            class="pattern-on-plate" :style="{ left: pattern.x + 'px', top: pattern.y + 'px' }"
            @click.stop="selectPatternOnPlate(pattern.id)">
            <div class="pattern-item" v-html="getPatternSvg(pattern.patternId)" :style="patternItemStyle(pattern)" />
          </div>

          <Moveable v-if="selectedPattern" :target="selectedPatternElement" :draggable="true" :rotatable="true"
            :scalable="true" :keepRatio="true" @drag="onDrag" @rotate="onRotate" /> -->


          <div v-for="pattern in placedPatterns" :key="pattern.id" class="pattern-on-plate"
            :class="{ selected: pattern.selected }" :style="{
              left: pattern.x + 'px',
              top: pattern.y + 'px',
              transform: `rotate(${pattern.rotation}deg)`,
              fontSize: getPatternSize(pattern.patternId) + 'px',
            }" @mousedown="startDrag(pattern.id, $event)" @click="selectPatternOnPlate(pattern.id)">

            <div class="pattern-item" v-html="getPatternSvg(pattern.patternId)" :style="{
              width: pattern.size.width * 2 + 'px',
              height: pattern.size.height * 2 + 'px',
            }" />

            <div class="pattern-controls">
              <!-- <button class="control-btn rotate" @mousedown.stop="startRotateDrag(pattern.id, $event)"
                @touchstart.stop="startRotateDragTouch(pattern.id, $event)" @contextmenu.prevent>
                <Icon name="ic:baseline-cached" class="text-blue-500" />
              </button> -->
              <button class="control-btn rotate" @mousedown.stop="startRotate(pattern.id, $event)"
                @touchstart.stop="startRotate(pattern.id, $event)">
                <Icon name="ic:baseline-cached" class="text-blue-500" />
              </button>
              <!-- <button class="control-btn rotate" @click.stop="rotatePattern(pattern.id)">
                <Icon name="ic:baseline-cached" class="text-blue-500" />
              </button> -->
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
// import Moveable from "vue3-moveable";

const designStore = useDesignStore();

// const patternRefs: any = reactive({});

// // 计算属性：获取当前选中图案的 DOM 元素
// const selectedPatternElement = computed(() => {
//   if (!selectedPattern.value) return null;
//   return patternRefs[selectedPattern.value.id] || null;
// });

// // 处理拖拽事件 (drag)
// const onDrag = ({ target, transform, left, top }) => {
//   // 更新目标元素的 transform 样式，实现位置移动
//   target.style.transform = transform;
//   // 同时更新 store 中的位置数据 (left 和 top 是相对于容器的位置)
//   if (selectedPattern.value) {
//     // 注意：这里的 left, top 是相对于父容器的 px 值
//     designStore.updatePatternPosition(selectedPattern.value.id, left, top);
//   }
// };

// // 处理旋转事件 (rotate)
// const onRotate = ({ target, transform, rotate }) => {
//   target.style.transform = transform;
//   if (selectedPattern.value) {
//     // 更新 store 中的旋转角度，同时保留之前的位置信息
//     designStore.updatePatternRotation(selectedPattern.value.id, rotate);
//   }
// };

// const patternItemStyle = (pattern: any) => ({
//   width: pattern.size.width * 2 + 'px',
//   height: pattern.size.height * 2 + 'px',
//   transform: `rotate(${pattern.rotation}deg) scale(${pattern.scale})`,
// });

// // 处理缩放事件 (scale)
// const onScale = ({ target, transform, scale }) => {
//   target.style.transform = transform;
//   if (selectedPattern.value) {
//     // 假设我们的 store 中有更新缩放的方法
//     designStore.updatePatternScale(selectedPattern.value.id, scale);
//   }
// };






// 計算屬性
const currentPlate = computed(() => designStore.currentPlate);
const placedPatterns = computed(() => designStore.placedPatterns);
const selectedPattern = computed(() => designStore.selectedPattern);

const plateSize = computed(() => currentPlate.value?.size || { width: 300, height: 300 });

const clearSelection = () => {
  designStore.patterns.forEach((p) => (p.selected = false));
};

// 監聽選擇的圖案變化
// watch(selectedPattern, (newPattern) => {
//   if (newPattern) {
//     rotationValue.value = newPattern.rotation;
//     scaleValue.value = newPattern.scale;
//   }
// });



// watch(currentPlate, (newPlate) => {
//   if (newPlate) {
//     designStore.selectPlate(newPlate.id);
//   }
// });

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
  window.removeEventListener("mousemove", handleDrag);
  window.removeEventListener("mouseup", stopDrag);
};

// 刪除圖案
const removePattern = (id: string) => {
  designStore.removePattern(id);
};

// 页面失焦时强制结束所有拖拽，避免卡死
const handleBlur = () => {
  if (isRotatingDrag) endRotateDrag();
  if (isDragging) stopDrag();
};

onMounted(() => {
  window.addEventListener('blur', handleBlur);
});




const rotationAngle = ref(0);          // 连续累积角度(deg)
let isRotatingDrag = false;             // 旋转拖拽中
let rotateStartX = 0;
let rotateStartAngle = 0;
const ROTATE_SENSITIVITY = 0.65;        // 每px旋转0.65度

// 存储事件绑定引用，便于清理
let boundMouseMoveRotate: any = null;
let boundMouseUpRotate: any = null;
let boundMouseMoveMove: any = null;
let boundMouseUpMove: any = null;
let boundTouchMoveRotate: any = null;
let boundTouchEndRotate: any = null;
let boundTouchCancelRotate: any = null;
let boundTouchMoveMove: any = null;
let boundTouchEndMove: any = null;
let boundTouchCancelMove: any = null;

// 互斥标志: 同时只能进行一种拖拽(位置移动 或 旋转)，避免事件冲突
function abortOtherDrags(keepRotate = false, keepMove = false) {
  if (!keepRotate && isRotatingDrag) {
    endRotateDrag();
  }
  if (!keepMove && isDragging) {
    stopDrag();
  }
}


function startRotateDrag(patternId: string, event: any) {
  designStore.selectPattern(patternId);

  // 如果正在移动图片位置，先强制结束移动拖拽
  if (isDragging) stopDrag();
  abortOtherDrags(false, true);

  isRotatingDrag = true;
  rotateStartX = event.clientX;
  rotateStartAngle = rotationAngle.value;

  // 绑定全局事件 (鼠标)
  boundMouseMoveRotate = onRotateMouseMove;
  boundMouseUpRotate = onRotateMouseUp;
  window.addEventListener('mousemove', boundMouseMoveRotate);
  window.addEventListener('mouseup', boundMouseUpRotate);

  // 绑定触摸事件
  boundTouchMoveRotate = onRotateTouchMove;
  boundTouchEndRotate = onRotateTouchEnd;
  boundTouchCancelRotate = onRotateTouchCancel;
  window.addEventListener('touchmove', boundTouchMoveRotate, { passive: false });
  window.addEventListener('touchend', boundTouchEndRotate);
  window.addEventListener('touchcancel', boundTouchCancelRotate);

  // 视觉辅助
  // document.body.style.userSelect = 'none';
  // const btn = document.querySelector('.drag-rotate-btn');
  // if (btn) btn.style.cursor = 'grabbing';
}

function computeRotateFromDrag(currentX: number) {
  if (!isRotatingDrag) return rotationAngle.value;
  const deltaX = currentX - rotateStartX;
  return rotateStartAngle + (deltaX * ROTATE_SENSITIVITY);
}

function updateRotate(clientX: number) {
  if (!isRotatingDrag) return;
  const newAngle = computeRotateFromDrag(clientX);
  rotationAngle.value = newAngle;
  designStore.updatePatternRotation(designStore.selectedPattern?.id, rotationAngle.value);
}

function onRotateMouseMove(e: any) {
  if (!isRotatingDrag) return;
  e.preventDefault();
  updateRotate(e.clientX);
}

function onRotateMouseUp(e: any) {
  if (!isRotatingDrag) return;
  e.preventDefault();
  endRotateDrag();
}

function onRotateTouchMove(e: any) {
  if (!isRotatingDrag) return;
  e.preventDefault();
  const touch = e.touches[0];
  if (touch) updateRotate(touch.clientX);
}

function onRotateTouchEnd(e: any) {
  if (!isRotatingDrag) return;
  e.preventDefault();
  endRotateDrag();
}

function onRotateTouchCancel(e: any) {
  if (!isRotatingDrag) return;
  e.preventDefault();
  endRotateDrag();
}

function endRotateDrag() {
  if (!isRotatingDrag) return;
  isRotatingDrag = false;
  if (boundMouseMoveRotate) window.removeEventListener('mousemove', boundMouseMoveRotate);
  if (boundMouseUpRotate) window.removeEventListener('mouseup', boundMouseUpRotate);
  if (boundTouchMoveRotate) window.removeEventListener('touchmove', boundTouchMoveRotate);
  if (boundTouchEndRotate) window.removeEventListener('touchend', boundTouchEndRotate);
  if (boundTouchCancelRotate) window.removeEventListener('touchcancel', boundTouchCancelRotate);

  // const btn = document.querySelector('.drag-rotate-btn');
  // if (btn) btn.style.cursor = 'grab';
  // document.body.style.userSelect = '';
}

// ----- 事件绑定 (按钮旋转 / 图片拖拽) -----
function startRotateDragMouse(patternId: string, e: any) {
  e.preventDefault();
  startRotateDrag(patternId, e);
}

function startRotateDragTouch(patternId: string, e: any) {
  e.preventDefault();
  const touch = e.touches[0];
  if (touch) startRotateDrag(patternId, touch);
}











// 旋轉圖案
// let isDragging = false
let lastAngle = 0;
let isRotating = ref(false);
const rotateStart: any = {};
const startRotate = (patternId: string, event: any) => {
  // 1. 清理之前的旋转监听
  stopRotate();

  designStore.selectPattern(patternId);
  const pattern = designStore.selectedPattern;
  if (!pattern) return;

  // const container = document.querySelector('.plate-container');
  // if (!container) return;
  // const rect = container.getBoundingClientRect();
  // const displayWidth = pattern.size.width * 2;
  // const displayHeight = pattern.size.height * 2;

  // 3. 正确计算图案中心点（相对于视口）
  // const centerX = rect.left + pattern.x + pattern.size.width;   // pattern.x 是左上角，+ 宽度的一半
  // const centerY = rect.top + pattern.y + pattern.size.height;

  // 4. 获取初始鼠标/触摸点坐标
  // let clientX, clientY;
  // if (event.type === 'touchstart') {
  //   clientX = event.touches[0].clientX;
  //   clientY = event.touches[0].clientY;
  //   event.preventDefault();
  // } else {
  //   clientX = event.clientX;
  //   clientY = event.clientY;
  // }

  // isDragging.value = true;
  // lastAngle = getAngle(e);
  // document.addEventListener("mousemove", onDrag);
  // document.addEventListener("mouseup", stopDrag);

  // this.selectedPatternIndex = index;
  isRotating.value = true;


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
  // 3. 正确计算图案中心点（相对于视口）
  const centerX = rect.left + pattern.x + pattern.size.width;   // pattern.x 是左上角，+ 宽度的一半
  const centerY = rect.top + pattern.y + pattern.size.height;
  // const centerX = rect.left + pattern?.x + (pattern?.size?.width ?? 0) / 2;
  // const centerY = rect.top + pattern?.y + (pattern?.size?.height ?? 0) / 2;

  // const centerX = rect.left + pattern?.x + (pattern?.size?.width ?? 0);
  // const centerY = rect.top + pattern?.y + (pattern?.size?.height ?? 0);

  // 計算起始角度
  const startAngle = Math.atan2(clientY - centerY, clientX - centerX);

  rotateStart.value = {
    patternId: patternId,
    x: centerX,
    y: centerY,
    startAngle: startAngle,
    rotation: designStore.selectedPattern?.rotation ?? 0,
  };

  // 6. 绑定全局事件（确保触摸和鼠标共存）
  window.addEventListener('mousemove', doRotate);
  window.addEventListener('mouseup', stopRotate);
  window.addEventListener('touchmove', doRotate, { passive: false });
  window.addEventListener('touchend', stopRotate);
  // window.addEventListener('touchcancel', stopRotate);

  // document.addEventListener("mousemove", doRotate);
  // document.addEventListener("mouseup", stopRotate);
  // document.addEventListener("touchmove", doRotate, { passive: false });
  // document.addEventListener("touchend", stopRotate);

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
  // const deltaX = event.clientX - rotateStart.value.x;
  if (!rotateStart.value) return;
  event.preventDefault();

  // 获取当前指针坐标（兼容触摸）
  let clientX, clientY;
  if (event.touches) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  // const { centerX, centerY, startAngle, startRotation, patternId } = rotateStart.value;
  // const currentAngle = Math.atan2(clientY - centerY, clientX - centerX);
  // let angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
  // let newRotation = (startRotation + angleDiff) % 360;
  // if (newRotation < 0) newRotation += 360;

  // designStore.updatePatternRotation(patternId, newRotation);

  const currentAngle = Math.atan2(event.clientY - rotateStart.value.y, event.clientX - rotateStart.value.x);

  const angleDiff = (currentAngle - rotateStart.value.startAngle) * (180 / Math.PI);

  let newRotation = (rotateStart.value.rotation + angleDiff) % 360;
  if (newRotation < 0) newRotation += 360;

  designStore.updatePatternRotation(rotateStart.value.patternId, newRotation);
};

const stopRotate = () => {
  if (!rotateStart.value) return;
  rotateStart.value = null;
  window.removeEventListener('mousemove', doRotate);
  window.removeEventListener('mouseup', stopRotate);
  window.removeEventListener('touchmove', doRotate);
  window.removeEventListener('touchend', stopRotate);
  // window.removeEventListener('touchcancel', stopRotate);

  // document.removeEventListener("mousemove", doRotate);
  // document.removeEventListener("mouseup", stopRotate);
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
  display: flex;
  justify-content: center;
  align-items: center;
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
  /* cursor: move;
  user-select: none;
  transition: transform 0.2s ease;
  z-index: 10; */
  cursor: grab;
  will-change: left, top, transform;
  transition: box-shadow 0.1s;
  transform-origin: center center;
}

.pattern-on-plate.selected {
  outline: 2px dashed #3498db;
  outline-offset: 5px;
}

.pattern-object:active {
  cursor: grabbing;
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
