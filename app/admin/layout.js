'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/hero', label: 'Hero', icon: '🖼️' },
  { href: '/admin/livestock', label: 'Livestock', icon: '🐟' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { href: '/admin/projects', label: 'Projects', icon: '🏗️' },
  { href: '/admin/backup', label: 'Backup', icon: '💾' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

const mobileIcons = [
  { href: '/admin', icon: '📊' },
  { href: '/admin/hero', icon: '🖼️' },
  { href: '/admin/livestock', icon: '🐟' },
  { href: '/admin/products', icon: '📦' },
  { href: '/admin/categories', icon: '🏷️' },
  { href: '/admin/projects', icon: '🏗️' },
  { href: '/admin/backup', icon: '💾' },
  { href: '/admin/settings', icon: '⚙️' },
]

export default function AdminLayout({ children }) {
  const [authed, setAuthed] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => {
        if (!r.ok) throw new Error('unauth')
        return r.json()
      })
      .then(() => setAuthed(true))
      .catch(() => {
        setAuthed(false)
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      })
  }, [pathname, router])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  if (!authed) return null

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex">
      <aside className="w-56 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 hidden md:flex flex-col">
        <Link href="/admin" className="flex items-center gap-2 px-5 py-4 border-b border-zinc-200 dark:border-zinc-700">
          <span className="text-xl">🐠</span>
          <span className="font-bold text-sm text-zinc-800 dark:text-white">FishyBizness</span>
        </Link>
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 font-medium border-r-2 border-cyan-500'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              router.push('/admin/login')
            }}
            className="text-xs text-zinc-500 hover:text-red-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-3 py-2 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-1.5">
            <span className="text-lg">🐠</span>
            <span className="font-bold text-sm text-zinc-800 dark:text-white">Admin</span>
          </Link>
          <div className="flex items-center gap-0.5">
            {mobileIcons.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                  pathname.startsWith(item.href)
                    ? 'bg-cyan-100 dark:bg-cyan-900/30'
                    : 'text-zinc-500'
                }`}
              >
                {item.icon}
              </Link>
            ))}
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' })
                router.push('/admin/login')
              }}
              className="w-8 h-8 flex items-center justify-center text-sm"
              aria-label="Sign out"
            >
              🚪
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 pt-20 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
