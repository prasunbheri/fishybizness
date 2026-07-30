'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export default function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl z-10"
          aria-label="Close"
        >
          &times;
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10"
              aria-label="Previous"
            >
              &lsaquo;
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10"
              aria-label="Next"
            >
              &rsaquo;
            </button>
          </>
        )}

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="max-w-5xl max-h-[85vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="aspect-[16/10] bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-zinc-500">Image {currentIndex + 1} of {images.length}</p>
              <p className="text-zinc-600 text-sm mt-1">{images[currentIndex]}</p>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {/* TODO: navigate to index */}}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? 'bg-white w-6' : 'bg-white/30'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
