import { type Ref, ref, watch } from "vue";
import { defineStore } from "pinia";

type SettingsStore = {
  [Key in keyof LayoutsConfig]: Ref<LayoutsConfig[Key]>;
};

type SettingsStoreKey = keyof SettingsStore;

export const useSettingsStore = defineStore("settings", () => {
  const state = {} as SettingsStore;
  for (const [key, value] of Object.entries(layoutsConfig)) {
    const refValue = ref(value);
    // @ts-ignore
    state[key as SettingsStoreKey] = refValue;
    watch(refValue, () => {
      const settings = _getCacheData();

      setLayoutsConfig(settings);
    });
  }
  const _getCacheData = () => {
    const settings = {} as LayoutsConfig;
    for (const [key, value] of Object.entries(state)) {
      // @ts-ignore
      settings[key as SettingsStoreKey] = value.value;
    }
    return settings;
  };

  return state;
});
