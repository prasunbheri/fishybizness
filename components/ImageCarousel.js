'use client'

import { useState, useEffect, useCallback } from 'react'
import LazyBackground from './LazyBackground'

export default function ImageCarousel({ images, className = '' }) {
  const [current, setCurrent] = useState(0)
  const [prevIdx, setPrevIdx] = useState(null)
  const [isHovering, setIsHovering] = useState(false)

  const changeTo = useCallback(
    i => {
      setPrevIdx(current)
      setCurrent(i)
    },
    [current]
  )

  const next = useCallback(() => {
    setPrevIdx(current)
    setCurrent(i => (i + 1) % images.length)
  }, [images.length, current])

  const prev = useCallback(() => {
    setPrevIdx(current)
    setCurrent(i => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length, current])

  useEffect(() => {
    if (isHovering) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next, isHovering])

  useEffect(() => {
    if (prevIdx === null) return
    const timer = setTimeout(() => setPrevIdx(null), 800)
    return () => clearTimeout(timer)
  }, [current, prevIdx])

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
    <div onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <div className={`relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group ${className}`}>
        {images.map((img, i) => {
          const isActive = i === current
          const isNext = i === (current + 1) % images.length
          const isPrev = i === prevIdx
          return (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: isActive ? 1 : 0 }}
            >
              <LazyBackground
                src={isActive || isNext || isPrev ? img : null}
                eager={isActive}
                watermark
                className="w-full h-full bg-cover bg-center"
              />
            </div>
          )
        })}

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
                  onClick={() => changeTo(i)}
                  className={`rounded-full transition-all ${i === current ? 'bg-white w-3 h-3' : 'bg-white/50 hover:bg-white/70 w-2.5 h-2.5'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => changeTo(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden transition-all ${
                i === current
                  ? 'ring-2 ring-cyan-500 opacity-100'
                  : 'ring-1 ring-zinc-200 dark:ring-zinc-700 opacity-60 hover:opacity-100'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
