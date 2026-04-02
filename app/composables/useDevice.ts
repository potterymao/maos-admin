import { computed } from "vue";
import { useAppStore } from "@/stores/app";
import { DeviceEnum } from "./app-key"

const appStore = useAppStore()

const isMobile = computed(() => appStore.device === DeviceEnum.Mobile)
const isDesktop = computed(() => appStore.device === DeviceEnum.Desktop)

/** 设备类型 Composable */
export function useDevice() {
  return { isMobile, isDesktop }
}
