import { getProducts, getCategories, getSubcategories } from "@/lib/data"
import AnimatedSection from "@/components/AnimatedSection"
import ProductCard from "@/components/ProductCard"
import Pagination from "@/components/Pagination"

import Link from 'next/link'

export const revalidate = 0

const PER_PAGE_OPTIONS = [10, 20, 30, 40, 50]

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams
  const activeCategory = params?.category || null
  const activeSubcategory = params?.subcategory || null
  const perPageRaw = Number(params?.perPage)
  const perPage = PER_PAGE_OPTIONS.includes(perPageRaw) ? perPageRaw : 30
  const pageRaw = Number(params?.page)
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1

  const [allProducts, categories, subcategories] = await Promise.all([
    getProducts(),
    getCategories(),
    getSubcategories(),
  ])

  const products = activeCategory
    ? allProducts.filter(p => p.category === activeCategory && (!activeSubcategory || p.subcategory === activeSubcategory))
    : allProducts

  const activeSubcategories = activeCategory
    ? subcategories.filter(s => s.category === activeCategory)
    : []

  const productCountBySub = {}
  for (const p of allProducts) {
    if (p.category === activeCategory && p.subcategory) {
      productCountBySub[p.subcategory] = (productCountBySub[p.subcategory] || 0) + 1
    }
  }

  const total = products.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const currentPage = Math.min(page, totalPages)
  const paged = products.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection>
        <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">
          Shop
        </span>
        <h1 className="text-4xl font-bold mt-1 mb-2 text-zinc-800 dark:text-white">All Products</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mb-8 text-sm">
          Everything you need to create and maintain your dream aquarium. Click any product for details.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/products"
            className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full font-medium transition-colors ${
              !activeCategory
                ? 'bg-cyan-500 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeCategory === cat.name
                  ? 'bg-cyan-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat.label || cat.name}
            </Link>
          ))}
        </div>

        {activeCategory && activeSubcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10 -mt-6">
            <Link
              href={`/products?category=${activeCategory}`}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                !activeSubcategory
                  ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              All {categories.find(c => c.name === activeCategory)?.label || activeCategory}
            </Link>
            {activeSubcategories.map((sub) => (
              <Link
                key={sub.name}
                href={`/products?category=${activeCategory}&subcategory=${sub.name}`}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activeSubcategory === sub.name
                    ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {sub.label || sub.name}
                <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-white/50 dark:bg-zinc-600/60 text-zinc-600 dark:text-zinc-300">
                  {productCountBySub[sub.name] || 0}
                </span>
              </Link>
            ))}
          </div>
        )}
      </AnimatedSection>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {paged.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <Pagination path="/products" total={total} page={currentPage} perPage={perPage} />
    </div>
  )
}
