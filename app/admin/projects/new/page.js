'use client'

import AdminItemForm from '@/components/AdminItemForm'

export default function NewProject() {
  return (
    <AdminItemForm
      type="projects"
      title="New Project"
      backHref="/admin/projects"
      fields={[
        { key: 'title', label: 'Project Title', required: true },
        { key: 'date', label: 'Date', placeholder: 'YYYY-MM-DD', help: 'e.g. 2025-12-15' },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'tags', label: 'Tags', type: 'tags', itemLabel: 'tag', help: 'e.g. planted, reef, nano' },
        { key: 'images', label: 'Image Paths', type: 'array', itemLabel: 'image path', help: 'e.g. /images/projects/example.jpg' },
      ]}
    />
  )
}
