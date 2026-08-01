'use client'

import { useRef, useState, useEffect } from 'react'
import { loadImage } from '@/lib/image-loader'

export default function LazyBackground({ src, className = '', eager = false, children }) {
  const ref = useRef(null)
  const prevSrc = useRef(src)
  const [status, setStatus] = useState(eager && src ? 'loading' : 'idle')
  const [loadedSrc, setLoadedSrc] = useState(null)

  useEffect(() => {
    if (src !== prevSrc.current) {
      prevSrc.current = src
      setLoadedSrc(null)
      setStatus(src ? 'idle' : 'idle')
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
    <div ref={ref} className={className} style={show ? { backgroundImage: `url(${src})` } : undefined}>
      {children}
    </div>
  )
}
