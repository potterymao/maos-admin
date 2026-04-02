import { defineConfig, presetUno, presetIcons, presetAttributify } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetAttributify(),
  ],
  theme: {
    colors: {
      primary: {
        50: "#f0f9ff",
        100: "#e0f2fe",
        500: "#0ea5e9",
        600: "#0284c7",
        700: "#0369a1",
      },
    },
  },
  shortcuts: {
    "btn-primary": "bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors",
    "btn-secondary": "bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors",
    "design-area": "border-2 border-dashed border-gray-300 rounded-lg relative",
    "control-panel": "bg-white border border-gray-200 rounded-lg shadow-sm p-4",
    "draggable-item": "absolute cursor-move select-none",
  },
});
