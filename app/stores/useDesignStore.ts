import { defineStore } from "pinia";
import { GetPlates, GetPatterns } from "@/api";
import type { Plate, PlateDesign, PlateStyle, Pattern, PlacedPattern, DesignState } from "~~/types";

export const useDesignStore = defineStore("design", {
  state: () => ({
    plates: [] as any[],
    currentPlate: null as Plate | null,
    nextPatternId: 1,
    showPreview: false,
    designId: "",
    designTime: "",
    patterns: [] as any[],
    placedPatterns: [] as PlacedPattern[],
    selectedPattern: null as PlacedPattern | null,
    designHistory: [] as PlateDesign[],
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
    // Get Plates API
    async loadPlates() {
      this.plates = [];
      this.currentPlate = null;
      const response = await GetPlates();
      // console.log("Loaded plates:", response.items);
      response.items.forEach((item: any) => {
        this.plates.push({
          id: item.id,
          name_en: item.title_translations.en,
          name_zh: item.title_translations["zh-hant"],
          image: item.medias?.[0]?.images.source.url || "",
          type: item.type,
          size: { width: 350, height: 350 },
          price: item.price.dollar || 300,
        });
      });

      // console.log("Loaded plates:", this.plates);
      // 模擬API調用
      // this.plates = [
      //   {
      //     id: "1",
      //     name: "經典白瓷",
      //     type: "white",
      //     size: { width: 300, height: 300 },
      //     icon: "i-mdi-circle",
      //     iconColor: "#f0f0f0",
      //     color: "#ffffff",
      //     shadowColor: "rgba(0,0,0,0.1)",
      //     price: 199,
      //   },
      //   {
      //     id: "2",
      //     name: "粉色瓷盤",
      //     type: "pink",
      //     icon: "i-mdi-circle",
      //     iconColor: "#f48fb1",
      //     color: "#f8bbd0",
      //     shadowColor: "rgba(244,143,177,0.3)",
      //     size: { width: 290, height: 290 },
      //     price: 189,
      //   },
      //   {
      //     id: "3",
      //     name: "金色邊盤",
      //     type: "golden",
      //     icon: "i-mdi-circle-outline",
      //     iconColor: "#ffd54f",
      //     color: "#fff9c4",
      //     shadowColor: "rgba(255,213,79,0.3)",
      //     size: { width: 350, height: 350 },
      //     price: 299,
      //   },
      // ];

      if (this.plates.length > 0 && !this.currentPlate) {
        if (this.plates[0]) {
          this.currentPlate = this.plates[0];
        }
      }
    },

    // Get Patterns API
    async loadPatterns() {
      this.patterns = [];
      const response = await GetPatterns();
      // console.log("Loaded patterns:", response.items);
      response.items.forEach((item: any) => {
        this.patterns.push({
          id: item.id,
          name_en: item.title_translations["en"],
          name_zh: item.title_translations["zh-hant"],
          price: item.price.dollar || 0,
          type: item.type,
          category: item.category_id,
          image: item.medias?.[0]?.images.source.url || "",
          size: { width: 30, height: 30 },
          defaultSize: 50,
        });
      });

      // 模擬圖案數據
      // this.patterns = [
      //   {
      //     id: "p1",
      //     name: "花朵",
      //     category: "flower",
      //     // image: "/patterns/flower.svg",
      //     size: { width: 40, height: 40 },
      //     // svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#FF6B6B"/></svg>',
      //     defaultSize: 50,
      //     price: 50,
      //     // color: "#FF6B6B",
      //   },
      //   {
      //     id: "p2",
      //     name: "幾何圖形",
      //     category: "geometric",
      //     image: "/patterns/star.svg",
      //     size: { width: 30, height: 30 },
      //     // svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 95,35 95,85 50,115 5,85 5,35" fill="#4ECDC4"/></svg>',
      //     defaultSize: 50,
      //     price: 50,
      //   },
      //   {
      //     id: "p3",
      //     name: "動物圖案",
      //     category: "animal",
      //     image: "/patterns/animal.svg",
      //     size: { width: 20, height: 40 },
      //     // svg: '<svg viewBox="0 0 100 100"><path d="M50,20 Q70,30 80,50 Q70,70 50,80 Q30,70 20,50 Q30,30 50,20" fill="#FFD166"/></svg>',
      //     defaultSize: 50,
      //     price: 50,
      //   },
      //   {
      //     id: "p4",
      //     name: "愛心",
      //     category: "heart",
      //     image: "/patterns/heart.svg",
      //     size: { width: 20, height: 40 },
      //     // svg: '<svg viewBox="0 0 100 100"><path d="M50,20 Q70,30 80,50 Q70,70 50,80 Q30,70 20,50 Q30,30 50,20" fill="#FFD166"/></svg>',
      //     defaultSize: 50,
      //     price: 50,
      //   },
      // ];
    },

    selectPlate(plateId: string) {
      const plate = this.getPlateById(plateId);
      if (plate) {
        this.currentPlate = plate;
      }
    },

    selectPattern(id: string) {
      this.placedPatterns.forEach((p) => {
        p.selected = p.id === id;
      });
      this.selectedPattern = this.placedPatterns.find((p) => p.id === id) || null;
    },

    // addPattern(pattern: Pattern) {
    //   const newPattern: PlacedPattern = {
    //     id: this.nextPatternId++,
    //     patternId: pattern.id,
    //     name: pattern.name,
    //     image: pattern.image,
    //     width: 80,
    //     height: 80,
    //     x: 210,
    //     y: 210,
    //     rotation: 0,
    //     scale: 1,
    //     zIndex: this.patterns.length + 1,
    //     selected: false,
    //   };

    //   // 取消所有其他圖案的選中狀態
    //   this.patterns.forEach((p) => (p.selected = false));
    //   newPattern.selected = true;

    //   this.patterns.push(newPattern);
    // },

    addPattern(patternId: string) {
      const pattern = this.getPatternById(patternId);
      if (!pattern || !this.currentPlate) return;

      const placedPattern = {
        id: `placed-${Date.now()}`,
        patternId: pattern.id,
        image: pattern.image,
        name: pattern.name,
        price: pattern.price,
        // position: { x: this.currentPlate.size.width / 2 - pattern.defaultSize / 2, y: this.currentPlate.size.height / 2 - pattern.defaultSize / 2 },
        x: this.currentPlate.size.width / 2 - pattern.defaultSize / 2,
        y: this.currentPlate.size.height / 2 - pattern.defaultSize / 2,
        size: {
          width: pattern.size.width,
          height: pattern.size.height,
        },
        rotation: 0,
        scale: 1,
        zIndex: this.placedPatterns.length + 1,
        selected: false,
      };

      this.placedPatterns.push(placedPattern);
    },

    removePattern(id: string) {
      const index = this.placedPatterns.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.placedPatterns.splice(index, 1);
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

    exportDesign() {
      // 匯出設計資料
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

    // printDesign() {
    //   window.print()
    // }

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

// import { defineStore } from "pinia";
// import type { Plate, Pattern, PlacedPattern, PlateDesign } from "~~/types";
// import type { Plate, PlateDesign } from "~~/types";

// export const usePlateDesignerStore = defineStore("plateDesigner", {
//   state: () => ({
//     plates: [] as Plate[],
//     patterns: [] as Pattern[],
//     currentPlate: null as Plate | null,
//     placedPatterns: [] as PlacedPattern[],
//     selectedPattern: null as PlacedPattern | null,
//     designHistory: [] as PlateDesign[],
//     backgroundColor: "#FFFFFF",
//     previewMode: false,
//   }),

//   getters: {
//     getPlateById: (state) => (id: string) => state.plates.find((plate) => plate.id === id),

//     getPatternById: (state) => (id: string) => state.patterns.find((pattern) => pattern.id.toString() === id),

//     totalPatternsCount: (state) => state.placedPatterns.length,

//     designPrice: (state) => {
//       if (!state.currentPlate) return 0;
//       const basePrice = state.currentPlate.price;
//       const patternPrice = state.placedPatterns.length * 5; // 每個圖案加5元
//       return basePrice + patternPrice;
//     },
//   },

//   actions: {
//     async loadPlates() {
//       // 模擬API調用
//       this.plates = [
//         {
//           id: "1",
//           name: "經典白瓷盤",
//           type: "round",
//           size: { width: 300, height: 300 },
//           color: "#F5F5DC",
//           // image: "/images/plates/round-ceramic.png",
//           icon: "fas fa-circle",
//           iconColor: "#f0f0f0",
//           price: 199,
//         },
//         {
//           id: "2",
//           name: "木紋盤",
//           type: "square",
//           size: { width: 250, height: 250 },
//           color: "#DEB887",
//           // image: "/images/plates/square-wood.png",
//           icon: "fas fa-circle",
//           iconColor: "#d4b483",
//           price: 249,
//         },
//         {
//           id: "3",
//           name: "橢圓大理石盤",
//           type: "oval",
//           size: { width: 350, height: 200 },
//           color: "#C0C0C0",
//           // image: "/images/plates/oval-marble.png",
//           icon: "fas fa-circle",
//           iconColor: "#D2691E",
//           price: 399,
//         },
//       ];

//       if (this.plates.length > 0 && !this.currentPlate) {
//         if (this.plates[0]) {
//           this.currentPlate = this.plates[0];
//         }
//       }
//     },

//     async loadPatterns() {
//       // 模擬圖案數據
//       this.patterns = [
//         {
//           id: "p1",
//           name: "玫瑰花",
//           category: "flower",
//           svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#FF6B6B"/></svg>',
//           thumbnail: "/images/patterns/rose.svg",
//           defaultSize: 50,
//           color: "#FF6B6B",
//         },
//         {
//           id: "p2",
//           name: "幾何圖形",
//           category: "geometric",
//           svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 95,35 95,85 50,115 5,85 5,35" fill="#4ECDC4"/></svg>',
//           thumbnail: "/images/patterns/hexagon.svg",
//           defaultSize: 50,
//           color: "#4ECDC4",
//         },
//         {
//           id: "p3",
//           name: "動物圖案",
//           category: "animal",
//           svg: '<svg viewBox="0 0 100 100"><path d="M50,20 Q70,30 80,50 Q70,70 50,80 Q30,70 20,50 Q30,30 50,20" fill="#FFD166"/></svg>',
//           thumbnail: "/images/patterns/animal.svg",
//           defaultSize: 50,
//           color: "#FFD166",
//         },
//       ];
//     },

//     selectPlate(plateId: string) {
//       const plate = this.getPlateById(plateId);
//       if (plate) {
//         this.currentPlate = plate;
//       }
//     },

//     addPattern(patternId: string) {
//       const pattern = this.getPatternById(patternId);
//       if (!pattern || !this.currentPlate) return;

//       const placedPattern: PlacedPattern = {
//         id: `placed-${Date.now()}`,
//         patternId: pattern.id,
//         image: pattern.image,
//         name: pattern.name,
//         x: this.currentPlate.size.width / 2 - pattern.defaultSize / 2,
//         y: this.currentPlate.size.height / 2 - pattern.defaultSize / 2,
//         rotation: 0,
//         scale: 1,
//         zIndex: this.placedPatterns.length + 1,
//         selected: false,
//       };

//       this.placedPatterns.push(placedPattern);
//     },

//     updatePatternPosition(patternId: string, x: number, y: number) {
//       const pattern = this.placedPatterns.find((p) => p.id === patternId);
//       if (pattern) {
//         pattern.x = x;
//         pattern.y = y;
//       }
//     },

//     updatePatternRotation(patternId: string, rotation: number) {
//       const pattern = this.placedPatterns.find((p) => p.id === patternId);
//       if (pattern) {
//         pattern.rotation = rotation;
//       }
//     },

//     updatePatternScale(patternId: string, scale: number) {
//       const pattern = this.placedPatterns.find((p) => p.id === patternId);
//       if (pattern) {
//         pattern.scale = scale;
//       }
//     },

//     selectPattern(patternId: string) {
//       this.placedPatterns.forEach((p) => {
//         p.selected = p.id === patternId;
//       });
//       this.selectedPattern = this.placedPatterns.find((p) => p.id === patternId) || null;
//     },

//     deletePattern(patternId: string) {
//       const index = this.placedPatterns.findIndex((p) => p.id === patternId);
//       if (index !== -1) {
//         this.placedPatterns.splice(index, 1);
//         if (this.selectedPattern?.id === patternId) {
//           this.selectedPattern = null;
//         }
//       }
//     },

//     clearAllPatterns() {
//       this.placedPatterns = [];
//       this.selectedPattern = null;
//     },

//     saveDesign() {
//       if (!this.currentPlate) return;

//       const design: PlateDesign = {
//         plateId: this.currentPlate.id,
//         plateType: this.currentPlate.type,
//         patterns: [...this.placedPatterns],
//         backgroundColor: this.backgroundColor,
//         createdAt: new Date(),
//       };

//       this.designHistory.unshift(design);
//       return design;
//     },

//     setBackgroundColor(color: string) {
//       this.backgroundColor = color;
//     },

//     togglePreviewMode() {
//       this.previewMode = !this.previewMode;
//     },
//   },
// });
