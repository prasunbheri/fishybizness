'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-3">
          <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-4xl">
            🐟
          </div>
          <motion.div
            className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <div className="absolute top-3 right-3">
            <span className="text-xs font-mono bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 px-2 py-1 rounded-md backdrop-blur-sm">
              ${product.price}
            </span>
          </div>
        </div>
        <h3 className="font-medium text-sm text-zinc-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-zinc-400 capitalize mt-0.5">{product.category}</p>
      </Link>
    </motion.div>
  )
}
