'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const PER_PAGE_OPTIONS = [10, 20, 30, 40, 50]

export default function Pagination({ path, total, page, perPage }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(Math.max(1, page), totalPages)

  if (total === 0) return null

  function go(update) {
    const params = new URLSearchParams(searchParams.toString())
    update(params)
    const qs = params.toString()
    router.push(qs ? `${path}?${qs}` : path)
  }

  function setPerPage(e) {
    go(p => {
      p.set('perPage', e.target.value)
      p.delete('page')
    })
  }

  function goPage(pg) {
    go(p => {
      if (pg <= 1) p.delete('page')
      else p.set('page', String(pg))
    })
  }

  function pageNumbers() {
    const pages = []
    const start = Math.max(1, current - 2)
    const end = Math.min(totalPages, current + 2)
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('…')
    }
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('…')
      pages.push(totalPages)
    }
    return pages
  }

  const from = (current - 1) * perPage + 1
  const to = Math.min(total, current * perPage)

  const btnCls = (active) =>
    `min-w-9 h-9 px-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-cyan-500 text-white'
        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
    }`

  const navCls = (disabled) =>
    `min-w-9 h-9 px-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
      disabled
        ? 'opacity-40 cursor-not-allowed'
        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
    }`

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-12">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing {from}–{to} of {total}
        </span>
        <select
          value={perPage}
          onChange={setPerPage}
          className="text-xs px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
        >
          {PER_PAGE_OPTIONS.map(n => (
            <option key={n} value={n}>Show {n} per page</option>
          ))}
        </select>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button onClick={() => goPage(current - 1)} disabled={current === 1} className={navCls(current === 1)}>
            ‹ Prev
          </button>
          {pageNumbers().map((n, i) =>
            n === '…' ? (
              <span key={`e${i}`} className="px-1 text-zinc-400 dark:text-zinc-500 text-sm select-none">…</span>
            ) : (
              <button key={n} onClick={() => goPage(n)} className={btnCls(n === current)}>
                {n}
              </button>
            )
          )}
          <button onClick={() => goPage(current + 1)} disabled={current === totalPages} className={navCls(current === totalPages)}>
            Next ›
          </button>
        </div>
      )}
    </div>
  )
}
