'use client'

import AdminItemList from '@/components/AdminItemList'

export default function AdminLivestock() {
  return (
    <AdminItemList
      type="livestock"
      title="Livestock"
      icon="🐟"
      fields={[
        { key: 'name', label: 'Name', render: v => <span className="font-medium">{v}</span> },
        { key: 'type', label: 'Type', render: v => <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700">{v}</span> },
        { key: 'difficulty', label: 'Difficulty' },
        { key: 'price', label: 'Price', render: v => <span className="font-mono">{v && v !== '0' ? `₹${v}` : '-'}</span> },
        { key: 'quantity', label: 'Qty', render: v => <span className="font-mono">{v}</span> },
      ]}
    />
  )
}
