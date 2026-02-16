import type { DummyJsonUser } from '@/shared/api/dummyjson/auth'

export type SessionUser = DummyJsonUser

export type SessionTokens = {
  accessToken: string
  refreshToken?: string
}

