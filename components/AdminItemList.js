'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BulkUploadButton from './BulkUploadButton'

export default function AdminItemList({ type, title, icon, fields }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  async function load() {
    try {
      const res = await fetch(`/api/admin/${type}`)
      if (res.status === 401) return router.push('/admin/login')
      setItems(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(item) {
    const label = item.title || item.name
    if (!confirm(`Delete "${label}"?`)) return
    try {
      const res = await fetch(`/api/admin/${type}/${item.slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await load()
    } catch (e) {
      alert('Failed to delete: ' + e.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl">{icon}</span>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mt-1">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <BulkUploadButton type={type} onUploaded={load} />
          <Link
            href={`/admin/${type}/new`}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium rounded-lg text-sm transition-colors"
          >
            + Add New
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-zinc-400 text-sm py-8">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-zinc-400 text-sm py-8">No items yet. Add your first one!</div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                {fields.map(f => (
                  <th key={f.key} className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                    {f.label}
                  </th>
                ))}
                <th className="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id || item.slug} className="border-b border-zinc-100 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-700/30">
                  {fields.map(f => (
                    <td key={f.key} className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {f.render ? f.render(item[f.key], item) : item[f.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/${type}/${item.slug}`}
                      className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
