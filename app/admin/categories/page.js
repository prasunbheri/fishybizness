'use client'

import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newLabel, setNewLabel] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [subLabel, setSubLabel] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expandedCat, setExpandedCat] = useState(null)
  const [catProducts, setCatProducts] = useState([])
  const [categoryChanges, setCategoryChanges] = useState({})
  const [editingCat, setEditingCat] = useState(null)
  const [catEditLabel, setCatEditLabel] = useState('')
  const [editingSub, setEditingSub] = useState(null)
  const [subEditLabel, setSubEditLabel] = useState('')

  async function load() {
    setLoading(true)
    try {
      const [cats, subs] = await Promise.all([
        fetch('/api/admin/categories').then(r => r.json()),
        fetch('/api/admin/subcategories').then(r => r.json()),
      ])
      if (!Array.isArray(cats)) throw new Error('Failed to load')
      setCategories(cats)
      setSubcategories(subs)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!newLabel.trim()) return
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newLabel }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create')
      }
      setNewLabel('')
      setSuccess('Category added')
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleAddSub(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!subCategory || !subLabel.trim()) return
    try {
      const res = await fetch('/api/admin/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: subCategory, label: subLabel }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create')
      }
      setSubCategory('')
      setSubLabel('')
      setSuccess('Subcategory added')
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  function startEditCat(cat) {
    setEditingCat(cat.name)
    setCatEditLabel(cat.label)
  }

  async function handleSaveCat(oldName) {
    if (!catEditLabel.trim()) return
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(oldName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: catEditLabel }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update')
      }
      setSuccess('Category renamed')
      setEditingCat(null)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  function startEditSub(sub, catName) {
    setEditingSub({ name: sub.name, category: catName })
    setSubEditLabel(sub.label)
  }

  async function handleSaveSub(name, category) {
    if (!subEditLabel.trim()) return
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/admin/subcategories/${encodeURIComponent(name)}?category=${encodeURIComponent(category)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: subEditLabel }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update')
      }
      setSuccess('Subcategory renamed')
      setEditingSub(null)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete(name) {
    if (!confirm(`Delete category "${name}"? This will also delete its subcategories.`)) return
    setError('')
    setSuccess('')
    setExpandedCat(null)
    setCatProducts([])
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(name)}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        if (data.products) {
          setExpandedCat(name)
          setCatProducts(data.products)
        } else {
          throw new Error(data.error || 'Failed to delete')
        }
        return
      }
      setSuccess('Category deleted')
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDeleteSub(sub, catName) {
    if (!confirm(`Delete subcategory "${sub.label}"?`)) return
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/admin/subcategories/${encodeURIComponent(sub.name)}?category=${encodeURIComponent(catName)}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      setSuccess('Subcategory deleted')
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDeleteProduct(slug, catName) {
    if (!confirm('Delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products/${slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      setCatProducts(prev => prev.filter(p => p.slug !== slug))
      setSuccess('Product deleted')
      if (catProducts.length <= 1) {
        setExpandedCat(null)
        setCatProducts([])
      }
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleChangeCategory(slug, catName) {
    const newCat = categoryChanges[slug]
    if (!newCat) return
    try {
      const res = await fetch(`/api/admin/products/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCat, subcategory: '' }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update')
      }
      setCatProducts(prev => prev.filter(p => p.slug !== slug))
      setCategoryChanges(prev => { const n = { ...prev }; delete n[slug]; return n })
      setSuccess(`Product moved to "${newCat}"`)
      if (catProducts.length <= 1) {
        setExpandedCat(null)
        setCatProducts([])
      }
    } catch (e) {
      setError(e.message)
    }
  }

  const otherCategories = (catName) => categories.filter(c => c.name !== catName)
  const subcategoriesOf = (catName) => subcategories.filter(s => s.category === catName)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Categories</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      <form onSubmit={handleAdd} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Category Name</label>
          <input
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g. Water Care"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-semibold rounded-lg transition-colors text-sm">+ Add Category</button>
      </form>

      <form onSubmit={handleAddSub} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Category</label>
          <select
            value={subCategory}
            onChange={e => setSubCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select category…</option>
            {categories.map(c => (
              <option key={c.name} value={c.name}>{c.label || c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Subcategory Name</label>
          <input
            type="text"
            value={subLabel}
            onChange={e => setSubLabel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g. Water Conditioners"
          />
        </div>
        <button type="submit" disabled={!subCategory} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-semibold rounded-lg transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed">+ Add Subcategory</button>
      </form>

      {loading ? (
        <div className="text-zinc-400 text-sm py-8">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 text-center text-zinc-400 text-sm">No categories yet. Add one above.</div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left">
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider">Name</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider">Label</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider">Subcategories</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider w-24"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <Fragment key={cat.name}>
                  <tr className="border-b border-zinc-100 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-700/30">
                    <td className="px-4 py-3 text-zinc-800 dark:text-white font-mono text-xs">{cat.name}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {editingCat === cat.name ? (
                        <input
                          type="text"
                          value={catEditLabel}
                          onChange={e => setCatEditLabel(e.target.value)}
                          className="px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          autoFocus
                        />
                      ) : (
                        cat.label
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {subcategoriesOf(cat.name).length === 0 ? (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">None</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {subcategoriesOf(cat.name).map(s => {
                            const isEditing = editingSub && editingSub.name === s.name && editingSub.category === cat.name
                            return (
                              <span key={s.name} className="inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={subEditLabel}
                                    onChange={e => setSubEditLabel(e.target.value)}
                                    className="w-28 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                    autoFocus
                                  />
                                ) : (
                                  s.label
                                )}
                                {isEditing ? (
                                  <button
                                    type="button"
                                    onClick={() => handleSaveSub(s.name, cat.name)}
                                    className="text-green-600 dark:text-green-400 hover:text-green-500 transition-colors"
                                    aria-label="Save subcategory"
                                  >
                                    ✓
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => startEditSub(s, cat.name)}
                                    className="text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                    aria-label={`Edit subcategory ${s.label}`}
                                  >
                                    ✎
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSub(s, cat.name)}
                                  className="text-red-500 hover:text-red-400 transition-colors"
                                  aria-label={`Delete subcategory ${s.label}`}
                                >
                                  &times;
                                </button>
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        {editingCat === cat.name ? (
                          <>
                            <button
                              onClick={() => handleSaveCat(cat.name)}
                              className="text-xs text-green-600 dark:text-green-400 hover:text-green-500 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCat(null)}
                              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditCat(cat)}
                              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cat.name)}
                              className="text-xs text-red-500 hover:text-red-400 transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedCat === cat.name && catProducts.length > 0 && (
                    <tr key={`${cat.name}-products`}>
                      <td colSpan={4} className="px-4 py-3 bg-amber-50 dark:bg-amber-900/10">
                        <div className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-2">
                          This category is used by {catProducts.length} product(s). Move or delete them first.
                        </div>
                        <div className="space-y-2">
                          {catProducts.map(p => (
                            <div key={p.slug} className="flex items-center gap-2 flex-wrap bg-white dark:bg-zinc-700/50 rounded-lg px-3 py-2 border border-amber-200 dark:border-amber-700/50">
                              <Link
                                href={`/admin/products/${p.slug}`}
                                className="text-sm font-medium text-zinc-800 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 shrink-0"
                              >
                                {p.name}
                              </Link>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0">→</span>
                              <select
                                value={categoryChanges[p.slug] || ''}
                                onChange={e => setCategoryChanges(prev => ({ ...prev, [p.slug]: e.target.value }))}
                                className="text-xs px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              >
                                <option value="">Change category…</option>
                                {otherCategories(cat.name).map(c => (
                                  <option key={c.name} value={c.name}>{c.label || c.name}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleChangeCategory(p.slug, cat.name)}
                                disabled={!categoryChanges[p.slug]}
                                className="text-xs px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                              >
                                Move
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.slug, cat.name)}
                                className="text-xs px-2 py-1 rounded bg-red-500 hover:bg-red-400 text-white font-medium transition-colors shrink-0 ml-auto"
                              >
                                Delete Product
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
