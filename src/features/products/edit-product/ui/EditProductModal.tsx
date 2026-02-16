import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import type { Product } from '@/entities/product/model/types'
import { productsApi } from '@/entities/product/api/productsApi'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Modal } from '@/shared/ui/modal'
import { Select } from '@/shared/ui/select'

type FormValues = {
  title: string
  price: number
  category: string
}

export function EditProductModal(props: {
  open: boolean
  product: Product | null
  onClose: () => void
  onUpdated: () => void
}) {
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const initialCategory = useMemo(
    () => props.product?.category ?? categories[0] ?? '',
    [props.product, categories],
  )

  const { register, handleSubmit, reset, setValue, formState } =
    useForm<FormValues>({
      defaultValues: { title: '', price: 0, category: '' },
      mode: 'onSubmit',
    })

  useEffect(() => {
    if (!props.open) return
    const p = props.product
    reset({
      title: p?.title ?? '',
      price: p?.price ?? 0,
      category: p?.category ?? '',
    })
  }, [props.open, props.product, reset])

  useEffect(() => {
    if (!props.open) return
    setLoadingCategories(true)
    productsApi
      .categories()
      .then((cats) => {
        setCategories(cats)
        setValue('category', initialCategory || cats[0] || '')
      })
      .finally(() => setLoadingCategories(false))
  }, [props.open, initialCategory, setValue])

  const onSubmit = handleSubmit(async (values) => {
    if (!props.product) return
    setSubmitting(true)
    try {
      await productsApi.update(props.product.id, {
        title: values.title,
        price: Number(values.price),
        category: values.category || undefined,
      })
      props.onClose()
      props.onUpdated()
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title="Edit product"
      description={props.product ? `ID: ${props.product.id}` : undefined}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={props.onClose}>
            Cancel
          </Button>
          <Button type="submit" form="edit-product-form" disabled={submitting || !props.product}>
            {submitting ? 'Saving…' : 'Save'}
          </Button>
        </div>
      }
    >
      <form id="edit-product-form" className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            {...register('title', { required: 'Title is required' })}
          />
          {formState.errors.title?.message ? (
            <p className="text-sm text-destructive">{formState.errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-price">Price</Label>
          <Input
            id="edit-price"
            type="number"
            step="1"
            min="0"
            {...register('price', {
              valueAsNumber: true,
              required: 'Price is required',
              min: { value: 0, message: 'Price must be >= 0' },
            })}
          />
          {formState.errors.price?.message ? (
            <p className="text-sm text-destructive">{formState.errors.price.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-category">Category</Label>
          <Select
            id="edit-category"
            disabled={loadingCategories}
            {...register('category')}
          >
            {categories.length === 0 ? (
              <option value="">—</option>
            ) : (
              categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))
            )}
          </Select>
        </div>
      </form>
    </Modal>
  )
}

