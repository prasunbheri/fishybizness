import { getLivestock, getLivestockTypes } from "@/lib/data"
import AnimatedSection from "@/components/AnimatedSection"
import LivestockCard from "@/components/LivestockCard"

export default async function LivestockPage() {
  const [livestock, types] = await Promise.all([
    getLivestock(),
    getLivestockTypes(),
  ])

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
        <div className="flex flex-wrap gap-2 mb-10">
          <span className="text-xs uppercase tracking-wider px-3 py-1.5 rounded-full bg-cyan-500 text-white font-medium">
            All
          </span>
          {types.map((type) => (
            <span
              key={type}
              className="text-xs uppercase tracking-wider px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              {type}
            </span>
          ))}
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {livestock.map((item, i) => (
          <LivestockCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}
