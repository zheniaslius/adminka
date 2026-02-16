import { httpRequest } from '@/shared/api/http/httpClient'

export type DummyJsonProduct = {
  id: number
  title: string
  description?: string
  price: number
  discountPercentage?: number
  rating?: number
  stock?: number
  brand?: string
  category?: string
  thumbnail?: string
  images?: string[]
}

export type DummyJsonProductsResponse = {
  products: DummyJsonProduct[]
  total: number
  skip: number
  limit: number
}

export type DummyJsonCategory = {
  slug: string
  name: string
  url?: string
}

type SortOrder = 'asc' | 'desc'

export async function getProducts(params: {
  limit: number
  skip: number
  sortBy?: string
  order?: SortOrder
}): Promise<DummyJsonProductsResponse> {
  return httpRequest<DummyJsonProductsResponse>({
    method: 'GET',
    path: '/products',
    query: { limit: params.limit, skip: params.skip, sortBy: params.sortBy, order: params.order },
  })
}

export async function searchProducts(params: {
  q: string
  limit: number
  skip: number
  sortBy?: string
  order?: SortOrder
}): Promise<DummyJsonProductsResponse> {
  return httpRequest<DummyJsonProductsResponse>({
    method: 'GET',
    path: '/products/search',
    query: { q: params.q, limit: params.limit, skip: params.skip, sortBy: params.sortBy, order: params.order },
  })
}

export async function getProductsByCategory(params: {
  category: string
  limit: number
  skip: number
  sortBy?: string
  order?: SortOrder
}): Promise<DummyJsonProductsResponse> {
  return httpRequest<DummyJsonProductsResponse>({
    method: 'GET',
    path: `/products/category/${encodeURIComponent(params.category)}`,
    query: { limit: params.limit, skip: params.skip, sortBy: params.sortBy, order: params.order },
  })
}

export async function getProductCategories(): Promise<string[]> {
  const data = await httpRequest<Array<DummyJsonCategory> | string[]>({
    method: 'GET',
    path: '/products/categories',
  })

  const slugs = (Array.isArray(data) ? data : [])
    .map((item) => {
      if (typeof item === 'string') return item
      if (!item || typeof item !== 'object') return ''
      const slug = (item as { slug?: unknown }).slug
      if (typeof slug === 'string') return slug
      const name = (item as { name?: unknown }).name
      if (typeof name === 'string') return name
      return ''
    })
    .map((s) => s.trim())
    .filter(Boolean)

  return Array.from(new Set(slugs))
}

export async function addProduct(params: {
  title: string
  price: number
  category?: string
}): Promise<DummyJsonProduct> {
  return httpRequest<DummyJsonProduct>({
    method: 'POST',
    path: '/products/add',
    body: params,
  })
}

export async function updateProduct(
  id: number,
  params: { title?: string; price?: number; category?: string },
): Promise<DummyJsonProduct> {
  return httpRequest<DummyJsonProduct>({
    method: 'PUT',
    path: `/products/${id}`,
    body: params,
  })
}

export async function deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean }> {
  return httpRequest<{ id: number; isDeleted: boolean }>({
    method: 'DELETE',
    path: `/products/${id}`,
  })
}
