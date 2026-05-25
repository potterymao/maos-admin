<template>
  <div class="preview-section mt-28 pt-6 border-t border-gray-200">
    <h2 class="preview-title flex items-center justify-center gap-4 mt-20 mb-10 text-4xl md:text-5xl">
      <Icon name="material-symbols:check-circle-rounded" class="text-3xl" />
      {{ $t("_designer.design_complete") }}
    </h2>

    <div ref="printContainerRef">
      <div class="final-preview mt-20 py-8 font-mono">
        <div class="preview-container flex flex-wrap p-2" ref="printContentRef">
          <div v-for="(plate, i) in designStore.currentMainPlate?.children">
            <div class="preview-plate" :style="{
              width: plate.size.width + 'px',
              height: plate.size.height + 'px',
              '-webkit-mask-image': plate.image ? `url(${plate.image})` : 'none',
              'mask-image': plate.image ? `url(${plate.image})` : 'none',
              '-webkit-mask-repeat': 'no-repeat',
              'mask-repeat': 'no-repeat',
              '-webkit-mask-size': 'contain',
              'mask-size': 'contain',
              '-webkit-mask-position': 'center',
              'mask-position': 'center',
              'position': 'relative',
              'overflow': 'hidden' /* 保險起見加上 overflow */
            }">
              <div class="plate-background-image" :style="{
                backgroundImage: plate.image ? `url(${plate.image})` : 'none',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                position: 'absolute',
                inset: 0,
                zIndex: 0
              }"></div>

              <div v-for="pattern in designStore.totalPatterns[i]" :key="pattern.id + '-preview'"
                class="plate-pattern-container" :style="{
                  position: 'absolute',
                  left: pattern.x / 2 + 'px',
                  top: pattern.y / 2 + 'px',
                  transform: `rotate(${pattern.rotation}deg) scale(${pattern.scale})`,
                  width: pattern.size.width * 1.3 + 'px',
                  height: pattern.size.height * 1.3 + 'px',
                  zIndex: 1
                }">
                <div class="plate-pattern" :style="{
                  backgroundImage: `url(${pattern.image})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  height: '100%'
                }" />
              </div>
            </div>

          </div>
        </div>


        <!-- </div>

      <div class="final-preview"> -->
        <div class="preview-details mt-2" ref="printDetailRef">
          <div class="mb-12 pb-3 border-b border-gray-200 detail-item">
            <div class="text-sm font-bold text-gray-500 mb-1">盤子樣式</div>
            <div class="text-lg font-semibold text-gray-800">
              {{
                appStore.locale === "zh-TW"
                  ? designStore.currentMainPlate?.name_zh
                  : designStore.currentMainPlate?.name_en
              }}
            </div>
          </div>

          <div class="mb-12 pb-3 border-b border-gray-200 detail-item">
            <div class="text-sm font-bold text-gray-500 mb-1">圖案數量</div>
            <div class="text-lg font-semibold text-gray-800">
              {{ totalCartPatterns.length }} 個
            </div>
            <div class="mt-2 space-y-1">
              <div v-for="pattern in totalCartPatterns" :key="pattern.id"
                class="flex items-center justify-center gap-2 text-sm text-gray-600">
                <!-- <div class="bg-center bg-no-repeat bg-contain"
                  :style="{ backgroundImage: `url(${pattern.image})` }"></div> -->
                <div class="flex justify-between w-full">
                  <span class="font-bold"> {{
                    appStore.locale === "zh-TW" ? pattern.name_zh : pattern.name_en }} </span>
                  <span class="font-bold">{{ $t("currency") }} {{ pattern.price }} </span>
                </div>
              </div>
              <div class="flex items-center justify-between gap-2 mt-4 text-sm font-bold text-gray-800">
                <span>{{ $t("_designer.total_price") }}:</span>
                <span class="text-lg">${{ designStore.designPrice }}</span>
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
    </div>

    <div class="preview-controls">
      <el-button @click="downloadImage" type="success" class="text-xl">
        <Icon name="material-symbols:download-rounded" class="text-xl mr-1" />
        下載圖片
      </el-button>
      <el-button @click="printDesign" class="text-xl">
        <Icon name="material-symbols:print-rounded" class="text-xl mr-1" />
        列印設計
      </el-button>
      <el-button @click="finishDesign" type="primary" class="text-xl">
        <Icon name="material-symbols:shopping-cart-outline" class="text-xl mr-1" />
        加到購物車
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import html2canvas from "html2canvas-pro";

import { AddToCart } from "@/api";

const appStore = useAppStore();
const designStore = useDesignStore();

const totalCartPatterns = computed(() => designStore.totalCartPatterns);
// const currentPlate = computed(() => designStore.currentPlate);
// const placedPatterns = computed(() => designStore.placedPatterns);

const getImageUrl = (imagePath: string) => {
  if (process.client) {
    return `${window.location.origin}${imagePath}`;
  }
  return imagePath;
};

// const getPatterns = async () => {
//   const response = await GetPatterns();
//   if(response && response.items) {
//     designStore.SetPatterns(response);
//   }
// // //   console.log("Fetched patterns:", response);
// // //   // return response;
// };
// getPatterns();

// 計算圖案尺寸
// const getPatternSize = (patternId: string) => {
//   const pattern = designStore.getPatternById(patternId);
//   return pattern?.defaultSize || 50;
// };

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
//   // ElMessage.info("圖片下載功能需配合 html2canvas 等庫實現");
//   // // 實際實現：
//   // import html2canvas from 'html2canvas'
//   const plateElement = document.querySelector('.preview-plate') as HTMLElement
//   if (plateElement) {
//     html2canvas(plateElement).then(canvas => {
//       const link = document.createElement('a')
//       link.download = `plate-design-${designStore.designId}.png`
//       link.href = canvas.toDataURL('image/png')
//       link.click()
//     })
//   }
// };
const isDownloading = ref(false);
const isPrinting = ref(false);

// const preloadImages = async (element: Element) => {
//   // 找出所有有背景圖片的元素
//   const elementsWithBg = element.querySelectorAll('[style*="background-image"]');
//   const promises: any = [];

//   elementsWithBg.forEach((el: Element) => {
//     const style = window.getComputedStyle(el);
//     const bgImage = style.backgroundImage;
//     if (bgImage && bgImage !== "none") {
//       const url = bgImage.replace(/^url\(["']?|["']?\)$/g, "");
//       if (url) {
//         const promise = new Promise((resolve, reject) => {
//           const img = new Image();
//           img.crossOrigin = "anonymous";
//           img.onload = resolve;
//           img.onerror = reject;
//           img.src = url;
//         });
//         promises.push(promise);
//       }
//     }
//   });

//   await Promise.all(promises);
// };

const downloadImage = async () => {
  if (!process.client) return;

  isDownloading.value = true;

  try {
    const element = document.querySelector(".final-preview") as HTMLElement;
    if (!element) throw new Error("找不到預覽元素");

    ElMessage.info("正在生成圖片，請稍候...");

    // 預加載所有圖片
    // await preloadImages(element);

    // 生成圖片
    // const canvas = await html2canvas(element, {
    const canvas = await html2canvas(printContainerRef.value, {
      scale: 4, // 4倍解析度
      backgroundColor: "#ffffff",
      allowTaint: false,
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // 下載圖片
    const link = document.createElement("a");
    link.download = `design-${designStore.designId || Date.now()}.jpg`;
    link.href = canvas.toDataURL("image/jpeg");
    link.click();

    ElMessage.success("圖片下載成功！");
  } catch (error) {
    console.error("下載失敗:", error);
    ElMessage.error("下載失敗，請稍後重試");
  } finally {
    isDownloading.value = false;
  }
};

const finishDesign = async () => {
  // ElMessage.success("感謝您的設計！我們將盡快與您聯繫確認訂單細節。");

  // 最後加入器型到購物車列表
  designStore.addToCart.push({
    id: designStore.currentMainPlate?.id,
    variation_id: designStore.currentMainPlate?.children[0]?.id,
  })

  // console.log("Final cart items:", designStore.addToCart);
  const response = await AddToCart(designStore.addToCart);
  if (response) {
    window.open(response.link, "_blank");
    ElMessage.success("已成功加入購物車！");
  } else {
    ElMessage.error("加入購物車失敗，請稍後重試");
  }

  designStore.finishDesign();
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
    // const dpr = window.devicePixelRatio || 3;
    // 獲取元素實際尺寸
    const rect = printContent.getBoundingClientRect();

    const canvas = await html2canvas(printContent, {
      scale: 3, // 提高解析度
      // backgroundColor: null, // 保留透明背景
      allowTaint: false,
      useCORS: true, // 允許跨域圖片
      // logging: false,
      // width: rect.width,
      // height: rect.height,
      // width: printContent.scrollWidth,
      // height: printContent.scrollHeight,
      // windowHeight: rect.height,
      onclone: (clonedDoc, clonedElement) => {
        const clonedIcons = clonedDoc.querySelectorAll(".plate-pattern-container");
        clonedIcons.forEach((icon: any) => {
          icon.style.width = icon.clientWidth * 1 + "px";
          icon.style.height = icon.clientHeight * 1 + "px";
          icon.style.backgroundSize = "contain";
        });
        // clonedDoc.documentElement.style.height = rect.height + "px";
        // 在克隆的文件中強制保留背景
        // clonedElement.style.width = rect.width + "px";
        // clonedElement.style.height = rect.height + "px";
        (clonedElement.style as any).webkitPrintColorAdjust = "exact";
        clonedElement.style.printColorAdjust = "exact";
      },
    });

    const rect_detail = printDetail.getBoundingClientRect();
    const canvas_detail = await html2canvas(printDetail, {
      scale: 2, // 提高解析度
      // backgroundColor: null, // 保留透明背景
      allowTaint: false,
      useCORS: true, // 允許跨域圖片
      // logging: false,
      // windowWidth: printContainer.scrollWidth,
      // windowHeight: printContainer.scrollHeight,
      // onclone: (clonedDoc, clonedElement) => {
      //   const clonedIcons = clonedDoc.querySelectorAll(".detail-item");
      //   clonedIcons.forEach((item: any) => {
      //     item.style.width = item.clientWidth * 1 + "px";
      //     item.style.height = item.clientHeight * 1 + "px";
      //     item.style.backgroundSize = "contain";
      //   });
      //   // 在克隆的文件中強制保留背景
      //   (clonedElement.style as any).webkitPrintColorAdjust = "exact";
      //   clonedElement.style.printColorAdjust = "exact";
      // },
    });

    const design_image = canvas.toDataURL("image/jpg");

    const design_detail = canvas_detail.toDataURL("image/jpg");

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
                <img src="${design_image}" style="width: ${rect.width}px; margin: 0 auto; margin-top:20px; display: flex;" />
                <img src="${design_detail}" style="width: ${rect_detail.width}px; margin: 0 auto; margin-top:10px; display: flex;" /> 
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
// const simplePrint = () => {
//   if (!process.client) return;

//   const printContent = document.querySelector(".final-preview");
//   if (!printContent) return;

//   const originalTitle = document.title;
//   document.title = `設計列印 - ${designStore.designId}`;

//   const printWindow = window.open("", "_blank");
//   if (!printWindow) {
//     ElMessage.error("無法打開列印窗口，請允許彈出窗口");
//     return;
//   }
//   printWindow.document.write(`
//     <html>
//       <head>
//         <title>列印設計</title>
//         <link rel="stylesheet" href="/assets/index.scss">
//         <style>
//           /* 複製您的主要樣式 */
//           body { padding: 20px; }
//           .final-preview { max-width: 1200px; margin: 0 auto; }
//           @media print {
//             .preview-controls { display: none; }
//           }
//         </style>
//       </head>
//       <body>
//         ${printContent.outerHTML}
//       </body>
//     </html>
//   `);

//   printWindow.document.close();
//   printWindow.focus();
//   printWindow.print();
//   printWindow.onafterprint = () => printWindow.close();

//   document.title = originalTitle;
// };
</script>

<style scoped>
.preview-title {
  text-align: center;
  /* font-size: 2.8rem; */
  color: #2c3e50;
  /* margin-bottom: 20px; */
}

.final-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
  /* padding: 40px; */
}

.preview-container {
  max-width: 400px;
  /* max-height: 500px; */
  position: relative;
  /* overflow: hidden; */
  gap: 40px;
  /* border-radius: 50%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15); */
}

.preview-plate {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  /* 让蒙版包含所有内容 */
  -webkit-mask-size: contain;
  mask-size: contain;
  /* 核心：自动裁掉超出蒙版的内容 */
  -webkit-mask-mode: alpha;
  mask-mode: alpha;
  z-index: 1;
}

.plate-pattern-container {
  position: absolute;
  user-select: none;
  transition: transform 0.1s;
}

.plate-pattern {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
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
    /* height: 400px; */
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
