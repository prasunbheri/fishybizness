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
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'tags', label: 'Tags', type: 'tags', itemLabel: 'tag', help: 'e.g. planted, reef, nano' },
        { key: 'images', label: 'Images', type: 'images' },
      ]}
    />
  )
}
