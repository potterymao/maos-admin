<!-- pages/index.vue -->
<template>
  <div class="container mx-auto p-6 space-y-6">
    <el-row>
      <el-col :span="24" class="text-center mb-6">
        <h1 class="text-3xl font-bold">自訂盤子設計器</h1>
        <p class="text-gray-600">選擇盤子並添加圖案來設計您的專屬盤子！</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" class="text-center mb-6">
        <el-row>
          <!-- 選擇盤子 -->
          <ElCard shadow="hover">
            <h2 class="text-xl font-bold mb-3">選擇盤子</h2>
            <ElSelect v-model="store.plateType" placeholder="選擇盤子類型" class="w-48">
              <ElOption v-for="opt in plateOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </ElSelect>
          </ElCard>
        </el-row>
        <el-row>
          
        </el-row>
      </el-col>
      <el-col :span="16" class="text-center mb-6"> </el-col>
    </el-row>

    <!-- 圖案庫 -->
    <ElCard shadow="hover">
      <h2 class="text-xl font-bold mb-3">圖案庫</h2>
      <div class="flex gap-2 flex-wrap">
        <ElButton v-for="p in patternLibrary" :key="p.type" type="primary" @click="addPattern(p.type)">
          {{ p.label }}
        </ElButton>
      </div>
    </ElCard>

    <!-- 設計區域 -->
    <ElCard shadow="hover" class="relative overflow-hidden">
      <h2 class="text-xl font-bold mb-3">設計區域</h2>
      <!-- 盤子背景（可替換為圖片） -->
      <div ref="designAreaRef" class="relative w-full h-[500px] bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
        <!-- 盤子示意圖 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-80 h-80 rounded-full border-4" :class="store.plateType === 'ceramic' ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50'"></div>
        </div>

        <!-- 圖案元素（可拖曳） -->
        <div
          v-for="item in store.patterns"
          :key="item.id"
          class="draggable group"
          :style="{
            left: item.x + 'px',
            top: item.y + 'px',
            transform: `rotate(${item.rotation}deg)`,
            zIndex: 10,
          }"
        >
          <!-- 圖案內容（可用 SVG 或 icon） -->
          <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white">
            {{ item.type[0].toUpperCase() }}
          </div>

          <!-- 刪除按鈕 -->
          <button class="delete-btn" @click.stop="store.removePattern(item.id)">×</button>

          <!-- 拖曳與旋轉控制（簡化版） -->
          <div
            v-draggable="{
              initialValue: { x: item.x, y: item.y },
              onMove({ x, y }) {
                store.updatePattern(item.id, { x, y });
              },
            }"
            class="absolute inset-0 cursor-move"
          ></div>
        </div>
      </div>
    </ElCard>

    <!-- 預覽按鈕 -->
    <div class="text-center">
      <ElButton type="success" size="large" @click="preview"> 預覽設計 </ElButton>
    </div>
  </div>
</template>

<!-- <script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDesignStore } from "~/stores/useDesignStore";
import { ElButton, ElSelect, ElOption, ElCard, ElMessage } from "element-plus";
import { useDraggable } from "@vueuse/core";

const store = useDesignStore();

// 盤子類型選項
const plateOptions = [
  { value: "ceramic", label: "陶瓷盤" },
  { value: "porcelain", label: "瓷盤" },
];

// 圖案庫
const patternLibrary = [
  { type: "flower", label: "花朵" },
  { type: "leaf", label: "葉子" },
  { type: "geometric", label: "幾何" },
];

// 設計區域參考
const designAreaRef = ref<HTMLElement | null>(null);

// 添加圖案
const addPattern = (type: any) => {
  store.addPattern(type);
};

// 預覽
const preview = () => {
  ElMessage.success("預覽功能：可在此處導出圖片或彈出模態框");
  console.log("Current design:", store.$state);
};
</script>

<style scoped>
/* 可選：自定義拖曳樣式 */
</style> -->
