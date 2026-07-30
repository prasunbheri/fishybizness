import { getLivestock, getLivestockItem } from "@/lib/data"
import AnimatedSection from "@/components/AnimatedSection"
import Link from "next/link"

export const revalidate = 0

export async function generateStaticParams() {
  const items = await getLivestock()
  return items.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = await getLivestockItem(slug)
  if (!item) return { title: "Not Found" }
  return {
    title: `${item.name} | FishyBizness Aquatics`,
    description: item.description.slice(0, 160),
  }
}

const typeColors = {
  fish: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  invertebrate: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  plant: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export default async function LivestockDetailPage({ params }) {
  const { slug } = await params
  const item = await getLivestockItem(slug)

  if (!item) {
    return (
      <div className="pt-24 pb-20 px-4 text-center">
        <h1 className="text-2xl font-bold">Not found</h1>
        <p className="text-zinc-500 mt-2">This livestock entry does not exist.</p>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <AnimatedSection>
        <Link
          href="/livestock"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors"
        >
          &larr; Back to livestock
        </Link>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <AnimatedSection>
          <div className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 overflow-hidden">
            <div className="text-center">
              <div className="text-7xl mb-4">{item.type === 'plant' ? '🌿' : '🐟'}</div>
              <p className="text-sm font-mono text-zinc-500">{item.image}</p>
            </div>
          </div>
        </AnimatedSection>

        <div>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium ${typeColors[item.type]}`}>
                {item.type}
              </span>
              <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium ${difficultyColors[item.difficulty] || 'bg-zinc-100 text-zinc-700'}`}>
                {item.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 mb-1 text-zinc-800 dark:text-white">
              {item.name}
            </h1>
            <p className="text-sm text-zinc-400 italic mb-6">{item.scientificName}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Max Size</p>
                <p className="text-sm font-semibold text-zinc-800 dark:text-white">{item.maxSize}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Min Tank</p>
                <p className="text-sm font-semibold text-zinc-800 dark:text-white">{item.minTankSize}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Temperament</p>
                <p className="text-sm font-semibold text-zinc-800 dark:text-white">{item.temperament}</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
              {item.description}
            </p>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
