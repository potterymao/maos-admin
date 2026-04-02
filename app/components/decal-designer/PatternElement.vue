<template>
  <div
    ref="patternElement"
    :class="['absolute cursor-move select-none transition-transform', pattern.selected ? 'ring-2 ring-blue-500 ring-offset-2' : '']"
    :style="{
      width: pattern.width + 'px',
      height: pattern.height + 'px',
      left: pattern.x + 'px',
      top: pattern.y + 'px',
      transform: `rotate(${pattern.rotation}deg)`,
      zIndex: pattern.zIndex,
    }"
    @mousedown="selectPattern"
    @touchstart="selectPattern"
  >
    <!-- 刪除按鈕 -->
    <button
      class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10"
      @click.stop="removePattern"
      title="刪除圖案"
    >
      <i class="i-mdi-close text-sm"></i>
    </button>

    <!-- 旋轉控制點 -->
    <div
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-green-500 rounded-full cursor-grab border-2 border-white shadow-md opacity-0 hover:opacity-100 transition-opacity z-10"
      @mousedown.stop="startRotate"
      @touchstart.stop="startRotate"
      title="拖拽旋轉"
    ></div>

    <!-- 調整大小控制點 -->
    <div
      class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize border-2 border-white shadow-md opacity-0 hover:opacity-100 transition-opacity z-10"
      @mousedown.stop="(e) => startResize(e, 'bottom-right')"
      @touchstart.stop="(e) => startResize(e, 'bottom-right')"
      title="調整大小"
    ></div>

    <div
      class="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-500 rounded-full cursor-sw-resize border-2 border-white shadow-md opacity-0 hover:opacity-100 transition-opacity z-10"
      @mousedown.stop="(e) => startResize(e, 'bottom-left')"
      @touchstart.stop="(e) => startResize(e, 'bottom-left')"
    ></div>

    <div
      class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full cursor-ne-resize border-2 border-white shadow-md opacity-0 hover:opacity-100 transition-opacity z-10"
      @mousedown.stop="(e) => startResize(e, 'top-right')"
      @touchstart.stop="(e) => startResize(e, 'top-right')"
    ></div>

    <div
      class="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize border-2 border-white shadow-md opacity-0 hover:opacity-100 transition-opacity z-10"
      @mousedown.stop="(e) => startResize(e, 'top-left')"
      @touchstart.stop="(e) => startResize(e, 'top-left')"
    ></div>

    <!-- 圖案本身 -->
    <div class="w-full h-full bg-center bg-no-repeat bg-contain" :style="{ backgroundImage: `url(${pattern.image})` }"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { PlacedPattern } from "~~/types";

interface Props {
  pattern: PlacedPattern;
  index: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  select: [index: number];
  remove: [index: number];
  startResize: [event: MouseEvent | TouchEvent, direction: string];
  startRotate: [event: MouseEvent | TouchEvent];
}>();

const patternElement = ref<HTMLElement>();

const selectPattern = (event: MouseEvent | TouchEvent) => {
  emit("select", props.index);

  if ("touches" in event) {
    event.preventDefault();
  }
};

const removePattern = () => {
  emit("remove", props.index);
};

const startResize = (event: MouseEvent | TouchEvent, direction: string) => {
  emit("startResize", event, direction);

  if ("touches" in event) {
    event.preventDefault();
  }
};

const startRotate = (event: MouseEvent | TouchEvent) => {
  emit("startRotate", event);

  if ("touches" in event) {
    event.preventDefault();
  }
};

onMounted(() => {
  if (patternElement.value) {
    patternElement.value.setAttribute("data-x", "0");
    patternElement.value.setAttribute("data-y", "0");
  }
});
</script>
