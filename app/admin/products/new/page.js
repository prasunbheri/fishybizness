'use client'

import { useState, useEffect } from 'react'
import AdminItemForm from '@/components/AdminItemForm'

export default function NewProduct() {
  const [categoryOptions, setCategoryOptions] = useState([])
  const [subcategoryOptions, setSubcategoryOptions] = useState([])

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/categories').then(r => r.json()),
      fetch('/api/admin/subcategories').then(r => r.json()),
    ])
      .then(([cats, subs]) => {
        setCategoryOptions(cats.map(c => c.name))
        setSubcategoryOptions(subs.map(s => ({ name: s.name, label: s.label, category: s.category })))
      })
      .catch(() => {
        setCategoryOptions([])
        setSubcategoryOptions([])
      })
  }, [])

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
          options: categoryOptions,
          required: true,
        },
        {
          key: 'subcategory',
          label: 'Subcategory',
          type: 'select',
          options: subcategoryOptions,
          dependsOn: 'category',
          placeholder: 'None',
          help: 'Optional. Select a category first.',
        },
        { key: 'price', label: 'Price', type: 'number', step: '0.01', required: true, help: 'Enter price in INR without ₹ symbol' },
        { key: 'showPrice', label: 'Show price on site', type: 'checkbox' },
        { key: 'quantity', label: 'Quantity in Stock', type: 'number', step: '1', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'images', label: 'Images', type: 'images' },
        { key: 'amazonUrl', label: 'Amazon URL', placeholder: 'https://amazon.com/...', help: 'Leave empty if not yet available' },
      ]}
    />
  )
}
