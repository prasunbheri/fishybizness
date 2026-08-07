'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const defaultHours = {
  monday: '11:30 AM - 8:30 PM',
  tuesday: 'Closed',
  wednesday: '11:30 AM - 8:30 PM',
  thursday: '11:30 AM - 8:30 PM',
  friday: '11:30 AM - 8:30 PM',
  saturday: '11:30 AM - 8:30 PM',
  sunday: '11:30 AM - 8:30 PM',
}

export default function AdminSettings() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/shop')
      .then(r => r.json())
      .then(data => {
        setForm({
          ...data,
          hours: { ...defaultHours, ...(data.hours || {}) },
        })
      })
      .catch(() => setForm(null))
  }, [])

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function setHour(day, value) {
    setForm(prev => ({ ...prev, hours: { ...prev.hours, [day]: value } }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/shop', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }
      setMessage('Saved!')
      router.refresh()
    } catch (e) {
      setMessage('Save error: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <div className="text-zinc-400 text-sm py-8">Loading...</div>

  const inputCls = "w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors">&larr; Back</Link>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">Store Settings</h1>
      <p className="text-sm text-zinc-500 mb-8">Update store name, contact info, and opening hours.</p>

      <div className="max-w-2xl space-y-6">
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">Store Info</h2>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Store Name</label>
            <input className={inputCls} value={form.shopName || ''} onChange={e => set('shopName', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tagline</label>
            <input className={inputCls} value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
            <textarea className={inputCls} rows={3} value={form.description || ''} onChange={e => set('description', e.target.value)} />
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">Contact Details</h2>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
            <input type="email" className={inputCls} value={form.email || ''} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phone</label>
            <input className={inputCls} value={form.phone || ''} onChange={e => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Address</label>
            <textarea className={inputCls} rows={3} value={form.address || ''} onChange={e => set('address', e.target.value)} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">Store Hours</h2>
          {days.map(day => (
            <div key={day} className="flex items-center gap-3">
              <span className="capitalize font-medium text-zinc-700 dark:text-zinc-300 text-sm w-32 shrink-0">{day}</span>
              <input
                className={inputCls}
                value={form.hours[day] || ''}
                onChange={e => setHour(day, e.target.value)}
                placeholder={day === 'tuesday' ? 'Closed' : 'e.g. 11:30 AM - 8:30 PM'}
              />
            </div>
          ))}
          <p className="text-xs text-zinc-400">Use "Closed" for days off.</p>
        </div>

        {message && (
          <p className={`text-sm ${message === 'Saved!' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
