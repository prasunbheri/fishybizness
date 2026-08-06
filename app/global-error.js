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
      <body className="antialiased">
        <div className="max-w-lg mx-auto my-24 px-4 text-center">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-3">Something went wrong</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 break-words">{error.message}</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
            {error.digest ? `Error ID: ${error.digest}` : 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => unstable_retry()}
            className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
