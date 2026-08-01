'use client'

import { useRef, useState, useEffect } from 'react'
import { loadImage } from '@/lib/image-loader'

const WATERMARK_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
    <defs>
      <pattern id="wm" width="110" height="110" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
        <text x="0" y="55" font-size="13" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.55)" transform="translate(0 0)">Fishy Bizness</text>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#wm)"/>
  </svg>`
)}`

export default function LazyBackground({ src, className = '', eager = false, watermark = false, children }) {
  const ref = useRef(null)
  const prevSrc = useRef(src)
  const [status, setStatus] = useState(eager && src ? 'loading' : 'idle')
  const [loadedSrc, setLoadedSrc] = useState(null)

  useEffect(() => {
    if (src !== prevSrc.current) {
      prevSrc.current = src
      setLoadedSrc(null)
      setStatus('idle')
    }
  }, [src])

  useEffect(() => {
    if (status !== 'idle' || !src) return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setStatus('loading')
      return
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          io.disconnect()
          setStatus('loading')
        }
      },
      { rootMargin: '400px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [status, src])

  useEffect(() => {
    if (status !== 'loading' || !src) return
    const cancel = loadImage(src, {
      onLoad: () => {
        setLoadedSrc(src)
        setStatus('loaded')
      },
      onError: () => setStatus('failed'),
    })
    return () => cancel()
  }, [status, src])

  const show = status === 'loaded' && src && loadedSrc === src

  return (
    <div
      ref={ref}
      className={className}
      style={show ? { backgroundImage: `url(${src})` } : undefined}
      onContextMenu={e => e.preventDefault()}
      onDragStart={e => e.preventDefault()}
    >
      {watermark && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            userSelect: 'none',
            WebkitUserDrag: 'none',
            backgroundImage: `url("${WATERMARK_SVG}")`,
          }}
        />
      )}
      {children}
    </div>
  )
}
