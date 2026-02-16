import type { Product } from '@/entities/product/model/types'
import { productsApi } from '@/entities/product/api/productsApi'
import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'
import { useState } from 'react'

export function DeleteProductModal(props: {
  open: boolean
  product: Product | null
  onClose: () => void
  onDeleted: () => void
}) {
  const [submitting, setSubmitting] = useState(false)

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title="Delete product"
      description={props.product ? `ID: ${props.product.id} — ${props.product.title}` : undefined}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            type="button"
            disabled={submitting || !props.product}
            onClick={async () => {
              if (!props.product) return
              setSubmitting(true)
              try {
                await productsApi.remove(props.product.id)
                props.onClose()
                props.onDeleted()
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {submitting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground">
        This action is simulated by DummyJSON.
      </p>
    </Modal>
  )
}

