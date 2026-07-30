'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const typeColors = {
  fish: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  invertebrate: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  plant: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

export default function LivestockCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/livestock/${item.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-3">
          <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-4xl">
            {item.type === 'plant' ? '🌿' : '🐟'}
          </div>
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-medium ${typeColors[item.type] || 'bg-zinc-100 text-zinc-700'}`}>
              {item.type}
            </span>
          </div>
        </div>
        <h3 className="font-medium text-sm text-zinc-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
          {item.name}
        </h3>
        <p className="text-xs text-zinc-400 italic mt-0.5 line-clamp-1">{item.scientificName}</p>
      </Link>
    </motion.div>
  )
}
