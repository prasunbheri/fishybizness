'use client'

import { useState, useRef } from 'react'

const TYPES = [
  {
    type: 'products',
    label: 'Products',
    icon: '📦',
    desc: 'Upload many products at once from an Excel sheet. Download the template, fill it in, then upload it back.',
  },
  {
    type: 'livestock',
    label: 'Livestock',
    icon: '🐟',
    desc: 'Add fish, plants, and inverts in bulk. Use the template to get all the right columns.',
  },
  {
    type: 'projects',
    label: 'Projects',
    icon: '🏗️',
    desc: 'Import aquarium build projects in bulk with titles, dates, images, and tags.',
  },
]

function BulkUploadCard({ cfg }) {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  async function handleUpload(e) {
    e.preventDefault()
    const input = fileRef.current
    if (!input || !input.files.length) return
    setUploading(true)
    setError('')
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('file', input.files[0])
      const res = await fetch(`/api/admin/bulk/${cfg.type}`, { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setResult(data)
      input.value = ''
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const inputCls =
    'block text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500 file:text-zinc-900 hover:file:bg-cyan-400 file:cursor-pointer file:transition-colors'

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col">
      <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-1">
        <span className="mr-2">{cfg.icon}</span>
        {cfg.label}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 flex-1">{cfg.desc}</p>

      <a
        href={`/api/admin/bulk/${cfg.type}/template`}
        className="inline-flex items-center justify-center gap-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700"
      >
        ⬇ Download Template (.xlsx)
      </a>

      <form onSubmit={handleUpload} className="mt-4 space-y-3">
        <input ref={fileRef} type="file" accept=".xlsx" className={inputCls} />
        <button
          type="submit"
          disabled={uploading}
          className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload & Create'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {result && (
        <div className="mt-3 text-sm">
          <p className="text-green-600 dark:text-green-400 font-medium">
            Created {result.created.length} of {result.total}.
          </p>
          {result.skipped.length > 0 && (
            <div className="mt-2">
              <p className="text-amber-600 dark:text-amber-400 text-xs font-medium mb-1">
                Skipped {result.skipped.length}:
              </p>
              <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-0.5 max-h-32 overflow-y-auto">
                {result.skipped.map((s, i) => (
                  <li key={i}>
                    Row {s.row}: {s.name || '—'} ({s.reason})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminBulkUpload() {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-1">
        Bulk Upload
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Add multiple items at once using an Excel sheet. Each type has its own template. Rows whose name
        already exists are skipped.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {TYPES.map(cfg => (
          <BulkUploadCard key={cfg.type} cfg={cfg} />
        ))}
      </div>
    </section>
  )
}
