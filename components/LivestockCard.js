'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const typeColors = {
  fish: 'bg-blue-500/90',
  invertebrate: 'bg-purple-500/90',
  plant: 'bg-green-500/90',
}

export default function LivestockCard({ item, index }) {
  const img = item.images?.[0]
  const outOfStock = item.quantity <= 0
  const showPrice = item.showPrice !== 0 && item.price && item.price !== '0'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/livestock/${item.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
          {img ? (
            <div
              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url(${img})` }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-4xl">
              {item.type === 'plant' ? '🌿' : '🐟'}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {outOfStock && (
            <div className="absolute top-3 left-3">
              <span className="text-white text-[10px] font-semibold uppercase tracking-wider bg-red-500 px-2 py-1 rounded">Out of Stock</span>
            </div>
          )}

          <div className="absolute top-3 right-3">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold text-white ${typeColors[item.type] || 'bg-zinc-600/90'}`}>
              {item.type}
            </span>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-3">
            <h3 className="font-semibold text-sm text-white leading-snug [text-shadow:_0_1px_4px_rgb(0_0_0_/_0.6)]">
              {item.name}
            </h3>
            <p className="text-[10px] italic text-zinc-300 mt-0.5 line-clamp-1">{item.scientificName}</p>
          </div>
        </div>

        <div className="mt-2">
          {showPrice ? (
            <p className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">₹{item.price}</p>
          ) : (
            <p className="text-xs text-zinc-400">Price on request</p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
