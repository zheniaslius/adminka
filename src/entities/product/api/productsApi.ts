import type { Product, ProductsResponse } from '@/entities/product/model/types'
import {
  addProduct,
  deleteProduct,
  getProductCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
  updateProduct,
} from '@/shared/api/dummyjson/products'

type SortOrder = 'asc' | 'desc'

export const productsApi = {
  list(params: { limit: number; skip: number; sortBy?: string; order?: SortOrder }): Promise<ProductsResponse> {
    return getProducts(params)
  },
  search(params: { q: string; limit: number; skip: number; sortBy?: string; order?: SortOrder }): Promise<ProductsResponse> {
    return searchProducts(params)
  },
  byCategory(params: {
    category: string
    limit: number
    skip: number
    sortBy?: string
    order?: SortOrder
  }): Promise<ProductsResponse> {
    return getProductsByCategory(params)
  },
  categories(): Promise<string[]> {
    return getProductCategories()
  },
  create(params: { title: string; price: number; category?: string }): Promise<Product> {
    return addProduct(params)
  },
  update(id: number, params: { title?: string; price?: number; category?: string }): Promise<Product> {
    return updateProduct(id, params)
  },
  remove(id: number): Promise<{ id: number; isDeleted: boolean }> {
    return deleteProduct(id)
  },
}
