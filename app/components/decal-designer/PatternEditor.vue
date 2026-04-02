<template>
  <div class="panel">
    <div class="design-panel-title">
      <Icon name="material-symbols:playlist-add-check-rounded" class="text-blue-500 text-[28px]" />
      <h2>{{ $t("_designer.design_info") }}</h2>
    </div>

    <div class="info-card">
      <div class="info-item">
        <span class="label">{{ $t("_designer.selectedPlate") }}:</span>
        <span class="value">{{ currentPlate?.name }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ $t("_designer.patternCount") }}:</span>
        <span class="value">{{ totalPatternsCount }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ $t("_designer.currency") }}:</span>
        <span class="value price">${{ designPrice }}</span>
      </div>
    </div>

    <div v-if="placedPatterns">
      <!-- 列表 -->
      <div class="control-group">
        <div class="flex flex-wrap gap-2 mt-4">
          <div
            v-for="(pattern, index) in placedPatterns"
            :key="pattern.id"
            class="pattern-item w-full"
            :class="{ selected: selectedPattern?.id === pattern.id }"
            @click="selectPatternOnPlate(pattern.id)"
          >
            <div class="pattern-item-index">{{ index + 1 }}</div>
            <div class="pattern-item-name">{{ pattern.name }}</div>
            <span class="text-blue-400 text-[14px]">$ {{ pattern.price }}</span>
            <!-- <el-button type="danger" @click="removePattern">
              <Icon name="material-symbols:delete-forever-rounded" class="text-[20px]" />
            </el-button> -->
            <!-- <button class="pattern-item-remove" @click.stop="removePattern">
              <Icon name="material-symbols:delete-forever-rounded" class="text-[20px] text-red-500" />
            </button> -->
          </div>
        </div>
      </div>

      <div v-if="selectedPattern" class="space-y-6 mt-6">
        <div class="design-panel-title">
          <Icon name="material-symbols:page-info-rounded" class="text-blue-500 text-[28px]" />
          <h2>{{ $t("_designer.pattern_control") }}</h2>
        </div>

        <!-- 旋轉控制 -->
        <div class="control-group">
          <div class="control-label">
            <span>{{ $t("_designer.rotation") }}</span>
            <span class="control-value">{{ selectedPattern.rotation }}°</span>
          </div>
          <el-slider v-model="selectedPattern.rotation" :min="0" :max="360" :step="1" />
        </div>

        <!-- 位置控制 -->
        <div class="control-group">
          <div class="control-label">
            <span>{{ $t("_designer.move_position") }}</span>
            <span class="control-value">X:{{ selectedPattern.x }}, Y:{{ selectedPattern.y }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <el-button @click="centerPattern">
              <Icon name="ic:round-restart-alt" class="text-[20px] mr-1" />
              {{ $t("_designer.reset") }}
            </el-button>
            <el-button @click="movePattern(-10, 0)">
              <Icon name="material-symbols:arrow-left-alt-rounded" class="text-[20px] mr-1" />
              {{ $t("_designer.move_left") }}
            </el-button>
            <el-button @click="movePattern(10, 0)">
              <Icon name="material-symbols:arrow-right-alt-rounded" class="text-[20px] mr-1" />
              {{ $t("_designer.move_right") }}
            </el-button>
            <el-button @click="movePattern(0, -10)">
              <Icon name="material-symbols:arrow-upward-alt-rounded" class="text-[20px] mr-1" />
              {{ $t("_designer.move_up") }}
            </el-button>
            <el-button @click="movePattern(0, 10)">
              <Icon name="material-symbols:arrow-downward-alt-rounded" class="text-[20px] mr-1" />
              {{ $t("_designer.move_down") }}
            </el-button>
          </div>
          <!-- <div class="grid grid-cols-2 gap-2">
          <el-button type="primary" @click="centerPattern">
            <i class="i-mdi-bullseye mr-1"></i>
            置中
          </el-button>
          <el-button @click="movePattern(-10, 0)">
            <i class="i-mdi-arrow-left mr-1"></i>
            左移
          </el-button>
          <el-button @click="movePattern(10, 0)">
            <i class="i-mdi-arrow-right mr-1"></i>
            右移
          </el-button>
          <el-button @click="movePattern(0, -10)">
            <i class="i-mdi-arrow-up mr-1"></i>
            上移
          </el-button>
          <el-button @click="movePattern(0, 10)">
            <i class="i-mdi-arrow-down mr-1"></i>
            下移
          </el-button>
        </div> -->
        </div>

        <!-- 圖層控制 -->
        <div class="control-group">
          <div class="control-label">
            <span>{{ $t("_designer.layer_control") }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <el-button @click="bringToFront">
              <Icon name="material-symbols:keyboard-double-arrow-up-rounded" class="text-[20px] mr-1" />
              {{ $t("_designer.layer_top") }}
            </el-button>
            <el-button @click="sendToBack">
              <Icon name="material-symbols:keyboard-double-arrow-down-rounded" class="text-[20px] mr-1" />
              {{ $t("_designer.layer_bottom") }}
            </el-button>
            <el-button @click="bringForward">
              <!-- <i class="i-mdi-chevron-down mr-1"></i> -->
              <Icon name="material-symbols:keyboard-arrow-up-rounded" class="text-[20px] mr-1" />
              {{ $t("_designer.layer_up") }}
            </el-button>
            <el-button @click="sendBackward">
              <Icon name="material-symbols:keyboard-arrow-down-rounded" class="text-[20px] mr-1" />
              {{ $t("_designer.layer_dwon") }}
            </el-button>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="flex gap-2">
          <el-button type="danger" @click="removePattern">
            <Icon name="material-symbols:delete-forever-rounded" class="text-[20px]" />
            刪除圖案
          </el-button>
          <el-button @click="duplicatePattern">
            <Icon name="material-symbols:content-copy-rounded" class="text-[20px]" />
            複製圖案
          </el-button>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <i class="i-mdi-mouse-pointer text-4xl mb-3 opacity-50"></i>
        <p>點擊盤子上的圖案進行編輯</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const designStore = useDesignStore();
// const currentPlate = computed(() => store.currentPlate);
const currentPlate = computed(() => designStore.currentPlate);
const totalPatternsCount = computed(() => designStore.totalPatternsCount);
const designPrice = computed(() => designStore.designPrice);

const placedPatterns = computed(() => designStore.placedPatterns);
const selectedPattern = computed(() => designStore.selectedPattern);
// const selectedPatternIndex = computed(() => designStore.selectedPatternIndex);

// 選擇盤子上的圖案
const selectPatternOnPlate = (id: string) => {
  designStore.selectPattern(id);
};

const centerPattern = () => {
  if (selectedPattern.value) {
    designStore.centerPattern(selectedPattern.value.id);
  }
};

const movePattern = (dx: number, dy: number) => {
  if (selectedPattern.value) {
    designStore.updatePatternPosition(selectedPattern.value.id, selectedPattern.value.x + dx, selectedPattern.value.y + dy);
  }
};

// 移除
const removePattern = () => {
  if (selectedPattern.value) {
    designStore.removePattern(selectedPattern.value.id);
  }
};

const duplicatePattern = () => {
  if (selectedPattern.value) {
    designStore.duplicatePattern(selectedPattern.value.id);
  }
};

// 置頂
const bringToFront = () => {
  if (selectedPattern.value) {
    designStore.bringToFront(selectedPattern.value.id);
  }
};

// 置底
const sendToBack = () => {
  if (selectedPattern.value) {
    designStore.sendToBack(selectedPattern.value.id);
  }
};

// 上移
const bringForward = () => {
  if (selectedPattern.value) {
    designStore.bringForward(selectedPattern.value.id);
  }
};

// 下移
const sendBackward = () => {
  if (selectedPattern.value) {
    designStore.sendBackward(selectedPattern.value.id);
  }
};
</script>

<style scoped>
.control-label {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  color: #555;
}

.control-value {
  color: #3498db;
  font-weight: 700;
}

.el-button:hover {
  transition: all 0.3s;
  transform: translateY(-2px);
}

.el-button + .el-button {
  margin-left: unset;
}

.pattern-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f9fa;
  padding: 5px 10px;
  border-radius: 8px;
  border-left: 4px solid #ff888e;
  cursor: pointer;
}

.pattern-item:hover {
  transition: all 0.3s;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffe4e5;
}

.pattern-item.selected {
  background: #ffe4e5;
  border-left-color: #ff888e;
}

.pattern-item-index {
  background: #55bbff;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.pattern-item-name {
  flex-grow: 1;
  font-weight: 500;
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

.info-card {
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
}

.label {
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
}
</style>
