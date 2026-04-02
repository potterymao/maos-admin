// 统一处理 Cookie

import { CacheKey } from "./cache-key"

export function getToken() {
  return useCookie(CacheKey.TOKEN).value || ""
}

export function _setToken(token: string) {
  useCookie(CacheKey.TOKEN).value = token
}

export function removeToken() {
  useCookie(CacheKey.TOKEN).value = null
}
