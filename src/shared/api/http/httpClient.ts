import { DUMMYJSON_BASE_URL } from '@/shared/config/api'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export class HttpError extends Error {
  status: number
  body?: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

type RequestOptions = {
  method: HttpMethod
  path: string
  token?: string | null
  query?: Record<string, string | number | boolean | undefined>
  body?: unknown
  signal?: AbortSignal
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(path, DUMMYJSON_BASE_URL)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

export async function httpRequest<T>(options: RequestOptions): Promise<T> {
  const res = await fetch(buildUrl(options.path, options.query), {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  })

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => undefined) : undefined

  if (!res.ok) {
    throw new HttpError(`HTTP ${res.status}`, res.status, data)
  }

  return data as T
}

