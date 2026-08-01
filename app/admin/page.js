import Link from 'next/link'

const sections = [
  {
    title: 'Livestock',
    href: '/admin/livestock',
    icon: '🐟',
    desc: 'Manage fish, plants, and invertebrates',
    color: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: '📦',
    desc: 'Manage products, pricing, and categories',
    color: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: '🏗️',
    desc: 'Manage portfolio projects and case studies',
    color: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
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

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">Dashboard</h1>
      <p className="text-sm text-zinc-500 mb-8">Manage your aquarium shop content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className={`block rounded-xl border-2 ${s.color} ${s.bg} p-6 hover:shadow-md transition-shadow`}
          >
            <span className="text-3xl block mb-3">{s.icon}</span>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-1">{s.title}</h2>
            <p className="text-sm text-zinc-500">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
