import { defineStore } from "pinia";
import { GetImage } from "@/api";
import type { Plate, PlateDesign, PlateStyle, Pattern, PlacedPattern, DesignState } from "~~/types";
import { pa } from "element-plus/es/locale/index.mjs";

export const useDesignStore = defineStore("design", {
  state: () => ({
    plates: [] as any[],
    currentMainPlate: null as Plate | null,
    currentPlate: null as Plate | null,
    nextPatternId: 1,
    showPreview: false,
    designId: "",
    designTime: "",
    patterns: [] as any[],
    placedPatterns: [] as PlacedPattern[],
    selectedPattern: null as PlacedPattern | null,
    designHistory: [] as PlateDesign[],
    addToCartPatterns: [] as any[],

    loading: false,
    error: null as string | null
  }),

  getters: {
    getPlateById: (state) => (id: string) => state.plates.find((plate) => plate.id === id),

    getPatternById: (state) => (id: string) => state.patterns.find((pattern) => pattern?.id.toString() === id),

    totalPatternsCount: (state) => state.placedPatterns.length,

    designPrice: (state) => {
      if (!state.currentPlate) return 0;
      const basePrice = state.currentPlate.price;
      const patternPrice = state.placedPatterns.reduce((sum, item) => sum + item.price, 0);
      // const patternPrice = state.placedPatterns.length * 5; // 每個圖案加5元
      return basePrice + patternPrice;
    },
  },

  actions: {
    // Get Plates
    async fetchPlates() {
      this.loading = true
      this.error = null

      const config = useRuntimeConfig()
      const categoryId = config.public.shoplinePlateId

      if (this.plates.length > 0) return;

      try {
        // 呼叫我們寫好的 Server API Proxy
        const response = await $fetch<any>('/api/shopline/products/search', {
          method: 'POST',
          query: { category_id: categoryId }
        })

        // 假設 Shopline 回傳的資料結構在 response.data
        this.SetPlates(response.data || response)
      } catch (err: any) {
        this.error = err.data?.message || '抓取資料失敗'
        console.error('Store fetchPlates Error:', err)
      } finally {
        this.loading = false
      }
    },

    // Get Patterns
    async fetchPatterns() {
      this.loading = true
      this.error = null

      const config = useRuntimeConfig()
      const categoryId = config.public.shoplinePatternId

      if (this.patterns.length > 0) return;

      try {
        // 呼叫我們寫好的 Server API Proxy
        const response = await $fetch<any>('/api/shopline/products/search', {
          method: 'POST',
          query: { category_id: categoryId }
        })

        // 假設 Shopline 回傳的資料結構在 response.data
        this.SetPatterns(response.data || response)
      } catch (err: any) {
        this.error = err.data?.message || '抓取資料失敗'
        console.error('Store fetchPatterns Error:', err)
      } finally {
        this.loading = false
      }
    },

    SetPlates(data: any) {
      this.plates = data;

      if (this.plates.length > 0 && !this.currentPlate) {
        if (this.plates[0].children[0]) {
          this.currentPlate = this.plates[0].children[0];
        }
      }
    },

    // Get Patterns
    SetPatterns(data: any) {
      this.patterns = data;
    },

    // async finishDesign() {
    //   const response = await AddToCart();
    // },

    // async urlToBase64(url: string) {
    //   const proxyUrl = `/image-proxy/${url.replace("https//img.shoplineapp.com/", "")}`;
    //   const response = await fetch(url);
    //   console.log(response);
    //   // const blob = await response.blob();
    //   // return new Promise((resolve, reject) => {
    //   //   const reader = new FileReader();
    //   //   reader.onloadend = () => resolve(reader.result);
    //   //   reader.onerror = reject;
    //   //   reader.readAsDataURL(blob);
    //   // });
    // },
    selectMainPlate(plateId: string) {
      const plate = this.getPlateById(plateId);
      if (plate) {
        this.currentMainPlate = plate;
      }
    },

    selectPlate(plateId: string) {
      // const plate = this.getPlateById(plateId);
      // const plate = this.plates.find((item) => {
      //   item.children.some((child: any) => child.id === plateId)
      // })
      if (this.currentMainPlate) {
        const plate = this.currentMainPlate?.children.find(child => child.id === plateId) || null;
        if (plate) {
          this.currentPlate = plate;
        }
      }
    },

    selectPattern(id: string) {
      this.placedPatterns.forEach((p) => {
        p.selected = p.id === id;
      });
      this.selectedPattern = this.placedPatterns.find((p) => p.id === id) || null;
    },

    // 選擇圖案後，將其置於最上層
    addPattern(patternId: string) {
      const pattern = this.getPatternById(patternId);
      if (!pattern || !this.currentPlate) return;

      const placedPattern = {
        id: `placed-${Date.now()}`,
        patternId: pattern.id,
        parentId: pattern.parent_id,
        image: pattern.image,
        name_zh: pattern.name_zh,
        name_en: pattern.name_en,
        price: pattern.price,
        price_label: pattern.price_label,
        // position: { x: this.currentPlate.size.width / 2 - pattern.defaultSize / 2, y: this.currentPlate.size.height / 2 - pattern.defaultSize / 2 },
        x: this.currentPlate.size.width / 2 - pattern.defaultSize / 2,
        y: this.currentPlate.size.height / 2 - pattern.defaultSize / 2,
        size: {
          width: pattern.size.width,
          height: pattern.size.height,
        },
        rotation: 0,
        angle: 0,
        scale: 1,
        zIndex: this.placedPatterns.length + 1,
        selected: false,
      };

      this.placedPatterns.push(placedPattern);

      this.addToCartPatterns.push({
        id: pattern.parent_id,
        variation_id: pattern.id,
      });
    },

    // 圖案移除後，同步更新購物車圖案列表
    removePattern(id: string) {
      const index = this.placedPatterns.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.placedPatterns.splice(index, 1);
        this.addToCartPatterns.splice(index, 1);
        if (this.selectedPattern?.id === id) {
          this.selectedPattern = null;
        }
      }
    },

    // selectPattern(index: number) {
    //   // 取消所有其他圖案的選中狀態
    //   this.patterns.forEach((p) => (p.selected = false));

    //   if (index >= 0 && index < this.patterns.length) {
    //     this.patterns[index].selected = true;
    //   }
    // },

    // removePattern(index: number) {
    //   if (index >= 0 && index < this.patterns.length) {
    //     this.patterns.splice(index, 1);
    //   }
    // },

    // updatePatternPosition(index: number, x: number, y: number) {
    //   if (index >= 0 && index < this.patterns.length) {
    //     this.patterns[index].x = Math.max(0, Math.min(500 - this.patterns[index].width, x));
    //     this.patterns[index].y = Math.max(0, Math.min(500 - this.patterns[index].height, y));
    //   }
    // },
    centerPattern(id: string) {
      const pattern = this.placedPatterns.find((p) => p.id === id);

      if (pattern) {
        const originPattern = this.getPatternById(pattern.patternId);
        if (!originPattern || !this.currentPlate) return;

        pattern.x = this.currentPlate.size.width / 2 - originPattern.defaultSize / 2;
        pattern.y = this.currentPlate.size.height / 2 - originPattern.defaultSize / 2;
      }
    },

    updatePatternPosition(id: string, x: number, y: number) {
      const pattern = this.placedPatterns.find((p) => p.id === id);
      if (pattern) {
        pattern.x = x;
        pattern.y = y;
      }
    },

    updatePatternRotation(id: string, rotation: number) {
      const pattern = this.placedPatterns.find((p) => p.id === id);
      if (pattern) {
        pattern.rotation = rotation;
      }
    },

    // 置頂 (最後)
    bringToFront(id: string) {
      const index = this.placedPatterns.findIndex((p) => p.id === id);
      const pattern = this.placedPatterns.find((p) => p.id === id);
      if (pattern && index >= 0 && index < this.placedPatterns.length) {
        this.placedPatterns.splice(index, 1);
        this.placedPatterns.push(pattern);
      }
    },

    // 置底 (最前)
    sendToBack(id: string) {
      const index = this.placedPatterns.findIndex((p) => p.id === id);
      const pattern = this.placedPatterns.find((p) => p.id === id);
      if (pattern && index) {
        this.placedPatterns.splice(index, 1);
        this.placedPatterns.unshift(pattern);
      }
    },

    // 上移
    bringForward(id: string) {
      const index = this.placedPatterns.findIndex((p) => p.id === id);
      const pattern = this.placedPatterns.find((p) => p.id === id);
      if (pattern && index >= 0 && index < this.placedPatterns.length - 1) {
        this.placedPatterns[index] = this.placedPatterns[index + 1];
        this.placedPatterns[index + 1] = pattern;
      }
    },

    // 下移
    sendBackward(id: string) {
      const index = this.placedPatterns.findIndex((p) => p.id === id);
      const pattern = this.placedPatterns.find((p) => p.id === id);
      if (pattern && index > 0 && index < this.placedPatterns.length) {
        this.placedPatterns[index] = this.placedPatterns[index - 1];
        this.placedPatterns[index - 1] = pattern;
      }
    },

    duplicatePattern(id: string) {
      const pattern = this.placedPatterns.find((p) => p.id === id);
      if (pattern) {
        const duplicate: any = {
          ...JSON.parse(JSON.stringify(pattern)),
          id: `placed-${Date.now()}`,
          x: pattern.x + 20,
          y: pattern.y + 20,
          selected: false,
        };

        this.placedPatterns.push(duplicate);
        this.selectPattern(duplicate.id);
      }
    },

    // 完成設計，顯示預覽並記錄設計時間
    finishDesign() {
      // 記錄設計時間
      // this.designTime = new Date().toLocaleString("zh-TW", { exportDesign });
      this.designTime = new Date().toLocaleString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      this.designId = `MaosD-${Date.now().toString(36).toUpperCase()}`;
      this.showPreview = true;
      // 滾動到預覽區域
      setTimeout(() => {
        const previewSection = document.querySelector(".preview-section");
        if (previewSection) {
          previewSection.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    },

    // 匯出設計為 JSON 檔案
    exportDesign() {      
      const designData = {
        plate: this.currentPlate,
        patterns: this.placedPatterns,
        designId: this.designId,
        timestamp: new Date().toISOString(),
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(designData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `plate-design-${this.designId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      // alert(`設計已匯出為 JSON 檔案: plate-design-${this.designId}.json`);
    },

    // 列印設計
    printDesign() {
      window.print();
    },

    // updatePatternSize(index: number, width: number, height: number) {
    //   if (index >= 0 && index < this.patterns.length) {
    //     const pattern = this.patterns[index];
    //     const minSize = 20;
    //     const maxSize = 300;

    //     pattern.width = Math.max(minSize, Math.min(maxSize, width));
    //     pattern.height = Math.max(minSize, Math.min(maxSize, height));

    //     // 確保不超出邊界
    //     pattern.x = Math.max(0, Math.min(500 - pattern.width, pattern.x));
    //     pattern.y = Math.max(0, Math.min(500 - pattern.height, pattern.y));
    //   }
    // },

    // updatePatternRotation(index: number, rotation: number) {
    //   if (index >= 0 && index < this.patterns.length) {
    //     this.patterns[index].rotation = rotation % 360;
    //   }
    // },

    // centerPattern(index: number) {
    //   if (index >= 0 && index < this.patterns.length) {
    //     const pattern = this.patterns[index];
    //     pattern.x = 250 - pattern.width / 2;
    //     pattern.y = 250 - pattern.height / 2;
    //   }
    // },

    // duplicatePattern(index: number) {
    //   if (index >= 0 && index < this.patterns.length) {
    //     const original = this.patterns[index];
    //     const duplicate: PlacedPattern = {
    //       ...JSON.parse(JSON.stringify(original)),
    //       id: this.nextPatternId++,
    //       x: original.x + 20,
    //       y: original.y + 20,
    //       selected: false,
    //     };

    //     this.patterns.push(duplicate);
    //     this.selectPattern(this.patterns.length - 1);
    //   }
    // },

    // bringToFront(index: number) {
    //   if (index >= 0 && index < this.patterns.length) {
    //     const pattern = this.patterns.splice(index, 1)[0];
    //     this.patterns.push(pattern);
    //     this.selectPattern(this.patterns.length - 1);
    //   }
    // },

    // sendToBack(index: number) {
    //   if (index >= 0 && index < this.patterns.length) {
    //     const pattern = this.patterns.splice(index, 1)[0];
    //     this.patterns.unshift(pattern);
    //     this.selectPattern(0);
    //   }
    // },

    // bringForward(index: number) {
    //   if (index >= 0 && index < this.patterns.length - 1) {
    //     const temp = this.patterns[index];
    //     this.patterns[index] = this.patterns[index + 1];
    //     this.patterns[index + 1] = temp;
    //     this.selectPattern(index + 1);
    //   }
    // },

    // sendBackward(index: number) {
    //   if (index > 0 && index < this.patterns.length) {
    //     const temp = this.patterns[index];
    //     this.patterns[index] = this.patterns[index - 1];
    //     this.patterns[index - 1] = temp;
    //     this.selectPattern(index - 1);
    //   }
    // },

    resetPlate() {
      // this.patterns = [];
      this.nextPatternId = 1;
      this.selectedPattern = null;
      this.showPreview = false;
      this.placedPatterns = [];
    },

    // finishDesign() {
    //   this.designTime = new Date().toLocaleString("zh-TW", {
    //     year: "numeric",
    //     month: "long",
    //     day: "numeric",
    //     hour: "2-digit",
    //     minute: "2-digit",
    //   });

    //   this.designId = `DES-${Date.now().toString(36).toUpperCase()}`;
    //   this.showPreview = true;
    // },

    // exportDesign() {
    //   const designData = {
    //     plate: this.currentPlate,
    //     patterns: this.placedPatterns,
    //     designId: this.designId,
    //     timestamp: new Date().toISOString(),
    //   };

    //   const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(designData, null, 2));
    //   const downloadAnchor = document.createElement("a");
    //   downloadAnchor.setAttribute("href", dataStr);
    //   downloadAnchor.setAttribute("download", `plate-design-${this.designId}.json`);
    //   document.body.appendChild(downloadAnchor);
    //   downloadAnchor.click();
    //   document.body.removeChild(downloadAnchor);
    // },
  },
});