'use client'

import { use } from 'react'
import AdminItemForm from '@/components/AdminItemForm'

export default function EditProduct({ params }) {
  const { slug } = use(params)
  return (
    <AdminItemForm
      type="products"
      slug={slug}
      title="Edit Product"
      backHref="/admin/products"
      fields={[
        { key: 'name', label: 'Product Name', required: true },
        {
          key: 'category',
          label: 'Category',
          type: 'select',
          options: ['filtration', 'equipment', 'substrate', 'lighting', 'co2', 'water-care', 'tanks', 'testing'],
          required: true,
        },
        { key: 'price', label: 'Price', type: 'number', step: '0.01', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'image', label: 'Image Path', placeholder: '/images/products/example.jpg' },
        { key: 'amazonUrl', label: 'Amazon URL', placeholder: 'https://amazon.com/...' },
      ]}
    />
  )
}
