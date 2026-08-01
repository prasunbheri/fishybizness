'use client'

import AdminItemList from '@/components/AdminItemList'

export default function AdminProjects() {
  return (
    <AdminItemList
      type="projects"
      title="Projects"
      icon="🏗️"
      fields={[
        { key: 'title', label: 'Title', render: v => <span className="font-medium">{v}</span> },
        { key: 'date', label: 'Date' },
        { key: 'views', label: 'Views', render: v => <span className="font-mono">{v || 0}</span> },
        { key: 'tags', label: 'Tags', render: (v) => (
          <div className="flex flex-wrap gap-1">
            {(v || []).slice(0, 3).map(t => (
              <span key={t} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700">{t}</span>
            ))}
          </div>
        )},
      ]}
    />
  )
}
