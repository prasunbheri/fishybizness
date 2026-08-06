'use client'

import { useEffect } from 'react'
import { unstable_catchError } from 'next/error'
import * as Sentry from '@sentry/nextjs'

function ReportError({ error }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])
  return null
}

function ErrorFallback(props, { error, unstable_retry }) {
  return (
    <div className="rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-6 my-4">
      <ReportError error={error} />
      <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-1">Something went wrong</h3>
      <p className="text-sm text-red-600 dark:text-red-400 mb-4 break-words">{error.message}</p>
      <button
        onClick={() => unstable_retry()}
        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-900 text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

export default unstable_catchError(ErrorFallback)
