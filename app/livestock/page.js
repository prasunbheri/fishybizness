import { getLivestock, getLivestockTypes } from "@/lib/data"
import AnimatedSection from "@/components/AnimatedSection"
import LivestockCard from "@/components/LivestockCard"
import SortSelect from "@/components/SortSelect"
import Link from "next/link"

export const revalidate = 0

const typeOrder = { fish: 0, invertebrate: 1, plant: 2 }

export default async function LivestockPage({ searchParams }) {
  const params = await searchParams
  const activeType = params?.type || null
  const sort = params?.sort || 'name'

  const [allLivestock, types] = await Promise.all([
    getLivestock(),
    getLivestockTypes(),
  ])

  let livestock = activeType
    ? allLivestock.filter(item => item.type === activeType)
    : [...allLivestock]

  livestock.sort((a, b) => {
    if (sort === 'type') {
      const ta = typeOrder[a.type] ?? 9
      const tb = typeOrder[b.type] ?? 9
      if (ta !== tb) return ta - tb
    }
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection>
        <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">
          Livestock
        </span>
        <h1 className="text-4xl font-bold mt-1 mb-2 text-zinc-800 dark:text-white">Fish & Plants</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mb-8 text-sm">
          Explore our selection of live fish, invertebrates, and aquatic plants for your aquarium.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <Link
            href={`/livestock?sort=${sort}`}
            className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full font-medium transition-colors ${
              !activeType
                ? 'bg-cyan-500 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            All
          </Link>
          {types.map((type) => (
            <Link
              key={type}
              href={`/livestock?type=${type}&sort=${sort}`}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeType === type
                  ? 'bg-cyan-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {type}
            </Link>
          ))}
          <span className="ml-auto">
            <SortSelect value={sort} />
          </span>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {livestock.length === 0 && (
          <p className="col-span-full text-center text-zinc-500 dark:text-zinc-400 text-sm">
            No {activeType || 'livestock'} available right now. Check back soon!
          </p>
        )}
        {livestock.map((item, i) => (
          <LivestockCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}
