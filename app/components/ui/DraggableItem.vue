<template>
  <div
    ref="draggableRef"
    class="draggable-item"
    :class="{ selected }"
    :style="{
      transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
      zIndex: zIndex,
      cursor: isDragging ? 'grabbing' : 'grab',
    }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <slot></slot>

    <!-- 控制手柄 -->
    <div v-if="selected" class="control-handles">
      <div class="rotate-handle" @mousedown.stop="startRotate">
        <el-icon><Refresh /></el-icon>
      </div>
      <div class="scale-handle" @mousedown.stop="startScales">
        <el-icon><ZoomIn /></el-icon>
      </div>
      <button class="delete-btn" @click="handleDelete">
        <el-icon><Close /></el-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { Refresh, ZoomIn, Close } from "@element-plus/icons-vue";

const props = defineProps<{
  initialX: number;
  initialY: number;
  initialRotation?: number;
  initialScale?: number;
  selected?: boolean;
  zIndex?: number;
}>();

const emit = defineEmits<{
  "update:position": [x: number, y: number];
  "update:rotation": [rotation: number];
  "update:scale": [scale: number];
  delete: [];
  select: [];
}>();

const draggableRef = ref<HTMLElement>();
const isDragging = ref(false);
const isRotating = ref(false);
const isScaling = ref(false);

const position = reactive({
  x: props.initialX,
  y: props.initialY,
});

const rotation = ref(props.initialRotation || 0);
const scale = ref(props.initialScale || 1);

let startX = 0;
let startY = 0;
let startRotation = 0;
let startScale = 1;
let startDistance = 0;

const startDrag = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  isDragging.value = true;
  emit("select");

  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

  startX = clientX - position.x;
  startY = clientY - position.y;

  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("touchmove", onDragMove, { passive: false });
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);
};

const onDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;

  e.preventDefault();
  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

  position.x = clientX - startX;
  position.y = clientY - startY;

  emit("update:position", position.x, position.y);
};

const startRotate = (e: MouseEvent) => {
  e.stopPropagation();
  isRotating.value = true;
  startRotation = rotation.value;

  const rect = draggableRef.value?.getBoundingClientRect();
  if (!rect) return;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    if (!isRotating.value) return;

    const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);

    rotation.value = startRotation + (angle * 180) / Math.PI;
    emit("update:rotation", rotation.value);
  };

  const handleMouseUp = () => {
    isRotating.value = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

const startScales = (e: MouseEvent) => {
  e.stopPropagation();
  isScaling.value = true;
  startScale = scale.value;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    if (!isScaling.value) return;

    const delta = moveEvent.movementY;
    const newScale = Math.max(0.1, startScale - delta * 0.01);
    scale.value = newScale;
    emit("update:scale", newScale);
  };

  const handleMouseUp = () => {
    isScaling.value = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("touchmove", onDragMove);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
};

const handleDelete = () => {
  emit("delete");
};

onUnmounted(() => {
  stopDrag();
});
</script>

<style scoped>
.draggable-item {
  position: absolute;
  transition: transform 0.1s;
  user-select: none;
  touch-action: none;
}

.draggable-item.selected {
  outline: 2px dashed #409eff;
}

.control-handles {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: white;
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rotate-handle,
.scale-handle,
.delete-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f5f5;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}

.rotate-handle:hover {
  background: #e6f7ff;
}

.scale-handle:hover {
  background: #f6ffed;
}

.delete-btn:hover {
  background: #fff2f0;
  color: #ff4d4f;
}
</style>
