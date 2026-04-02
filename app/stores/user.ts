import { defineStore } from "pinia";
import { ref } from "vue";

// import { setToken as _setToken, getToken, removeToken } from "~/composables/cookies";
// import { store } from "@/stores";
// import { resetRouter } from "@/router";
// import { routerConfig } from "@/router/config";
// import { getCurrentUserApi } from "@/api/users"
// import { setToken as _setToken, getToken, removeToken } from "@/utils/cookies";
// import { useSettingsStore } from "./settings";

// import { setUser, getUser } from "@/utils/local-storage";
// import { useTagsViewStore } from "./tags-view"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "");
  const roles = ref<string[]>([]);
  // const permissions = ref<any>();
  const username = ref("");

  // const tagsViewStore = useTagsViewStore()
  // const settingsStore = useSettingsStore();

  // 设置 Token
  const setToken = (value: string) => {
    _setToken(value);
    token.value = value;
  };

  const setUserName = (value: string) => {
    setUser(value);
  };

  // 获取用户详情
  const getInfo = async () => {
    // const data: any = {
    //   roles: ["admin"],
    //   username: "Admin",
    // };
    // const data:any = ref<string>(getUser() || "");
    //   const { data } = await getCurrentUserApi()
    username.value = getUser() || "";
    // 验证返回的 roles 是否为一个非空数组，否则塞入一个没有任何作用的默认角色，防止路由守卫逻辑进入无限循环
    // roles.value = data.roles?.length > 0 ? data.roles : routerConfig.defaultRoles;
  };

  // // 模拟角色变化
  // const changeRoles = (role: string) => {
  //   const newToken = `token-${role}`;
  //   token.value = newToken;
  //   _setToken(newToken);
  //   // 用刷新页面代替重新登录
  //   location.reload();
  // };

  // 登出
  const logout = () => {
    removeToken();
    token.value = "";
    roles.value = [];
    // resetRouter();
    // resetTagsView()
  };

  // 重置 Token
  const resetToken = () => {
    removeToken();
    token.value = "";
    roles.value = [];
  };

  // 重置 Visited Views 和 Cached Views
  // const resetTagsView = () => {
  //   if (!settingsStore.cacheTagsView) {
  //     tagsViewStore.delAllVisitedViews()
  //     tagsViewStore.delAllCachedViews()
  //   }
  // }

  return { token, roles, username, setUserName, setToken, getInfo, logout, resetToken };
});

// export function useUserStoreOutside() {
//   return useUserStore(store);
// }
