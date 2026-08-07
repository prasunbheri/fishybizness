'use client'

import { useState, useRef } from 'react'

const META = {
  products: { label: 'Products', icon: '📦' },
  livestock: { label: 'Livestock', icon: '🐟' },
  projects: { label: 'Projects', icon: '🏗️' },
}

export default function BulkUploadButton({ type, onUploaded }) {
  const meta = META[type] || { label: type, icon: '📄' }
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  function close() {
    setOpen(false)
    setResult(null)
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

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
      const res = await fetch(`/api/admin/bulk/${type}`, { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setResult(data)
      if (input) input.value = ''
      if (onUploaded) onUploaded()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const inputCls =
    'block text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500 file:text-zinc-900 hover:file:bg-cyan-400 file:cursor-pointer file:transition-colors'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700"
      >
        ⬆ Bulk Upload
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={close}
        >
          <div
            className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 w-full max-w-lg shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                {meta.icon} Bulk Upload {meta.label}
              </h3>
              <button
                onClick={close}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Download the template, fill it in, then upload it back. Rows with an existing name are skipped.
            </p>

            <a
              href={`/api/admin/bulk/${type}/template`}
              className="inline-flex items-center gap-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700"
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

            <div className="mt-5 flex justify-end">
              <button
                onClick={close}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
