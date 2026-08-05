'use client'

import { useState, useEffect, useRef, useReducer } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-400">
      Loading editor...
    </div>
  ),
})

const MAX_HISTORY = 100

function formReducer(state, action) {
  switch (action.type) {
    case 'init':
      return { form: action.form, history: [action.form], index: 0, revision: 0 }
    case 'set': {
      const { key, value, fields } = action
      const next = { ...state.form, [key]: value }
      fields.forEach(f => {
        if (f.dependsOn === key) next[f.key] = ''
      })
      const truncated = state.history.slice(0, state.index + 1)
      const history = [...truncated, next].slice(-MAX_HISTORY)
      return { form: next, history, index: history.length - 1, revision: state.revision }
    }
    case 'undo': {
      if (state.index <= 0) return state
      const index = state.index - 1
      return { ...state, form: state.history[index], index, revision: state.revision + 1 }
    }
    case 'redo': {
      if (state.index >= state.history.length - 1) return state
      const index = state.index + 1
      return { ...state, form: state.history[index], index, revision: state.revision + 1 }
    }
    default:
      return state
  }
}

export default function AdminItemForm({ type, slug, title, fields, backHref }) {
  const [state, dispatch] = useReducer(
    formReducer,
    null,
    () => ({ form: {}, history: [], index: -1 })
  )
  const { form, history, index } = state
  const [loading, setLoading] = useState(!!slug)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (slug) {
      fetch(`/api/admin/${type}/${slug}`)
        .then(r => r.json())
        .then(data => {
          const f = { ...data }
          fields.forEach(fld => {
            if (fld.type === 'images' && !f[fld.key]) {
              f[fld.key] = f.image ? [f.image] : []
            }
          })
          dispatch({ type: 'init', form: f })
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      const initial = {}
      fields.forEach(f => {
        if (f.type === 'array' || f.type === 'tags' || f.type === 'images') initial[f.key] = []
        else initial[f.key] = ''
      })
      dispatch({ type: 'init', form: initial })
    }
  }, [slug])

  function set(key, value) {
    dispatch({ type: 'set', key, value, fields })
  }

  useEffect(() => {
    function onKeyDown(e) {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      const k = e.key.toLowerCase()
      if (k === 'z') {
        e.preventDefault()
        dispatch({ type: e.shiftKey ? 'redo' : 'undo' })
      } else if (k === 'y') {
        e.preventDefault()
        dispatch({ type: 'redo' })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const requiredEmpty = fields.find(
      f => f.required && (!form[f.key] || (typeof form[f.key] === 'string' && !form[f.key].trim()))
    )
    if (requiredEmpty) {
      setError(`${requiredEmpty.label} is required`)
      setSaving(false)
      return
    }

    try {
      const url = slug
        ? `/api/admin/${type}/${slug}`
        : `/api/admin/${type}`
      const method = slug ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }

      router.push(backHref || `/admin/${type}`)
      router.refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  function addArrayItem(key) {
    const val = prompt('Enter value:')
    if (val) set(key, [...(form[key] || []), val])
  }

  function removeArrayItem(key, index) {
    set(key, form[key].filter((_, i) => i !== index))
  }

  function setAsCover(key, index) {
    const arr = form[key] || []
    if (index === 0 || arr.length < 2) return
    const img = arr[index]
    set(key, [img, ...arr.filter((_, i) => i !== index)])
  }

  async function handleUpload(key, files) {
    if (!files.length) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.set('type', type)
      for (const file of files) fd.append('files', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { paths } = await res.json()
      set(key, [...(form[key] || []), ...paths])
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const canUndo = index > 0
  const canRedo = index < history.length - 1
  const hasChanges = history.length > 0 && JSON.stringify(form) !== JSON.stringify(history[0])

  if (loading) {
    return <div className="text-zinc-400 text-sm py-8">Loading...</div>
  }

  return (
    <div>
      <Link href={backHref || `/admin/${type}`} className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors">
        &larr; Back
      </Link>

      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6 flex items-center gap-3">
        {title}
        {hasChanges && (
          <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium">
            Unsaved changes
          </span>
        )}
        <span className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'undo' })}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className="w-9 h-9 rounded-lg border border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-base text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            ↩
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'redo' })}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
            className="w-9 h-9 rounded-lg border border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-base text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            ↪
          </button>
        </span>
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {f.label}
            </label>

            {f.type === 'textarea' ? (
              <textarea
                value={form[f.key] || ''}
                onChange={e => set(f.key, e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required={f.required}
              />
            ) : f.type === 'richtext' ? (
              <RichTextEditor
                value={form[f.key] || ''}
                onChange={v => set(f.key, v)}
                placeholder={f.placeholder || f.label}
                minHeight={f.rows ? `${f.rows * 28}px` : '140px'}
                revision={state.revision}
              />
            ) : f.type === 'select' ? (
              <select
                value={form[f.key] || ''}
                onChange={e => set(f.key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required={f.required}
              >
                <option value="">{f.placeholder || 'Select...'}</option>
                {f.options
                  .filter(o => !f.dependsOn || (typeof o === 'object' && o[f.dependsOn] === form[f.dependsOn]))
                  .map(o => {
                    const value = typeof o === 'object' ? o.name : o
                    const label = typeof o === 'object' ? (o.label || o.name) : o
                    return <option key={value} value={value}>{label}</option>
                  })}
              </select>
            ) : f.type === 'number' ? (
              <input
                type="number"
                step={f.step || '0.01'}
                value={form[f.key] || ''}
                onChange={e => set(f.key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            ) : f.type === 'array' ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(form[f.key] || []).map((val, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded">
                      {val}
                      <button type="button" onClick={() => removeArrayItem(f.key, i)} className="text-red-500 hover:text-red-400">&times;</button>
                    </span>
                  ))}
                </div>
                <button type="button" onClick={() => addArrayItem(f.key)} className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">
                  + Add {f.itemLabel || 'item'}
                </button>
              </div>
            ) : f.type === 'tags' ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(form[f.key] || []).map((val, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-full">
                      {val}
                      <button type="button" onClick={() => removeArrayItem(f.key, i)} className="text-red-500 hover:text-red-400">&times;</button>
                    </span>
                  ))}
                </div>
                <button type="button" onClick={() => addArrayItem(f.key)} className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">
                  + Add {f.itemLabel || 'tag'}
                </button>
              </div>
            ) : f.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!form[f.key]}
                  onChange={e => set(f.key, e.target.checked ? 1 : 0)}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{f.label}</span>
              </label>
            ) : f.type === 'images' ? (
              <div>
                {(form[f.key] || []).length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                    {(form[f.key] || []).map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-700 group">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${img})` }}
                        />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 text-[10px] font-semibold uppercase tracking-wider bg-cyan-500 text-zinc-900 px-1.5 py-0.5 rounded">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setAsCover(f.key, i)}
                          disabled={i === 0}
                          title={i === 0 ? 'This is the cover image' : 'Set as cover image'}
                          className="absolute top-1 left-1 w-6 h-6 rounded-full bg-black/50 hover:bg-cyan-500 disabled:opacity-0 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 disabled:group-hover:opacity-0 transition-opacity"
                        >
                          ★
                        </button>
                        <button
                          type="button"
                          onClick={() => removeArrayItem(f.key, i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => handleUpload(f.key, e.target.files)}
                    className="block text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500 file:text-zinc-900 hover:file:bg-cyan-400 file:cursor-pointer file:transition-colors"
                  />
                  {uploading && <span className="text-xs text-zinc-400 self-center">Uploading...</span>}
                </div>
                {(form[f.key] || []).length > 1 && (
                  <p className="text-xs text-zinc-400 mt-1.5">Hover an image and tap ★ to make it the cover. The first image is shown as the thumbnail.</p>
                )}
              </div>
            ) : (
              <input
                type={f.type || 'text'}
                value={form[f.key] || ''}
                onChange={e => set(f.key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required={f.required}
                placeholder={f.placeholder}
              />
            )}
            {f.help && <p className="text-xs text-zinc-400 mt-0.5">{f.help}</p>}
          </div>
        ))}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : slug ? 'Save Changes' : 'Create'}
          </button>
          <Link
            href={backHref || `/admin/${type}`}
            className="px-6 py-2.5 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
