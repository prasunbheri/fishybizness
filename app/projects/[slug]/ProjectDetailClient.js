'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ImageLightbox from '@/components/ImageLightbox'

export default function ProjectDetailClient({ project }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const open = (i) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i === 0 ? project.images.length - 1 : i - 1))
  const next = () => setLightboxIndex((i) => (i === project.images.length - 1 ? 0 : i + 1))

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {project.images.map((img, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            onClick={() => open(i)}
            className={`relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 group cursor-pointer ${
              i === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
            }`}
          >
            <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
              <div className="text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-sm font-mono">{img.split('/').pop()}</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                Click to expand
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={project.images}
          currentIndex={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  )
}
