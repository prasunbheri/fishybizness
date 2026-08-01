import AnimatedSection from "@/components/AnimatedSection"
import Link from "next/link"

const utilities = [
  {
    href: '/utilities/water-volume',
    icon: '📏',
    title: 'Tank Water Volume Calculator',
    desc: 'Enter your aquarium dimensions to instantly get the water volume in litres and gallons — accounting for glass thickness, substrate, and fill level.',
    tags: ['Volume', 'Litres', 'Gallons'],
  },
  {
    href: '/utilities/fish-compatibility',
    icon: '🐟',
    title: 'Fish Compatibility Chart',
    desc: 'A large interactive chart showing which popular aquarium fish can live together safely. Check any pair before stocking your tank.',
    tags: ['Compatibility', 'Chart', 'Stocking'],
  },
]

export default function UtilitiesPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection>
        <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">Resources</span>
        <h1 className="text-4xl font-bold mt-1 mb-3 text-zinc-800 dark:text-white">Aquarium Utilities</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mb-10 text-sm">
          Handy tools to help you plan your tank — from sizing your water volume to picking fish that get along.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {utilities.map((u, i) => (
          <AnimatedSection key={u.href} delay={i * 0.1}>
            <Link
              href={u.href}
              className="group block h-full p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-cyan-400 dark:hover:border-cyan-400 hover:shadow-lg transition-all"
            >
              <span className="text-4xl block mb-4">{u.icon}</span>
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {u.title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{u.desc}</p>
              <div className="flex flex-wrap gap-2">
                {u.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
