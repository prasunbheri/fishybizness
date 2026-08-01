'use client'

import AdminItemList from '@/components/AdminItemList'

export default function AdminProducts() {
  return (
    <AdminItemList
      type="products"
      title="Products"
      icon="📦"
      fields={[
        { key: 'name', label: 'Name', render: v => <span className="font-medium">{v}</span> },
        { key: 'category', label: 'Category', render: v => <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700">{v}</span> },
        { key: 'subcategory', label: 'Subcategory', render: v => v ? <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700">{v}</span> : <span className="text-zinc-400">—</span> },
        { key: 'price', label: 'Price', render: v => <span className="font-mono">₹{v}</span> },
        { key: 'quantity', label: 'Qty', render: v => <span className="font-mono">{v}</span> },
        { key: 'views', label: 'Views', render: v => <span className="font-mono">{v || 0}</span> },
      ]}
    />
  )
}
