import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

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

export function CreateProductModal(props: {
  open: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const defaultCategory = useMemo(() => categories[0] ?? '', [categories])

  const { register, handleSubmit, reset, formState, setValue } =
    useForm<FormValues>({
      defaultValues: { title: '', price: 0, category: '' },
      mode: 'onSubmit',
    })

  useEffect(() => {
    if (!props.open) return
    setLoadingCategories(true)
    productsApi
      .categories()
      .then((cats) => {
        setCategories(cats)
        if (cats[0]) setValue('category', cats[0])
      })
      .finally(() => setLoadingCategories(false))
  }, [props.open, setValue])

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    try {
      await productsApi.create({
        title: values.title,
        price: Number(values.price),
        category: values.category || undefined,
      })
      reset({ title: '', price: 0, category: defaultCategory })
      props.onClose()
      props.onCreated()
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title="Create product"
      description="DummyJSON returns a simulated created item."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={props.onClose}>
            Cancel
          </Button>
          <Button type="submit" form="create-product-form" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="create-product-form" className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="create-title">Title</Label>
          <Input
            id="create-title"
            {...register('title', { required: 'Title is required' })}
          />
          {formState.errors.title?.message ? (
            <p className="text-sm text-destructive">{formState.errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-price">Price</Label>
          <Input
            id="create-price"
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
          <Label htmlFor="create-category">Category</Label>
          <Select
            id="create-category"
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

