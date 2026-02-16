import { useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useSearchParams } from 'react-router-dom'

import type { Product } from '@/entities/product/model/types'
import { productsApi } from '@/entities/product/api/productsApi'
import { LogoutButton } from '@/features/auth/logout/ui/LogoutButton'
import { CreateProductModal } from '@/features/products/create-product/ui/CreateProductModal'
import { DeleteProductModal } from '@/features/products/delete-product/ui/DeleteProductModal'
import { EditProductModal } from '@/features/products/edit-product/ui/EditProductModal'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { ProductsTable } from '@/widgets/products-table/ui/ProductsTable'

function clampInt(value: string | null, fallback: number, min: number, max: number) {
  const num = Number(value)
  if (!Number.isFinite(num)) return fallback
  return Math.min(max, Math.max(min, Math.trunc(num)))
}

type SortOrder = 'asc' | 'desc'

function isSortOrder(value: string | null): value is SortOrder {
  return value === 'asc' || value === 'desc'
}

export const ProductsPage = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = (searchParams.get('q') ?? '').trim()
  const limit = clampInt(searchParams.get('limit'), 10, 1, 100)
  const skip = clampInt(searchParams.get('skip'), 0, 0, 10_000)
  const sortBy = (searchParams.get('sortBy') ?? 'id').trim() || 'id'
  const order: SortOrder = isSortOrder(searchParams.get('order')) ? (searchParams.get('order') as SortOrder) : 'asc'

  const category = (searchParams.get('category') ?? '').trim()
  const brand = (searchParams.get('brand') ?? '').trim()
  const priceMin = searchParams.get('priceMin')
  const priceMax = searchParams.get('priceMax')
  const stockMin = searchParams.get('stockMin')
  const priceMinNum = priceMin ? clampInt(priceMin, 0, 0, 1_000_000) : null
  const priceMaxNum = priceMax ? clampInt(priceMax, 0, 0, 1_000_000) : null
  const stockMinNum = stockMin ? clampInt(stockMin, 0, 0, 1_000_000) : null

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState<number>(0)

  const canShowMore = useMemo(() => products.length < total, [products.length, total])

  const [createOpen, setCreateOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  const [categories, setCategories] = useState<string[]>([])

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        q,
        limit,
        sortBy,
        order,
        category,
        brand,
        priceMin: priceMinNum,
        priceMax: priceMaxNum,
        stockMin: stockMinNum,
      }),
    [q, limit, sortBy, order, category, brand, priceMinNum, priceMaxNum, stockMinNum],
  )

  const [lastQueryKey, setLastQueryKey] = useState<string>('')

  function applyLocalFilters(items: Product[]): Product[] {
    let result = items

    if (category) {
      result = result.filter((p) => (p.category ?? '').toLowerCase() === category.toLowerCase())
    }
    if (brand) {
      const b = brand.toLowerCase()
      result = result.filter((p) => (p.brand ?? '').toLowerCase().includes(b))
    }
    if (priceMinNum !== null) {
      result = result.filter((p) => (p.price ?? 0) >= priceMinNum)
    }
    if (priceMaxNum !== null) {
      result = result.filter((p) => (p.price ?? 0) <= priceMaxNum)
    }
    if (stockMinNum !== null) {
      result = result.filter((p) => (p.stock ?? 0) >= stockMinNum)
    }

    return result
  }

  const fetchProducts = async (opts?: { append?: boolean }) => {
    setLoading(true)
    setError(null)
    try {
      const baseParams = { limit, skip, sortBy, order }

      const res =
        !q && category
          ? await productsApi.byCategory({ ...baseParams, category })
          : q
            ? await productsApi.search({ ...baseParams, q })
            : await productsApi.list(baseParams)

      const filtered = applyLocalFilters(res.products)

      setTotal(res.total)
      setProducts((prev) => (opts?.append ? [...prev, ...filtered] : filtered))
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const reset = lastQueryKey !== queryKey
    setLastQueryKey(queryKey)
    void fetchProducts({ append: !reset && skip > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, limit, skip, sortBy, order, category, brand, priceMinNum, priceMaxNum, stockMinNum])

  useEffect(() => {
    productsApi.categories().then(setCategories).catch(() => setCategories([]))
  }, [])

  return (
    <div className="mx-auto min-h-screen max-w-6xl p-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Products</CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={() => setCreateOpen(true)}>Create</Button>
            <LogoutButton />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px] space-y-2">
              <label className="text-sm font-medium leading-none">Search</label>
              <Input
                value={q}
                placeholder="Search by title…"
                onChange={(e) => {
                  const next = e.target.value
                  setSearchParams((prev) => {
                    const p = new URLSearchParams(prev)
                    if (next.trim()) p.set('q', next)
                    else p.delete('q')
                    p.set('skip', '0')
                    return p
                  })
                }}
              />
            </div>

            <div className="min-w-[220px] space-y-2">
              <label className="text-sm font-medium leading-none">Category</label>
              <Select
                value={category}
                onChange={(e) => {
                  const next = e.target.value
                  setSearchParams((prev) => {
                    const p = new URLSearchParams(prev)
                    if (next) p.set('category', next)
                    else p.delete('category')
                    p.set('skip', '0')
                    return p
                  })
                }}
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>

            <div className="min-w-[220px] space-y-2">
              <label className="text-sm font-medium leading-none">Brand</label>
              <Input
                value={brand}
                placeholder="Contains…"
                onChange={(e) => {
                  const next = e.target.value
                  setSearchParams((prev) => {
                    const p = new URLSearchParams(prev)
                    if (next.trim()) p.set('brand', next)
                    else p.delete('brand')
                    p.set('skip', '0')
                    return p
                  })
                }}
              />
            </div>

            <div className="min-w-[140px] space-y-2">
              <label className="text-sm font-medium leading-none">Take</label>
              <Input
                type="number"
                min={1}
                max={100}
                value={limit}
                onChange={(e) => {
                  const next = clampInt(e.target.value, 10, 1, 100)
                  setSearchParams((prev) => {
                    const p = new URLSearchParams(prev)
                    p.set('limit', String(next))
                    p.set('skip', '0')
                    return p
                  })
                }}
              />
            </div>

            <div className="min-w-[140px] space-y-2">
              <label className="text-sm font-medium leading-none">Price min</label>
              <Input
                type="number"
                min={0}
                value={priceMinNum ?? ''}
                onChange={(e) => {
                  const next = e.target.value
                  setSearchParams((prev) => {
                    const p = new URLSearchParams(prev)
                    if (next !== '') p.set('priceMin', String(clampInt(next, 0, 0, 1_000_000)))
                    else p.delete('priceMin')
                    p.set('skip', '0')
                    return p
                  })
                }}
              />
            </div>

            <div className="min-w-[140px] space-y-2">
              <label className="text-sm font-medium leading-none">Price max</label>
              <Input
                type="number"
                min={0}
                value={priceMaxNum ?? ''}
                onChange={(e) => {
                  const next = e.target.value
                  setSearchParams((prev) => {
                    const p = new URLSearchParams(prev)
                    if (next !== '') p.set('priceMax', String(clampInt(next, 0, 0, 1_000_000)))
                    else p.delete('priceMax')
                    p.set('skip', '0')
                    return p
                  })
                }}
              />
            </div>

            <div className="min-w-[140px] space-y-2">
              <label className="text-sm font-medium leading-none">Stock min</label>
              <Input
                type="number"
                min={0}
                value={stockMinNum ?? ''}
                onChange={(e) => {
                  const next = e.target.value
                  setSearchParams((prev) => {
                    const p = new URLSearchParams(prev)
                    if (next !== '') p.set('stockMin', String(clampInt(next, 0, 0, 1_000_000)))
                    else p.delete('stockMin')
                    p.set('skip', '0')
                    return p
                  })
                }}
              />
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setSearchParams(new URLSearchParams({ limit: '10', skip: '0' }))
              }}
            >
              Reset
            </Button>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}

          <ProductsTable
            products={products}
            onEdit={(p) => setEditProduct(p)}
            onDelete={(p) => setDeleteProduct(p)}
            sortBy={sortBy}
            order={order}
            onSort={(field) => {
              setSearchParams((prev) => {
                const p = new URLSearchParams(prev)
                const currentSort = (p.get('sortBy') ?? 'id').trim() || 'id'
                const currentOrder = isSortOrder(p.get('order')) ? (p.get('order') as SortOrder) : 'asc'

                const nextOrder: SortOrder =
                  currentSort === field ? (currentOrder === 'asc' ? 'desc' : 'asc') : 'asc'

                p.set('sortBy', field)
                p.set('order', nextOrder)
                p.set('skip', '0')
                return p
              })
            }}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Loaded {products.length} of {total} (skip: {skip}, take: {limit})
            </p>
            <Button
              variant="secondary"
              disabled={!canShowMore || loading}
              onClick={() => {
                setSearchParams((prev) => {
                  const p = new URLSearchParams(prev)
                  p.set('skip', String(skip + limit))
                  return p
                })
              }}
            >
              Show more
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreateProductModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setSearchParams((prev) => {
            const p = new URLSearchParams(prev)
            p.set('skip', '0')
            return p
          })
        }}
      />
      <EditProductModal
        open={Boolean(editProduct)}
        product={editProduct}
        onClose={() => setEditProduct(null)}
        onUpdated={() => {
          setSearchParams((prev) => {
            const p = new URLSearchParams(prev)
            p.set('skip', '0')
            return p
          })
        }}
      />
      <DeleteProductModal
        open={Boolean(deleteProduct)}
        product={deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onDeleted={() => {
          setSearchParams((prev) => {
            const p = new URLSearchParams(prev)
            p.set('skip', '0')
            return p
          })
        }}
      />
    </div>
  )
})
