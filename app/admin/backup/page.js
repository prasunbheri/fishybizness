'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminBackup() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [restoring, setRestoring] = useState(false)

  async function handleDownload() {
    setBusy(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/backup')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Download failed')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fishybizness-backup-${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setMessage('Backup downloaded successfully.')
    } catch (e) {
      setMessage('Download error: ' + e.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleRestore(e) {
    e.preventDefault()
    const form = e.target
    const fileInput = form.querySelector('input[type="file"]')
    if (!fileInput.files.length) return
    if (!confirm('Restore will REPLACE all current data with the contents of this backup file. This cannot be undone. Continue?')) return
    setRestoring(true)
    setMessage('')
    try {
      const fd = new FormData()
      fd.append('file', fileInput.files[0])
      const res = await fetch('/api/admin/backup', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Restore failed')
      setMessage('Restore complete. All data restored from the backup.')
      form.reset()
    } catch (err) {
      setMessage('Restore error: ' + err.message)
    } finally {
      setRestoring(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Backup & Restore</h1>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-600 dark:text-green-400">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-1">Export Backup</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
            Downloads all your data (categories, subcategories, products, livestock, projects, and shop settings) as an Excel file.
          </p>
          <button
            onClick={handleDownload}
            disabled={busy}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {busy ? 'Preparing...' : '⬇ Download Backup (.xlsx)'}
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-1">Restore Backup</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
            Upload a previously downloaded Excel backup to restore everything. <span className="text-red-500">Warning:</span> this replaces all current data.
          </p>
          <form onSubmit={handleRestore} className="space-y-4">
            <input
              type="file"
              accept=".xlsx"
              className="block text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500 file:text-zinc-900 hover:file:bg-cyan-400 file:cursor-pointer file:transition-colors"
            />
            <button
              type="submit"
              disabled={restoring}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {restoring ? 'Restoring...' : '↻ Restore from File'}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 max-w-4xl">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
