'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function AdminHero() {
  const [config, setConfig] = useState({ type: 'images', images: [], video: null })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  useEffect(() => {
    fetch('/api/admin/hero')
      .then(r => r.json())
      .then(data => {
        setConfig({ type: 'images', images: [], video: null, ...data })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleUpload(files) {
    if (!files.length) return
    setUploading(true)
    setMessage('')
    try {
      const fd = new FormData()
      fd.set('type', 'hero')
      for (const file of files) fd.append('files', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { paths } = await res.json()
      setConfig(prev => ({ ...prev, images: [...prev.images, ...paths] }))
    } catch (e) {
      setMessage('Upload error: ' + e.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleVideoUpload(file) {
    if (!file) return
    setUploading(true)
    setMessage('')
    try {
      const fd = new FormData()
      fd.set('type', 'hero')
      fd.append('files', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { paths } = await res.json()
      setConfig(prev => ({ ...prev, video: paths[0] }))
    } catch (e) {
      setMessage('Upload error: ' + e.message)
    } finally {
      setUploading(false)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  async function removeImage(index) {
    const img = config.images[index]
    await fetch('/api/admin/hero/files', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: img }),
    }).catch(() => {})
    setConfig(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error('Save failed')
      setMessage('Saved!')
    } catch (e) {
      setMessage('Save error: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-zinc-400 text-sm py-8">Loading...</div>

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors">&larr; Back</Link>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6">Hero Section Background</h1>

      <div className="max-w-2xl space-y-6">
        <div className="flex gap-4">
          <button
            onClick={() => setConfig(prev => ({ ...prev, type: 'images', video: null }))}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${config.type === 'images' ? 'bg-cyan-500 text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}
          >
            Images
          </button>
          <button
            onClick={() => setConfig(prev => ({ ...prev, type: 'video', images: [] }))}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${config.type === 'video' ? 'bg-cyan-500 text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}
          >
            Video
          </button>
        </div>

        {config.type === 'images' ? (
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Background Images</label>
            {config.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {config.images.map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-700 group">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >&times;</button>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={e => handleUpload(e.target.files)}
              className="block text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500 file:text-zinc-900 hover:file:bg-cyan-400 file:cursor-pointer file:transition-colors"
            />
            {config.images.length === 0 && <p className="text-xs text-zinc-400 mt-2">Upload at least one image. Images will crossfade as background.</p>}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Background Video</label>
            {config.video && (
              <div className="mb-3">
                <video src={config.video} className="w-full max-h-48 rounded-lg" controls muted />
                <button
                  onClick={async () => {
                    await fetch('/api/admin/hero/files', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ filePath: config.video }),
                    }).catch(() => {})
                    setConfig(prev => ({ ...prev, video: null }))
                  }}
                  className="mt-1 text-xs text-red-500 hover:underline"
                >Delete video</button>
              </div>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={e => handleVideoUpload(e.target.files[0])}
              className="block text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500 file:text-zinc-900 hover:file:bg-cyan-400 file:cursor-pointer file:transition-colors"
            />
            {!config.video && <p className="text-xs text-zinc-400 mt-2">Upload a video. It will play on loop as the hero background.</p>}
          </div>
        )}

        {uploading && <p className="text-sm text-zinc-400">Uploading...</p>}

        {message && (
          <p className={`text-sm ${message === 'Saved!' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
