'use client'

import { use } from 'react'
import AdminItemForm from '@/components/AdminItemForm'

export default function EditProject({ params }) {
  const { slug } = use(params)
  return (
    <AdminItemForm
      type="projects"
      slug={slug}
      title="Edit Project"
      backHref="/admin/projects"
      fields={[
        { key: 'title', label: 'Project Title', required: true },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'tags', label: 'Tags', type: 'tags', itemLabel: 'tag' },
        { key: 'images', label: 'Images', type: 'images' },
      ]}
    />
  )
}
