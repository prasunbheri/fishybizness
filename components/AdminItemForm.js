'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminItemForm({ type, slug, title, fields, backHref }) {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(!!slug)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (slug) {
      fetch(`/api/admin/${type}/${slug}`)
        .then(r => r.json())
        .then(data => {
          setForm(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      const initial = {}
      fields.forEach(f => {
        if (f.type === 'array') initial[f.key] = []
        else if (f.type === 'tags') initial[f.key] = []
        else initial[f.key] = ''
      })
      setForm(initial)
    }
  }, [slug])

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

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

  if (loading) {
    return <div className="text-zinc-400 text-sm py-8">Loading...</div>
  }

  return (
    <div>
      <Link href={backHref || `/admin/${type}`} className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors">
        &larr; Back
      </Link>

      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6">{title}</h1>

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
            ) : f.type === 'select' ? (
              <select
                value={form[f.key] || ''}
                onChange={e => set(f.key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required={f.required}
              >
                <option value="">Select...</option>
                {f.options.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
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
