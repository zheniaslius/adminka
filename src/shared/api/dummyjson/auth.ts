import { httpRequest } from '@/shared/api/http/httpClient'

export type DummyJsonUser = {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  image: string
}

export type DummyJsonLoginResponse = DummyJsonUser & {
  accessToken: string
  refreshToken?: string
}

export async function loginDummyJson(params: {
  username: string
  password: string
  expiresInMins?: number
}): Promise<DummyJsonLoginResponse> {
  return httpRequest<DummyJsonLoginResponse>({
    method: 'POST',
    path: '/auth/login',
    body: {
      username: params.username,
      password: params.password,
      expiresInMins: params.expiresInMins,
    },
  })
}

export async function meDummyJson(token: string): Promise<DummyJsonUser> {
  return httpRequest<DummyJsonUser>({
    method: 'GET',
    path: '/auth/me',
    token,
  })
}

