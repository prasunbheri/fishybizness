import { getProducts, getProduct } from "@/lib/data"
import AnimatedSection from "@/components/AnimatedSection"
import Link from "next/link"

export const revalidate = 0

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: "Product Not Found" }
  return {
    title: `${product.name} | FishyBizness Aquatics`,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return (
      <div className="pt-24 pb-20 px-4 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-zinc-500 mt-2">The product you are looking for does not exist.</p>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <AnimatedSection>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors"
        >
          &larr; Back to products
        </Link>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <AnimatedSection>
          <div className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 overflow-hidden">
            <div className="text-center">
              <div className="text-6xl mb-4">🐟</div>
              <p className="text-sm font-mono text-zinc-500">{product.image}</p>
            </div>
          </div>
        </AnimatedSection>

        <div>
          <AnimatedSection delay={0.1}>
            <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 mb-3 text-zinc-800 dark:text-white">
              {product.name}
            </h1>
            <p className="text-3xl font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-6">
              ${product.price}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm mb-8">
              {product.description}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3">
              {product.amazonUrl ? (
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-semibold rounded-full transition-all hover:scale-105 text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.27 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.47-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.16L13.13 3.454 18.035 8.47l1.432 1.431a1.376 1.376 0 0 0 1.951-.003c.539-.54.539-1.414.003-1.955L13.483 0z" />
                  </svg>
                  View on Amazon
                </a>
              ) : (
                <span className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium rounded-full text-sm cursor-not-allowed">
                  Amazon link coming soon
                </span>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-full hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all text-sm"
              >
                Ask about this product
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
