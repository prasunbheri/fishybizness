'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import LazyBackground from './LazyBackground'

function HeroVideo({ src }) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

function HeroSlideshow({ images }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <>
      {images.map((img, i) => {
        const isActive = i === current
        const isNext = i === (current + 1) % images.length
        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: isActive ? 1 : 0 }}
          >
            <LazyBackground
              src={isActive || isNext ? img : null}
              eager={isActive}
              className="w-full h-full bg-cover bg-center"
            />
          </div>
        )
      })}
    </>
  )
}

export default function Hero({ shop }) {
  const [hero, setHero] = useState(null)

  useEffect(() => {
    fetch('/api/hero')
      .then(r => r.json())
      .then(setHero)
      .catch(() => setHero(null))
  }, [])

  const hasMedia = hero && (
    (hero.type === 'video' && hero.video) ||
    (hero.type === 'images' && hero.images?.length > 0)
  )

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cyan-950 via-blue-950 to-zinc-900">
      {hasMedia && (
        <div className="absolute inset-0">
          {hero.type === 'video' ? (
            <HeroVideo src={hero.video} />
          ) : (
            <HeroSlideshow images={hero.images} />
          )}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)]" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="[text-shadow:_0_2px_12px_rgb(0_0_0_/_0.6)]"
        >
          <span className="inline-block text-6xl mb-6 [text-shadow:_0_4px_20px_rgb(0_0_0_/_0.7)]">🐠</span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4">
            {shop.shopName}
          </h1>
          <p className="text-lg sm:text-xl text-cyan-200/90 font-medium mb-2">
            {shop.tagline}
          </p>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto mb-8">
            {shop.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/projects"
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-semibold rounded-full transition-all hover:scale-105"
          >
            View Our Work
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 border border-zinc-500/50 text-zinc-200 hover:bg-white/10 font-semibold rounded-full transition-all hover:scale-105"
          >
            Browse Products
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-zinc-400 [text-shadow:_0_2px_8px_rgb(0_0_0_/_0.7)]"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
