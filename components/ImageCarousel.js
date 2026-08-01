'use client'

import { useState, useEffect, useCallback } from 'react'

export default function ImageCarousel({ images, className = '' }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setCurrent(i => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🐟</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group ${className}`}>
      {images.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
          style={{ backgroundImage: `url(${img})`, opacity: i === current ? 1 : 0 }}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? 'bg-white w-3 h-3' : 'bg-white/50 hover:bg-white/70 w-2.5 h-2.5'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
