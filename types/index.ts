// // 圖案類型
// export interface Pattern {
//   id: string
//   name: string
//   imageUrl: string
//   category: 'animal' | 'flower' | 'geometric' | 'text' | 'custom'
//   size: {
//     width: number
//     height: number
//   }
//   color?: string
// }

// // 盤子類型
// export interface Plate {
//   id: string
//   name: string
//   imageUrl: string
//   type: 'round' | 'square' | 'oval' | 'rectangle'
//   size: {
//     diameter: number
//     depth: number
//   }
//   color: string
//   price: number
// }

// // 設計中的圖案項目
// export interface PatternItem {
//   id: string
//   patternId: string
//   position: {
//     x: number
//     y: number
//   }
//   rotation: number
//   scale: number
//   zIndex: number
//   pattern: Pattern
// }

// // 設計狀態
// export interface DesignState {
//   selectedPlate: Plate | null
//   patterns: PatternItem[]
//   currentPattern: Pattern | null
//   scale: number
//   previewMode: boolean
// }

// // 拖曳事件
// export interface DragEvent {
//   position: {
//     x: number
//     y: number
//   }
//   element: PatternItem
// }

// i18n 語言類型
export type Locale = "zh-TW" | "en";

// API 回應類型
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// 盤子類型
export interface Plate {
  id: string;
  name: string;
  type: "white" | "pink" | "golden";
  size: {
    width: number;
    height: number;
  };
  image: string;
  icon: string;
  iconColor: string;
  color: string;
  shadowColor: string;
  price: number;
}

// 圖案類型
export interface Pattern {
  id: string;
  name: string;
  category: "animal" | "flower" | "geometric" | "text" | "custom";
  image: string;
  // svg: string;
  // thumbnail: string;
  defaultSize: number;
  size: { width: number; height: number };
  position?: { x: number; y: number };
  price: number;
  // color: string;
}

// export interface PlacedPattern {
//   id: string;
//   patternId: string;
//   x: number;
//   y: number;
//   rotation: number;
//   scale: number;
//   zIndex: number;
//   selected: boolean;
// }

export interface PlacedPattern {
  id: string;
  patternId: string;
  image: string;
  name: string;
  price: number;
  x: number;
  y: number;
  size: {
    width: number;
    height: number;
  };
  rotation: number;
  scale: number;
  zIndex: number;
  selected: boolean;
}

export interface PlateDesign {
  plateId: string;
  plateType: string;
  patterns: PlacedPattern[];
  backgroundColor: string;
  createdAt: Date;
}

export interface PlateStyle {
  id: string;
  name: string;
  color: string;
  icon: string;
  iconColor: string;
  shadowColor: string;
}

export interface DesignState {
  selectedPlate: PlateStyle;
  patterns: PlacedPattern[];
  nextPatternId: number;
  showPreview: boolean;
  designId: string;
  designTime: string;
}

export interface ResizeData {
  patternIndex: number;
  direction: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  startWidth: number;
  startHeight: number;
  startX: number;
  startY: number;
  clientX: number;
  clientY: number;
}

export interface RotateData {
  patternIndex: number;
  startRotation: number;
  centerX: number;
  centerY: number;
  startAngle: number;
}
