'use client'

import { useEffect } from 'react'

export default function ViewTracker({ type, slug }) {
  useEffect(() => {
    fetch('/api/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, slug }),
      keepalive: true,
    }).catch(() => {})
  }, [type, slug])

  return null
}
