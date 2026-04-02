const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "Mao's Studio";

const dynamicTitle = ref<string>("");

/** 設置Title */
function setTitle(title?: string) {
  dynamicTitle.value = title ? `${VITE_APP_TITLE} | ${title}` : VITE_APP_TITLE;
}

// 監聽
watch(dynamicTitle, (value, oldValue) => {
  if (document && value !== oldValue) {
    document.title = value;
  }
});

export function useTitle() {
  return { setTitle };
}
