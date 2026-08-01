'use client'

import AdminItemForm from '@/components/AdminItemForm'

export default function NewLivestock() {
  return (
    <AdminItemForm
      type="livestock"
      title="New Livestock Entry"
      backHref="/admin/livestock"
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'scientificName', label: 'Scientific Name' },
        {
          key: 'type',
          label: 'Type',
          type: 'select',
          options: ['fish', 'invertebrate', 'plant'],
          required: true,
        },
        {
          key: 'difficulty',
          label: 'Difficulty',
          type: 'select',
          options: ['Beginner', 'Intermediate', 'Expert'],
          required: true,
        },
        { key: 'minTankSize', label: 'Minimum Tank Size', placeholder: 'e.g. 60L' },
        { key: 'maxSize', label: 'Maximum Size', placeholder: 'e.g. 5cm' },
        {
          key: 'temperament',
          label: 'Temperament',
          type: 'select',
          options: ['Peaceful', 'Semi-aggressive', 'Aggressive'],
        },
        { key: 'quantity', label: 'Available Count', type: 'number', step: '1', required: true },
        { key: 'price', label: 'Price', type: 'number', step: '0.01', help: 'Enter price in INR without ₹ symbol' },
        { key: 'showPrice', label: 'Show price on site', type: 'checkbox' },
        {
          key: 'description',
          label: 'Description',
          type: 'textarea',
          required: true,
        },
        { key: 'images', label: 'Images', type: 'images' },
      ]}
    />
  )
}
