import { getProducts, getProduct } from "@/lib/data"
import AnimatedSection from "@/components/AnimatedSection"
import ImageCarousel from "@/components/ImageCarousel"
import RichContent from "@/components/RichContent"
import ProductCard from "@/components/ProductCard"
import ViewTracker from "@/components/ViewTracker"
import { buildWhatsAppLink } from "@/lib/whatsapp"
import { stripTags } from "@/lib/sanitize"
import { headers } from "next/headers"
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
    description: stripTags(product.description).slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const [product, allProducts] = await Promise.all([getProduct(slug), getProducts()])

  if (!product) {
    return (
      <div className="pt-24 pb-20 px-4 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-zinc-500 mt-2">The product you are looking for does not exist.</p>
      </div>
    )
  }

  const similar = allProducts
    .filter(p => p.slug !== product.slug && p.category === product.category && p.subcategory === product.subcategory)
    .concat(
      allProducts.filter(p => p.slug !== product.slug && p.category === product.category && p.subcategory !== product.subcategory)
    )
    .slice(0, 4)

  const h = await headers()
  const host = h.get('host') || 'fishybiz.duckdns.org'
  const protocol = (h.get('x-forwarded-proto') || 'https').split(',')[0].trim()
  const productUrl = `${protocol}://${host}/products/${product.slug}`
  const waHref = buildWhatsAppLink(
    `Hi Fishy Bizness! I'm interested in "${product.name}".\nLink: ${productUrl}`
  )

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ViewTracker type="product" slug={product.slug} />
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
          <ImageCarousel images={product.images} />
        </AnimatedSection>

        <div>
          <AnimatedSection delay={0.1}>
            <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">
              {product.category}{product.subcategory ? ` / ${product.subcategory}` : ''}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 mb-3 text-zinc-800 dark:text-white">
              {product.name}
            </h1>
            {product.showPrice !== 0 && product.price && product.price !== '0' ? (
              <p className="text-3xl font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                ₹{product.price}
              </p>
            ) : (
              <p className="text-sm text-zinc-400 font-medium mb-2">Price on request</p>
            )}
            <p className={`text-xs font-medium mb-6 ${product.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              {product.quantity > 0 ? '✓ In Stock' : '✕ Out of Stock'}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <RichContent html={product.description} className="mb-8" />
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
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-green-500 text-green-600 dark:text-green-400 font-medium rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Ask about this product on WhatsApp
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <AnimatedSection>
            <div className="mb-8">
              <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">
                {product.subcategory ? product.subcategory : product.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-zinc-800 dark:text-white">Similar Products</h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {similar.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
