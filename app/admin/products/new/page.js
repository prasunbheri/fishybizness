'use client'

import AdminItemForm from '@/components/AdminItemForm'

export default function NewProduct() {
  return (
    <AdminItemForm
      type="products"
      title="New Product"
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
        { key: 'price', label: 'Price', type: 'number', step: '0.01', required: true, help: 'Enter price in USD without $ sign' },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'image', label: 'Image Path', placeholder: '/images/products/example.jpg', help: 'Place image in public/images/products/' },
        { key: 'amazonUrl', label: 'Amazon URL', placeholder: 'https://amazon.com/...', help: 'Leave empty if not yet available' },
      ]}
    />
  )
}
