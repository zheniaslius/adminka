import type { Product } from '@/entities/product/model/types'
import { Button } from '@/shared/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'

type SortOrder = 'asc' | 'desc'
type SortField = 'id' | 'title' | 'price' | 'category' | 'stock' | 'brand'

function SortHead(props: {
  label: string
  field: SortField
  sortBy: string
  order: SortOrder
  onSort: (field: SortField) => void
  className?: string
}) {
  const active = props.sortBy === props.field
  const indicator = active ? (props.order === 'asc' ? '↑' : '↓') : ''
  return (
    <TableHead className={props.className}>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-left hover:text-foreground"
        onClick={() => props.onSort(props.field)}
      >
        <span>{props.label}</span>
        <span className="text-xs text-muted-foreground">{indicator}</span>
      </button>
    </TableHead>
  )
}

export function ProductsTable(props: {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  sortBy: string
  order: SortOrder
  onSort: (field: SortField) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortHead
            className="w-[80px]"
            label="ID"
            field="id"
            sortBy={props.sortBy}
            order={props.order}
            onSort={props.onSort}
          />
          <SortHead
            label="Title"
            field="title"
            sortBy={props.sortBy}
            order={props.order}
            onSort={props.onSort}
          />
          <SortHead
            className="w-[110px]"
            label="Price"
            field="price"
            sortBy={props.sortBy}
            order={props.order}
            onSort={props.onSort}
          />
          <SortHead
            className="w-[150px]"
            label="Category"
            field="category"
            sortBy={props.sortBy}
            order={props.order}
            onSort={props.onSort}
          />
          <SortHead
            className="w-[120px]"
            label="Stock"
            field="stock"
            sortBy={props.sortBy}
            order={props.order}
            onSort={props.onSort}
          />
          <SortHead
            className="w-[180px]"
            label="Brand"
            field="brand"
            sortBy={props.sortBy}
            order={props.order}
            onSort={props.onSort}
          />
          <TableHead className="w-[160px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.products.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {p.id}
            </TableCell>
            <TableCell className="font-medium">{p.title}</TableCell>
            <TableCell>${p.price}</TableCell>
            <TableCell>{p.category ?? '—'}</TableCell>
            <TableCell>{p.stock ?? '—'}</TableCell>
            <TableCell>{p.brand ?? '—'}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => props.onEdit(p)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => props.onDelete(p)}>
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {props.products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
              No products found.
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  )
}
