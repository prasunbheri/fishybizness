import Link from 'next/link'
import { getDashboardStats } from '@/lib/data'

export const dynamic = 'force-dynamic'

const sections = [
  {
    title: 'Livestock',
    href: '/admin/livestock',
    icon: '🐟',
    desc: 'Manage fish, plants, and invertebrates',
    color: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    statKey: 'livestock',
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: '📦',
    desc: 'Manage products, pricing, and categories',
    color: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    statKey: 'products',
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: '🏗️',
    desc: 'Manage portfolio projects and case studies',
    color: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
    statKey: 'projects',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
    desc: 'Update store info, contact, and hours',
    color: 'border-purple-200 dark:border-purple-800',
    bg: 'bg-purple-50 dark:bg-purple-900/10',
  },
]

function formatViews(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  function renderStats(s) {
    if (s.statKey === 'livestock') {
      const { count, byType } = stats.livestock
      const parts = byType.map(t => `${t.count} ${t.type}`)
      return (
        <div className="mt-3 space-y-1 text-sm">
          <p className="font-semibold text-2xl text-zinc-800 dark:text-white">{count}</p>
          <p className="text-xs text-zinc-500 capitalize">{parts.length ? parts.join(' · ') : 'No entries yet'}</p>
        </div>
      )
    }
    if (s.statKey === 'products') {
      const { count, views, outOfStock } = stats.products
      return (
        <div className="mt-3 space-y-1 text-sm">
          <p className="font-semibold text-2xl text-zinc-800 dark:text-white">{count}</p>
          <p className="text-xs text-zinc-500">
            {formatViews(views)} total views{outOfStock > 0 ? ` · ${outOfStock} out of stock` : ''}
          </p>
        </div>
      )
    }
    if (s.statKey === 'projects') {
      const { count, views } = stats.projects
      return (
        <div className="mt-3 space-y-1 text-sm">
          <p className="font-semibold text-2xl text-zinc-800 dark:text-white">{count}</p>
          <p className="text-xs text-zinc-500">{formatViews(views)} total views</p>
        </div>
      )
    }
    return null
  }

  function TopList({ label, icon, items, nameKey, editHref }) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h2 className="font-semibold text-zinc-800 dark:text-white">{label}</h2>
        </div>
        {items.length === 0 ? (
          <p className="px-5 py-6 text-sm text-zinc-400">No views yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
            {items.map(item => (
              <li key={item.slug} className="flex items-center gap-3 px-5 py-3">
                <span className="text-xs font-bold text-zinc-300 dark:text-zinc-600 w-5 shrink-0">{items.indexOf(item) + 1}</span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`${editHref}/${item.slug}`}
                    className="block text-sm font-medium text-zinc-800 dark:text-white truncate hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {item[nameKey]}
                  </Link>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`${editHref.replace('/admin', '')}/${item.slug}`}
                    className="text-xs text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    View
                  </Link>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                    {formatViews(item.views)} views
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">Dashboard</h1>
      <p className="text-sm text-zinc-500 mb-8">Manage your aquarium shop content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className={`block rounded-xl border-2 ${s.color} ${s.bg} p-6 hover:shadow-md transition-shadow`}
          >
            <span className="text-3xl block mb-3">{s.icon}</span>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-1">{s.title}</h2>
            <p className="text-sm text-zinc-500">{s.desc}</p>
            {renderStats(s)}
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <TopList
          label="Most Viewed Products"
          icon="📦"
          items={stats.products.top}
          nameKey="name"
          editHref="/admin/products"
        />
        <TopList
          label="Most Viewed Projects"
          icon="🏗️"
          items={stats.projects.top}
          nameKey="title"
          editHref="/admin/projects"
        />
      </div>
    </div>
  )
}
