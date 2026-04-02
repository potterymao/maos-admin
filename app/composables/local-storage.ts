
//#region 系統布局
export function getLayoutsConfig() {
  if (process.client) {
    const json = localStorage.getItem(CacheKey.CONFIG_LAYOUT);
    return json ? (JSON.parse(json) as LayoutsConfig) : null;
  }
}
export function setLayoutsConfig(settings: LayoutsConfig) {
  if (process.client) {
    localStorage.setItem(CacheKey.CONFIG_LAYOUT, JSON.stringify(settings));
  }
}
export function removeLayoutsConfig() {
  if (process.client) {
    localStorage.removeItem(CacheKey.CONFIG_LAYOUT);
  }
}
//#endregion

//#region Locale
export const getLocale = () => {
  if (process.client) {
    return localStorage.getItem(CacheKey.LOCALE) || "";
  }
};
export const setLocale = (locale: string) => {
  if (process.client) {
    localStorage.setItem(CacheKey.LOCALE, locale);
  }
};
//#endregion

//#region 側邊欄
export const getSidebarStatus = () => {
  if (process.client) {
    return localStorage.getItem(CacheKey.SIDEBAR_STATUS);
  }
};
export const setSidebarStatus = (sidebarStatus: SidebarOpened | SidebarClosed) => {
  if (process.client) {
    localStorage.setItem(CacheKey.SIDEBAR_STATUS, sidebarStatus);
  }
};
//#endregion

//#region User
export const getUser = () => {
  if (process.client) {
    return localStorage.getItem(CacheKey.USER);
  }
};
export const setUser = (user: string) => {
  if (process.client) {
    localStorage.setItem(CacheKey.USER, user);
  }
};
//#endregion

//#region 正在應用的主題名稱
// export const getActiveThemeName = () => {
//   return localStorage.getItem(CacheKey.ACTIVE_THEME_NAME) as ThemeName | null
// }
// export const setActiveThemeName = (themeName: ThemeName) => {
//   localStorage.setItem(CacheKey.ACTIVE_THEME_NAME, themeName)
// }
//#endregion

//#region 標籤欄
// export const getVisitedViews = () => {
//   const json = localStorage.getItem(CacheKey.VISITED_VIEWS)
//   return JSON.parse(json ?? "[]") as TagView[]
// }
// export const setVisitedViews = (views: TagView[]) => {
//   views.forEach((view) => {
//     // 删除不必要的屬性，防止 JSON.stringify 處理到循環引用
//     delete view.matched
//     delete view.redirectedFrom
//   })
//   localStorage.setItem(CacheKey.VISITED_VIEWS, JSON.stringify(views))
// }
// export const getCachedViews = () => {
//   const json = localStorage.getItem(CacheKey.CACHED_VIEWS)
//   return JSON.parse(json ?? '[]') as string[]
// }
// export const setCachedViews = (views: string[]) => {
//   localStorage.setItem(CacheKey.CACHED_VIEWS, JSON.stringify(views))
// }
//#endregion
