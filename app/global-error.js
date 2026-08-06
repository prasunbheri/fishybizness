'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({ error, unstable_retry }) {
  useEffect(() => {
    console.error('Global error:', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <head>
        <style>{`
          body{margin:0;font-family:ui-sans-serif,system-ui,sans-serif;background:#fafafa;color:#27272a}
          .wrap{max-width:32rem;margin:6rem auto;padding:0 1rem;text-align:center}
          h1{font-size:1.75rem;font-weight:700;margin:0 0 .5rem}
          p{margin:0 0 .25rem}
          .dim{color:#71717a;font-size:.75rem;margin-bottom:1.5rem}
          button{background:#06b6d4;color:#18181b;border:0;padding:.625rem 1.5rem;border-radius:.5rem;font-weight:600;cursor:pointer}
        `}</style>
      </head>
      <body>
        <div className="wrap">
          <h1>Something went wrong</h1>
          <p>{error.message}</p>
          <p className="dim">
            {error.digest ? `Error ID: ${error.digest}` : 'An unexpected error occurred.'}
          </p>
          <button onClick={() => unstable_retry()}>Try again</button>
        </div>
      </body>
    </html>
  )
}
