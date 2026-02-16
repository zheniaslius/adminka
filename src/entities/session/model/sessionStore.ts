import { makeAutoObservable, runInAction } from 'mobx'

import { meDummyJson, loginDummyJson } from '@/shared/api/dummyjson/auth'
import { tokenStorage } from '@/shared/lib/storage/tokens'
import type { SessionTokens, SessionUser } from './types'

type SessionStatus = 'idle' | 'anonymous' | 'authenticating' | 'authenticated'

export class SessionStore {
  status: SessionStatus = 'idle'
  ready = false

  user: SessionUser | null = null
  tokens: SessionTokens | null = null
  error: string | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    const accessToken = tokenStorage.getAccessToken()
    const refreshToken = tokenStorage.getRefreshToken() ?? undefined
    this.tokens = accessToken ? { accessToken, refreshToken } : null
  }

  get isAuthenticated(): boolean {
    return this.status === 'authenticated'
  }

  async hydrate(): Promise<void> {
    if (this.ready) return

    if (!this.tokens?.accessToken) {
      runInAction(() => {
        this.status = 'anonymous'
        this.ready = true
      })
      return
    }

    try {
      const user = await meDummyJson(this.tokens.accessToken)
      runInAction(() => {
        this.user = user
        this.status = 'authenticated'
        this.ready = true
      })
    } catch {
      runInAction(() => {
        this.clear()
        this.status = 'anonymous'
        this.ready = true
      })
    }
  }

  async login(params: { username: string; password: string }): Promise<void> {
    this.status = 'authenticating'
    this.error = null

    try {
      const res = await loginDummyJson({
        username: params.username,
        password: params.password,
        expiresInMins: 60,
      })

      runInAction(() => {
        this.user = res
        this.tokens = { accessToken: res.accessToken, refreshToken: res.refreshToken }
        this.status = 'authenticated'
        this.ready = true
      })

      tokenStorage.setAccessToken(res.accessToken)
      if (res.refreshToken) tokenStorage.setRefreshToken(res.refreshToken)
    } catch {
      runInAction(() => {
        this.user = null
        this.tokens = null
        this.status = 'anonymous'
        this.error = 'Invalid username or password'
      })
      tokenStorage.clear()
    }
  }

  logout(): void {
    this.clear()
    this.status = 'anonymous'
  }

  private clear(): void {
    this.user = null
    this.tokens = null
    this.error = null
    tokenStorage.clear()
  }
}

