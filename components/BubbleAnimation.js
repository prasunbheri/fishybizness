'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const COLORS = [
  'rgba(56, 189, 248, 0.15)',
  'rgba(34, 211, 238, 0.12)',
  'rgba(6, 182, 212, 0.10)',
  'rgba(14, 165, 233, 0.13)',
  'rgba(99, 102, 241, 0.08)',
]

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

export default function BubbleAnimation() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const bubbles = container.querySelectorAll('.bubble')
    const animations = []

    bubbles.forEach((bubble) => {
      const duration = randomBetween(8, 16)
      const delay = randomBetween(0, 5)
      const xDrift = randomBetween(-30, 30)
      const xEnd = randomBetween(-20, 20)

      const anim = bubble.animate(
        [
          { transform: `translateY(100vh) translateX(0)`, opacity: 0 },
          { transform: `translateY(80vh) translateX(${xDrift * 0.3}px)`, opacity: 1, offset: 0.1 },
          { transform: `translateY(40vh) translateX(${xDrift * 0.5}px)`, opacity: 1, offset: 0.5 },
          { transform: `translateY(0vh) translateX(${xEnd}px)`, opacity: 0 },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          iterations: Infinity,
          easing: 'linear',
        }
      )
      animations.push(anim)
    })

    return () => animations.forEach(a => a.cancel())
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: 20 }).map((_, i) => {
        const size = randomBetween(4, 14)
        const left = randomBetween(0, 100)
        const color = COLORS[i % COLORS.length]
        return (
          <div
            key={i}
            className="bubble absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: '-10px',
              background: color,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        )
      })}
    </div>
  )
}
