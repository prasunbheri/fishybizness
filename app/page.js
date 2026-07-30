import { getProjects, getProducts, getShopInfo } from "@/lib/data"
import Hero from "@/components/Hero"
import AnimatedSection from "@/components/AnimatedSection"
import ProjectCard from "@/components/ProjectCard"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"

export default async function Home() {
  const [shop, projects, products] = await Promise.all([
    getShopInfo(),
    getProjects(),
    getProducts(),
  ])

  const featuredProjects = projects.slice(0, 3)
  const featuredProducts = products.slice(0, 4)

  return (
    <>
      <Hero shop={shop} />

      {/* Featured Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">Portfolio</span>
              <h2 className="text-3xl font-bold mt-1 text-zinc-800 dark:text-white">Recent Projects</h2>
            </div>
            <Link
              href="/projects"
              className="hidden sm:inline-flex text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline underline-offset-4"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/projects"
              className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline underline-offset-4"
            >
              View all projects &rarr;
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">Shop</span>
                <h2 className="text-3xl font-bold mt-1 text-zinc-800 dark:text-white">Featured Products</h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline underline-offset-4"
              >
                Browse all &rarr;
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <AnimatedSection delay={0.2}>
            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/products"
                className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline underline-offset-4"
              >
                Browse all products &rarr;
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social / Contact CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <AnimatedSection>
          <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">Connect</span>
          <h2 className="text-3xl font-bold mt-1 mb-4 text-zinc-800 dark:text-white">Follow Our Journey</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 text-sm">
            Stay up to date with our latest projects, fishroom updates, and aquarium tips on social media.
          </p>
          <div className="flex justify-center gap-6">
            {['Instagram', 'YouTube', 'Facebook', 'Google'].map((platform) => (
              <a
                key={platform}
                href="#"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
              >
                {platform}
              </a>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {shop.address}
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}
