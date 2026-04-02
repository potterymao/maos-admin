<template>
  <div class="preview-section mt-12 pt-6 border-t border-gray-200">
    <h2 class="preview-title flex items-center justify-center gap-4 mt-12">
      <Icon name="material-symbols:check-circle-rounded" class="text-[32px]" />
      {{ $t("_designer.design_complete") }}
    </h2>

    <div class="final-preview mt-12" ref="printContainerRef">
      <div class="preview-container" ref="printContentRef">
        <!-- <div class="preview-plate" :style="{ backgroundColor: currentPlate?.color }"> -->
        <div class="preview-plate" :style="{ background: currentPlate?.image ? `url(${currentPlate.image}) no-repeat center / cover` : '#ffffff' }">
          <!-- 預覽盤子上的圖案 -->
          <div
            v-for="pattern in placedPatterns"
            :key="pattern.id + '-preview'"
            class="plate-pattern-container"
            :style="{
              width: pattern.size.width * 1.8 + 'px',
              height: pattern.size.height * 1.8 + 'px',
              left: pattern.x / 1.4 + 'px',
              top: pattern.y / 1.4 + 'px',
              // transform: `rotate(${pattern.rotation}deg)`,
              transform: `rotate(${pattern.rotation}deg) scale(${pattern.scale})`,
            }"
          >
            <div class="plate-pattern" :style="{ backgroundImage: `url(${pattern.image})` }"></div>
          </div>
        </div>
      </div>

      <div class="preview-details" ref="printDetailRef">
        <div class="mb-12 pb-3 border-b border-gray-200 detail-item">
          <div class="text-sm font-bold text-gray-500 mb-1">盤子樣式</div>
          <div class="text-lg font-semibold text-gray-800">
            {{ designStore.currentPlate?.name }}
          </div>
        </div>

        <div class="mb-12 pb-3 border-b border-gray-200 detail-item">
          <div class="text-sm font-bold text-gray-500 mb-1">圖案數量</div>
          <div class="text-lg font-semibold text-gray-800">{{ designStore.placedPatterns.length }} 個</div>
          <div v-if="designStore.placedPatterns.length > 0" class="mt-2 space-y-1">
            <div v-for="pattern in designStore.placedPatterns" :key="pattern.id" class="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div class="bg-center bg-no-repeat bg-contain" :style="{ backgroundImage: `url(${getImageUrl(pattern.image)})` }"></div>
              <div class="flex justify-between w-full">
                <span class="font-bold">{{ pattern.name }} ({{ pattern.size.width }}px)</span>
                <span class="font-bold">{{ $t("currency") }} {{ pattern.price }} </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-12 pb-3 border-b border-gray-200 detail-item">
          <div class="text-sm font-bold text-gray-500 mb-1">設計時間</div>
          <div class="text-lg font-semibold text-gray-800">
            {{ designStore.designTime }}
          </div>
        </div>

        <div class="mb-12 pb-3 border-b border-gray-200 detail-item">
          <div class="text-sm font-bold text-gray-500 mb-1">設計編號</div>
          <div class="text-lg font-semibold text-gray-800">
            {{ designStore.designId }}
          </div>
        </div>
      </div>
    </div>

    <div class="preview-controls">
      <!-- <button class="btn btn-primary" @click="shareDesign"><i class="fas fa-share-alt"></i> 分享設計</button> -->
      <el-button @click="designStore.resetPlate">
        <Icon name="material-symbols:download-rounded" class="text-[20px] mr-1" />
        下載圖片
      </el-button>
      <el-button @click="printDesign">
        <Icon name="material-symbols:print-rounded" class="text-[20px] mr-1" />
        列印設計
      </el-button>
      <!-- <button class="btn btn-secondary" @click="downloadImage"><i class="fas fa-image"></i> 下載圖片</button> -->
      <!-- <button class="btn btn-secondary" @click="printDesign"><i class="fas fa-print"></i> 列印設計</button> -->
      <!-- <button class="btn btn-secondary" @click="showPreview = false"><i class="fas fa-edit"></i> 繼續編輯</button> -->
    </div>

    <!-- <div class="flex flex-col md:flex-row items-center justify-center gap-8"> -->
    <!-- <div class="flex gap-3 py-4"> -->

    <!-- 預覽盤子 -->
    <!-- <div
        ref="plateContainer"
        class="relative rounded-full shadow-lg mb-6 overflow-hidden"
        :style="{
          backgroundColor: designStore.currentPlate?.color,
          boxShadow: `0 10px 30px ${designStore.currentPlate?.shadowColor}`,
        }"
      ></div>
      <div class="max-w-md">
        <div class="space-y-4">
          <div class="pb-3 border-b border-gray-200">
            <div class="text-sm font-medium text-gray-500 mb-1">盤子樣式</div>
            <div class="text-lg font-semibold text-gray-800">
              {{ designStore.currentPlate?.name }}
            </div>
          </div>
        </div>
      </div> -->
    <!-- </div> -->
    <!-- <div class="relative w-96 h-96 rounded-full shadow-xl overflow-hidden">
        <div class="w-full h-full" :style="{ backgroundColor: designStore.currentPlate?.color }">
          <PatternElement
            v-for="(pattern, index) in designStore.patterns"
            :key="`preview-${pattern.id}`"
            :pattern="pattern"
            :index="index"
            class="absolute"
            :style="{
              left: pattern.x + 'px',
              top: pattern.y + 'px',
              width: pattern.width + 'px',
              height: pattern.height + 'px',
              transform: `rotate(${pattern.rotation}deg)`,
            }"
          />
        </div>
      </div> -->

    <!-- 設計詳情 -->
    <!-- <div class="max-w-md"> -->
    <!-- <div class="space-y-4">
          <div class="pb-3 border-b border-gray-200">
            <div class="text-sm font-medium text-gray-500 mb-1">盤子樣式</div>
            <div class="text-lg font-semibold text-gray-800">
              {{ designStore.selectedPlate.name }}
            </div>
          </div>

          <div class="pb-3 border-b border-gray-200">
            <div class="text-sm font-medium text-gray-500 mb-1">圖案數量</div>
            <div class="text-lg font-semibold text-gray-800">{{ designStore.patterns.length }} 個</div>
            <div v-if="designStore.patterns.length > 0" class="mt-2 space-y-1">
              <div v-for="pattern in designStore.patterns" :key="pattern.id" class="flex items-center gap-2 text-sm text-gray-600">
                <div class="w-4 h-4 bg-center bg-no-repeat bg-contain" :style="{ backgroundImage: `url(${pattern.image})` }"></div>
                <span>{{ pattern.name }} ({{ pattern.width }}px)</span>
              </div>
            </div>
          </div>

          <div class="pb-3 border-b border-gray-200">
            <div class="text-sm font-medium text-gray-500 mb-1">設計時間</div>
            <div class="text-lg font-semibold text-gray-800">
              {{ designStore.designTime }}
            </div>
          </div>

          <div class="pb-3 border-b border-gray-200">
            <div class="text-sm font-medium text-gray-500 mb-1">設計編號</div>
            <div class="text-lg font-semibold text-gray-800">
              {{ designStore.designId }}
            </div>
          </div>

          <div class="detail-item">
          <div class="detail-label">盤子樣式</div>
          <div class="detail-value">{{ designStore.currentPlate?.name }}</div>
        </div> -->

    <!-- <div class="detail-item">
          <div class="detail-label">圖案數量</div>
          <div class="detail-value">{{ placedPatterns.length }} 個</div>

          <div class="pattern-list" v-if="placedPatterns.length > 0">
            <div v-for="pattern in placedPatterns" :key="pattern.id + '-list'" class="pattern-list-item">
              <div class="pattern-list-icon" :style="{ backgroundImage: `url(${pattern.image})` }"></div>
              <span>{{ pattern.name }} ({{ pattern.size.width }}px × {{ pattern.size.height }}px)</span>
            </div>
          </div>
        </div> -->

    <!-- <div class="detail-item">
          <div class="detail-label">設計時間</div>
          <div class="detail-value">{{ designTime }}</div>
        </div>

        <div class="detail-item">
          <div class="detail-label">設計編號</div>
          <div class="detail-value">{{ designId }}</div>
        </div> 
        </div> -->

    <!-- <div class="mt-6 flex flex-wrap gap-3">
          <el-button type="primary" @click="shareDesign">
            <i class="i-mdi-share mr-1"></i>
            分享設計
          </el-button>
          <el-button @click="downloadImage">
            <i class="i-mdi-download mr-1"></i>
            下載圖片
          </el-button>
          <el-button @click="designStore.exportDesign">
            <i class="i-mdi-export mr-1"></i>
            匯出設計
          </el-button>
          <el-button @click="designStore.showPreview = false">
            <i class="i-mdi-pencil mr-1"></i>
            繼續編輯
          </el-button>
        </div> -->
    <!-- </div> -->
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
import html2canvas from "html2canvas-pro";

const designStore = useDesignStore();

const currentPlate = computed(() => designStore.currentPlate);
const placedPatterns = computed(() => designStore.placedPatterns);

const getImageUrl = (imagePath: string) => {
  if (process.client) {
    return `${window.location.origin}${imagePath}`;
  }
  return imagePath;
};

// 計算圖案尺寸
const getPatternSize = (patternId: string) => {
  const pattern = designStore.getPatternById(patternId);
  return pattern?.defaultSize || 50;
};

// const shareDesign = () => {
//   const designSummary = `我設計了一個盤子！\n盤子樣式: ${designStore.currentPlate.name}\n圖案數量: ${designStore.placedPatterns.length}\n設計編號: ${designStore.designId}`;

//   if (navigator.share) {
//     navigator
//       .share({
//         title: "我的盤子設計",
//         text: designSummary,
//         url: window.location.href,
//       })
//       .catch(console.error);
//   } else {
//     navigator.clipboard
//       .writeText(designSummary)
//       .then(() => {
//         ElMessage.success("設計摘要已複製到剪貼簿！");
//       })
//       .catch(() => {
//         ElMessage.error("複製失敗，請手動複製");
//       });
//   }
// };

// const downloadImage = () => {
//   ElMessage.info("圖片下載功能需配合 html2canvas 等庫實現");
//   // 實際實現：
//   // import html2canvas from 'html2canvas'
//   // const plateElement = document.querySelector('.preview-plate')
//   // if (plateElement) {
//   //   html2canvas(plateElement).then(canvas => {
//   //     const link = document.createElement('a')
//   //     link.download = `plate-design-${designStore.designId}.png`
//   //     link.href = canvas.toDataURL('image/png')
//   //     link.click()
//   //   })
//   // }
// };
const isDownloading = ref(false);
const isPrinting = ref(false);

const preloadImages = async (element: Element) => {
  // 找出所有有背景圖片的元素
  const elementsWithBg = element.querySelectorAll('[style*="background-image"]');
  const promises: any = [];

  elementsWithBg.forEach((el: Element) => {
    const style = window.getComputedStyle(el);
    const bgImage = style.backgroundImage;
    if (bgImage && bgImage !== "none") {
      const url = bgImage.replace(/^url\(["']?|["']?\)$/g, "");
      if (url) {
        const promise = new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
        promises.push(promise);
      }
    }
  });

  await Promise.all(promises);
};

const downloadImage = async () => {
  if (!process.client) return;

  isDownloading.value = true;

  try {
    const element = document.querySelector(".final-preview") as HTMLElement;
    if (!element) throw new Error("找不到預覽元素");

    ElMessage.info("正在生成圖片，請稍候...");

    // 預加載所有圖片
    await preloadImages(element);

    // 生成圖片
    const canvas = await html2canvas(element, {
      scale: 2, // 2倍解析度
      backgroundColor: "#ffffff",
      allowTaint: false,
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // 下載圖片
    const link = document.createElement("a");
    link.download = `design-${designStore.designId || Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    ElMessage.success("圖片下載成功！");
  } catch (error) {
    console.error("下載失敗:", error);
    ElMessage.error("下載失敗，請稍後重試");
  } finally {
    isDownloading.value = false;
  }
};

// 列印設計
const printContainerRef = ref<any>(null);
const printContentRef = ref<any>(null);
const printDetailRef = ref<any>(null);
const printDesign = async () => {
  if (!process.client) return;

  try {
    const printContainer = printContainerRef.value;
    const printContent = printContentRef.value;
    const printDetail = printDetailRef.value;
    if (!printContainer || !printContent || !printDetail) return;

    await nextTick();

    //   const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    //   let stylesHtml = "";
    //   styles.forEach((style) => {
    //     stylesHtml += style.outerHTML;
    //   });

    //   const printWindow = window.open("", "_blank");
    //   if (!printWindow) {
    //     ElMessage.error("無法打開列印窗口，請允許彈出窗口");
    //     return;
    //   }

    //   printWindow.document.write(`
    //   <!DOCTYPE html>
    //   <html>
    //     <head>
    //       <title>列印內容</title>
    //       ${stylesHtml}
    //     </head>
    //     <body>
    //       ${printContentRef.value.innerHTML}
    //     </body>
    //   </html>
    // `);

    //   printWindow.document.close();

    //   // 等待載入完成後列印
    //   printWindow.onload = () => {
    //     setTimeout(() => {
    //       printWindow.focus();
    //       printWindow.print();
    //       printWindow.onafterprint = () => {
    //         printWindow.close();
    //       };
    //     }, 100);
    //   };

    // const canvas = await html2canvas(printContent);

    // 獲取設備像素比
    const dpr = window.devicePixelRatio || 3;
    // 獲取元素實際尺寸
    const rect = printContent.getBoundingClientRect();

    const canvas = await html2canvas(printContent, {
      scale: 3, // 提高解析度
      backgroundColor: null, // 保留透明背景
      allowTaint: false,
      useCORS: true, // 允許跨域圖片
      logging: false,
      // width: rect.width,
      // height: rect.height,
      width: printContent.scrollWidth,
      height: printContent.scrollHeight,
      windowHeight: rect.height,
      onclone: (clonedDoc, clonedElement) => {
        const clonedIcons = clonedDoc.querySelectorAll(".plate-pattern-container");
        clonedIcons.forEach((icon: any) => {
          icon.style.width = icon.clientWidth * 2.5 + "px";
          icon.style.height = icon.clientHeight * 2.5 + "px";
          icon.style.backgroundSize = "contain";
        });
        // clonedDoc.documentElement.style.height = rect.height + "px";
        // 在克隆的文件中強制保留背景
        // clonedElement.style.width = rect.width + "px";
        clonedElement.style.height = rect.height + "px";
        clonedElement.style.webkitPrintColorAdjust = "exact";
        clonedElement.style.printColorAdjust = "exact";
      },
    });

    const canvas_detail = await html2canvas(printDetail, {
      scale: 3, // 提高解析度
      backgroundColor: null, // 保留透明背景
      allowTaint: false,
      useCORS: true, // 允許跨域圖片
      logging: false,
      // windowWidth: printContainer.scrollWidth,
      // windowHeight: printContainer.scrollHeight,
      onclone: (clonedDoc, clonedElement) => {
        const clonedIcons = clonedDoc.querySelectorAll(".detail-item");
        clonedIcons.forEach((item: any) => {
          item.style.width = item.clientWidth * 2 + "px";
          item.style.height = item.clientHeight * 1 + "px";
          item.style.backgroundSize = "contain";
        });
        // 在克隆的文件中強制保留背景
        clonedElement.style.webkitPrintColorAdjust = "exact";
        clonedElement.style.printColorAdjust = "exact";
      },
    });

    const design_image = canvas.toDataURL("image/png");

    const design_detail = canvas_detail.toDataURL("image/png");

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      ElMessage.error("無法打開列印窗口，請允許彈出窗口");
      return;
    }

    printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${designStore.designId}</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  page-break-inside: avoid;
                }
                @media print {
                  @page {
                      size: auto;
                      margin: 0;
                  }
                  body {
                    padding: 0;                    
                  }
                }
              </style>
            </head>
            <body>
              <div>
                <img src="${design_image}" style="width: ${rect.width}px; margin: 0 auto; margin-top:20px; height: 500px; display: flex;" />
                <img src="${design_detail}" style="width: ${rect.width}px; margin: 0 auto; margin-top:10px; height: auto;" /> 
              </div>
            </body>
          </html>
        `);
    printWindow.document.close();
    let printCompleted = false;
    // 等待圖片載入後列印
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => {
          // printWindow.close();
          if (!printCompleted) {
            printCompleted = true;
            setTimeout(() => {
              if (!printWindow.closed) {
                printWindow.close();
              }
            }, 100);
          }
        };
      }, 500);
    };
    // const imageUrl = ref("");
    // imageUrl.value = canvas.toDataURL("image/png");

    // const imgUrl = canvas.toDataURL("image/png");
    // const link = document.createElement("a");
    // link.download = designStore.designId + ".png";
    // link.href = imgUrl;
    // link.click();

    // // 建立一個隱藏的 iframe
    // const iframe = document.createElement("iframe");
    // iframe.style.position = "absolute";
    // iframe.style.width = "0";
    // iframe.style.height = "0";
    // iframe.style.border = "none";
    // document.body.appendChild(iframe);

    // 寫入列印內容到 iframe
    // // iframe.contentDocument?.write(printContent);
    // iframe.contentDocument?.write(`
    //   <!DOCTYPE html>
    //   <html>
    //     <head>
    //       <title>列印設計 - ${designStore.designId}</title>
    //       <style>
    //         body {
    //           margin: 0;
    //           padding: 20px;
    //           font-family: system-ui, -apple-system, sans-serif;
    //         }
    //         .print-content {
    //           max-width: 100%;
    //           text-align: center;
    //         }
    //       </style>
    //     </head>
    //     <body>
    //       <div class="print-content">
    //         ${printContent.innerHTML}
    //       </div>
    //     </body>
    //   </html>
    // `);

    // iframe.contentDocument?.close();

    // // 觸發列印
    // iframe.contentWindow?.focus();
    // iframe.contentWindow?.print();

    // if (!captureArea.value) return;

    // isPrinting.value = true;

    // const canvas = await html2canvas(printContent, {
    //   scale: 3, // 提升清晰度（2倍缩放）
    //   backgroundColor: "#fff", // 背景色
    //   useCORS: true,
    //   logging: false, // 关闭日志
    // });
    // const imageUrl = ref('');
    // imageUrl.value = canvas.toDataURL("image/png");

    // const element = document.querySelector(".final-preview") as any;
    // if (!element) throw new Error("找不到預覽元素");

    // ElMessage.info("正在準備列印...");

    // // 預加載所有圖片
    // await preloadImages(element);

    // // 生成高品質圖片用於列印
    // const canvas = await html2canvas(element, {
    //   scale: 3, // 更高解析度適合列印
    //   backgroundColor: "#ffffff",
    //   // allowTaint: false,
    //   // useCORS: true,
    //   logging: false,
    // });

    // 將 canvas 轉為圖片並開啟列印視窗
    // const imageData = canvas.toDataURL("image/png");

    // // 創建列印視窗
    // const printWindow = window.open("", "_blank");
    // if (!printWindow) {
    //   throw new Error("請允許彈出視窗");
    // }

    // const link = document.createElement('a');
    // link.href = imageData;
    // link.download = 'vue-html2canvas-demo.png';
    // link.click();

    // 寫入列印內容
    // printWindow.document.write(`
    //   <!DOCTYPE html>
    //   <html>
    //     <head>
    //       <title>列印設計 - ${designStore.designId}</title>
    //       <style>
    //         body {
    //           margin: 0;
    //           padding: 20px;
    //           display: flex;
    //           justify-content: center;
    //           align-items: center;
    //           font-family: system-ui, -apple-system, sans-serif;
    //         }
    //         .print-container {
    //           max-width: 100%;
    //           text-align: center;
    //         }
    //         .print-image {
    //           max-width: 100%;
    //           height: auto;
    //           box-shadow: 0 0 10px rgba(0,0,0,0.1);
    //         }
    //         .print-info {
    //           margin-top: 20px;
    //           padding: 20px;
    //           border-top: 1px solid #ccc;
    //           text-align: left;
    //         }
    //         .print-info h3 {
    //           margin: 0 0 10px 0;
    //           color: #333;
    //         }
    //         .print-info p {
    //           margin: 5px 0;
    //           color: #666;
    //         }
    //         @media print {
    //           body {
    //             padding: 0;
    //           }
    //           .print-image {
    //             max-width: 100%;
    //             box-shadow: none;
    //           }
    //           .print-info {
    //             border-top: 1px solid #000;
    //           }
    //         }
    //       </style>
    //     </head>
    //     <body>
    //       <div class="print-container">
    //         <img src="${imageData}" class="print-image" alt="設計預覽" />
    //         <div class="print-info">
    //           <h3>設計資訊</h3>
    //           <p><strong>盤子樣式：</strong>${designStore.currentPlate?.name || "未選擇"}</p>
    //           <p><strong>圖案數量：</strong>${designStore.placedPatterns.length} 個</p>
    //           <p><strong>設計時間：</strong>${designStore.designTime || new Date().toLocaleString()}</p>
    //           <p><strong>設計編號：</strong>${designStore.designId || "暫無"}</p>
    //         </div>
    //       </div>
    //       <script>
    //         // 自動開啟列印對話框
    //         window.onload = () => {
    //           setTimeout(() => {
    //             window.print()
    //             // 可以選擇是否關閉視窗
    //             // window.onafterprint = () => window.close()
    //           }, 500)
    //         }
    //       <\/script>
    //     </body>
    //   </html>
    // `);
  } catch (error) {
    console.error("列印失敗:", error);
    ElMessage.error("列印準備失敗，請稍後重試");
  } finally {
    isPrinting.value = false;
  }
};

// const printWindow = window.open('', '_blank')
const simplePrint = () => {
  if (!process.client) return;

  const printContent = document.querySelector(".final-preview");
  if (!printContent) return;

  const originalTitle = document.title;
  document.title = `設計列印 - ${designStore.designId}`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    ElMessage.error("無法打開列印窗口，請允許彈出窗口");
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>列印設計</title>
        <link rel="stylesheet" href="/assets/index.scss">
        <style>
          /* 複製您的主要樣式 */
          body { padding: 20px; }
          .final-preview { max-width: 1200px; margin: 0 auto; }
          @media print {
            .preview-controls { display: none; }
          }
        </style>
      </head>
      <body>
        ${printContent.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.onafterprint = () => printWindow.close();

  document.title = originalTitle;
};
</script>

<style scoped>
.preview-title {
  text-align: center;
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.final-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.preview-container {
  width: 500px;
  height: 500px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.preview-plate {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

.plate-pattern-container {
  position: absolute;
  /* cursor: move; */
  user-select: none;
  transition: transform 0.1s;
}

.plate-pattern {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.preview-controls {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.el-button:hover {
  transition: all 0.3s;
  transform: translateY(-2px);
}

@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }

  .preview-container {
    width: 400px;
    height: 400px;
  }
}

@media (max-width: 768px) {
  .plate-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .pattern-options {
    grid-template-columns: repeat(3, 1fr);
  }

  .preview-container {
    width: 350px;
    height: 350px;
  }

  .final-preview {
    flex-direction: column;
  }
}

/* @media (max-width: 480px) {
  .preview-container {
    width: 300px;
    height: 300px;
  }

  .buttons {
    flex-wrap: wrap;
  }

  .btn {
    flex: 1;
    justify-content: center;
  }
} */
/*
.plate-canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}*/
.preview-details {
  max-width: 500px;
  padding: 20px;
}

.detail-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #ddd;
}

.detail-label {
  font-weight: 600;
  color: #555;
  margin-bottom: 5px;
}

.detail-value {
  color: #2c3e50;
}

.pattern-list {
  margin-top: 10px;
}

.pattern-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
}

.pattern-list-icon {
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
