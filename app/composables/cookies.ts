// 统一处理 Cookie

import { CacheKey } from "./cache-key"

export function getToken() {
  return useCookie(CacheKey.TOKEN).value || ""
}

export function _setToken(token: string) {
  // useCookie(CacheKey.TOKEN).value = token

  useCookie(CacheKey.SHOP_SESSION_ID, {
    domain: '.shoplineapp.com',
    path: '/',
    secure: true,           // 生产环境建议开启
    sameSite: 'lax'
  }).value = token
}

export function removeToken() {
  useCookie(CacheKey.TOKEN).value = null
}


export function getSessionId() {
  return useCookie(CacheKey.SHOP_SESSION_ID).value || ""
}
