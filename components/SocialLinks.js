'use client'

import { useState, useEffect } from 'react'
import { whatsappUrl } from '@/lib/whatsapp'
import { socialIcons, socialIconKey } from '@/components/socialIcons'

export default function SocialLinks({ className = '' }) {
  const [social, setSocial] = useState(null)

  useEffect(() => {
    fetch('/api/shop')
      .then((r) => r.json())
      .then((shop) => setSocial(shop?.social || null))
      .catch(() => setSocial(null))
  }, [])

  if (!social) return null

  const entries = Object.entries(social).filter(([_, v]) => v?.url)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {entries.map(([key, { url }]) => {
        const href = key === 'whatsapp' ? whatsappUrl(url) : url
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-cyan-400 transition-colors"
            aria-label={key}
          >
            {socialIcons[socialIconKey(key)]}
          </a>
        )
      })}
    </div>
  )
}
