import { reactive, ref, watch } from "vue";
import { defineStore } from "pinia";
// import { getSidebarStatus, setSidebarStatus, getLocale, setLocale } from "@/utils/local-storage";
// import { DeviceEnum, SIDEBAR_OPENED, SIDEBAR_CLOSED } from "@/config/app-key";

interface Sidebar {
  opened: boolean;
  withoutAnimation: boolean;
}

/** Sidebar */
function handleSidebarStatus(opened: boolean) {
  opened ? setSidebarStatus(SIDEBAR_OPENED) : setSidebarStatus(SIDEBAR_CLOSED);
}

export const useAppStore = defineStore("app", () => {
  const routeKey = ref<number>(0);

  /** 設備類型 */
  const device = ref<DeviceEnum>(DeviceEnum.Desktop);

  const title = import.meta.env.VITE_APP_TITLE;

  const locale = ref<string>(getLocale() || "zh-TW");

  const sidebar: Sidebar = reactive({
    opened: getSidebarStatus() !== SIDEBAR_CLOSED,
    withoutAnimation: false,
  });

  const firstPage = ref<string>("");

  /** 監聽 sidebar.opened */
  watch(
    () => sidebar.opened,
    (opened) => handleSidebarStatus(opened),
  );

  const toggleSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = !sidebar.opened;
    sidebar.withoutAnimation = withoutAnimation;
  };

  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = false;
    sidebar.withoutAnimation = withoutAnimation;
  };
  const toggleDevice = (value: DeviceEnum) => {
    device.value = value;
  };

  const setCurrentLocale = (value: string) => {
    locale.value = value;
    setLocale(value);
  };

  const setFirestPage = (value: string) => {
    firstPage.value = value;
  }

  return { routeKey, device, title, sidebar, locale, firstPage, toggleSidebar, closeSidebar, toggleDevice, setCurrentLocale, setFirestPage };
});
