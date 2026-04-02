import { onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { useAppStore } from "@/stores/app";
// import { useRouteListener } from "./useRouteListener";
import { DeviceEnum } from "./app-key";

/** 参考 Bootstrap 的RWD將最大mobile寬度設置為 992 */
const MAX_MOBILE_WIDTH = 992;

/** 根據瀏覽器寬度變化，變換 Layout */
// export default () => {
export function useResize() {
  const appStore = useAppStore();
  // const { listenerRouteChange } = useRouteListener();

  /** 判斷目前設備是否為Mobile */
  const isMobile = () => {
    const rect = document.body.getBoundingClientRect();
    return rect.width - 1 < MAX_MOBILE_WIDTH;
  };

  /** 處理窗口大小變化事件 */
  const resizeHandler = () => {
    // debugger;
    if (!document.hidden) {
      const _isMobile = isMobile();
      appStore.toggleDevice(_isMobile ? DeviceEnum.Mobile : DeviceEnum.Desktop);
      _isMobile && appStore.closeSidebar(true);
    }
  };

  // listenerRouteChange(() => {
  //   if (appStore.device === DeviceEnum.Mobile && appStore.sidebar.opened) {
  //     appStore.closeSidebar(false);
  //   }
  // });

  /** 加載前添加窗口大小變化事件監聽器 */
  onBeforeMount(() => {
    window.addEventListener("resize", resizeHandler);
  });

  /** 加載後根據窗口大小判斷設備類型並調整Layout */
  onMounted(() => {
    if (isMobile()) {
      appStore.toggleDevice(DeviceEnum.Mobile);
      appStore.closeSidebar(true);
    }
  });

  /** 卸載前移除窗口大小變化事件監聽器 */
  onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeHandler);
  });
}
