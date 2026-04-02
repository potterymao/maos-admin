export enum DeviceEnum {
  Mobile,
  Desktop,
}

/** SIDEBAR */
export const SIDEBAR_OPENED = "opened";
export const SIDEBAR_CLOSED = "closed";

export type SidebarOpened = typeof SIDEBAR_OPENED;
export type SidebarClosed = typeof SIDEBAR_CLOSED;

/** Locale */
import ENIcon from '@/assets/images/flags/en.png'
import TWIcon from '@/assets/images/flags/zh-tw.png'
export const langMap = [
  {
    lang: 'en',
    name: 'English',
    icon: ENIcon,
  },
  {
    lang: 'zh-TW',
    name: '繁體中文',
    icon: TWIcon,
  },
]

export const firstPage = "/design-plate"

export const useNavMenu = () => {
  const navs = {
    main: [
      { path: "/decal-designer", icon: "i-mdi-home", meta: { title: "Decal-Designer" } },
      { path: "/men", icon: "i-mdi-home", meta: { title: "Men" } },
    ],
  };
  const allNavs = Object.values(navs).reduce((acc, navMenu) => {
    return [...acc, ...navMenu];
  }, []);

  const currentRoute = useRoute();
  const currentPath = computed(() => {
    return currentRoute.path;
  });

  return {
    allNavs,
    navsMain: navs.main,
    // navsSecondary: navs.secondary,
    currentPath,
  };
};
