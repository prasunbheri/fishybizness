'use client'

import { useMemo, useState } from 'react'
import AnimatedSection from '@/components/AnimatedSection'
import Link from 'next/link'
import { fishSpecies, getCompat, compatLabel, compatColor } from '@/lib/fishCompatibility'

const selectCls = "w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"

const groups = ['Livebearer', 'Tetra', 'Barb', 'Danio', 'Coldwater', 'Gourami', 'Cichlid', 'Catfish', 'Loach', 'Rainbowfish']

const legend = [
  { label: 'Compatible', dot: 'bg-green-500' },
  { label: 'Caution', dot: 'bg-amber-400' },
  { label: 'Not compatible', dot: 'bg-red-500' },
  { label: 'Same species', dot: 'bg-zinc-300 dark:bg-zinc-600' },
]

export default function FishCompatibilityPage() {
  const [fishA, setFishA] = useState(fishSpecies[0].id)
  const [fishB, setFishB] = useState(fishSpecies[1].id)

  const result = useMemo(() => {
    if (fishA === fishB) return { key: 'same', label: compatLabel.same }
    const a = fishSpecies.find(f => f.id === fishA)
    const b = fishSpecies.find(f => f.id === fishB)
    const key = getCompat(a.id, b.id)
    return {
      key,
      label: `${a.name} + ${b.name}: ${compatLabel[key]}`,
      note:
        key === 'good'
          ? 'These fish should get along in a suitably sized, planted tank.'
          : key === 'caution'
            ? 'Usually works with enough space, hiding spots and compatible temperament.'
            : key === 'bad'
              ? 'Avoid this combination — aggression, fin-nipping or predation is likely.'
              : 'Keep them in groups — these are the same species.',
    }
  }, [fishA, fishB])

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection>
        <Link href="/utilities" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors">
          &larr; Back to utilities
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-zinc-800 dark:text-white">Fish Compatibility Chart</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mb-8 text-sm">
          Check whether two fish can share a tank. Pick a pair below, or browse the full grid. The chart is a general guide — tank size, group numbers and temperament always matter.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="mb-10 p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Fish A</label>
              <select value={fishA} onChange={e => setFishA(e.target.value)} className={selectCls}>
                {fishSpecies.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Fish B</label>
              <select value={fishB} onChange={e => setFishB(e.target.value)} className={selectCls}>
                {fishSpecies.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-white">
                <span className={`inline-block w-3 h-3 rounded-full ${compatColor[result.key]}`}></span>
                {result.label}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{result.note}</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">Full Chart</h2>
          <div className="flex flex-wrap gap-4">
            {legend.map(l => (
              <span key={l.label} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${l.dot}`}></span>
                {l.label}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
          <div className="min-w-max">
            <div className="flex">
              <div className="w-32 shrink-0 pr-2"></div>
              <div className="flex">
                {fishSpecies.map(f => (
                  <div key={f.id} className="w-7 sm:w-8 text-center">
                    <span title={f.name} className="text-[9px] sm:text-[10px] text-zinc-400 leading-none">{f.name.slice(0, 4)}</span>
                  </div>
                ))}
              </div>
            </div>

            {groups.map(group => (
              <div key={group} className="mt-1">
                <div className="w-32 shrink-0 pr-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  {group}
                </div>
                {fishSpecies.filter(f => f.group === group).map(row => (
                  <div key={row.id} className="flex items-center">
                    <div className="w-32 shrink-0 pr-2 text-right">
                      <span title={row.name} className="text-xs text-zinc-700 dark:text-zinc-300">{row.name}</span>
                    </div>
                    <div className="flex">
                      {fishSpecies.map(col => {
                        const key = getCompat(row.id, col.id)
                        return (
                          <div
                            key={col.id}
                            title={`${row.name} + ${col.name}: ${compatLabel[key]}`}
                            className={`w-7 sm:w-8 h-5 m-[1px] rounded-sm ${compatColor[key]}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
