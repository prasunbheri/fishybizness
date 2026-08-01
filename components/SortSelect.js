'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortSelect({ value = 'name' }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function onChange(e) {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value === 'name') params.delete('sort')
    else params.set('sort', e.target.value)
    const qs = params.toString()
    router.push(qs ? `/livestock?${qs}` : '/livestock')
  }

  return (
    <select
      value={value}
      onChange={onChange}
      className="text-xs px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
    >
      <option value="name">Sort: Name A-Z</option>
      <option value="type">Sort: Group by Type</option>
    </select>
  )
}
