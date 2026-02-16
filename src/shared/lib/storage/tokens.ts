import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/lib/storage/localStorage'

const ACCESS_TOKEN_KEY = 'auth_access_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

export const tokenStorage = {
  getAccessToken(): string | null {
    return getLocalStorageItem(ACCESS_TOKEN_KEY)
  },
  setAccessToken(token: string): void {
    setLocalStorageItem(ACCESS_TOKEN_KEY, token)
  },
  clearAccessToken(): void {
    removeLocalStorageItem(ACCESS_TOKEN_KEY)
  },
  getRefreshToken(): string | null {
    return getLocalStorageItem(REFRESH_TOKEN_KEY)
  },
  setRefreshToken(token: string): void {
    setLocalStorageItem(REFRESH_TOKEN_KEY, token)
  },
  clearRefreshToken(): void {
    removeLocalStorageItem(REFRESH_TOKEN_KEY)
  },
  clear(): void {
    removeLocalStorageItem(ACCESS_TOKEN_KEY)
    removeLocalStorageItem(REFRESH_TOKEN_KEY)
  },
}

