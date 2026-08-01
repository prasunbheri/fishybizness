'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Field, SelectField, Note } from '@/components/utilityUi'

export default function TapMixPage() {
  const [totalVolume, setTotalVolume] = useState('100')
  const [tapGh, setTapGh] = useState('14')
  const [targetGh, setTargetGh] = useState('8')
  const [unit, setUnit] = useState('gh')

  const total = Math.max(0, parseFloat(totalVolume) || 0)
  const tap = Math.max(0, parseFloat(tapGh) || 0)
  const target = Math.max(0, parseFloat(targetGh) || 0)

  const tapFraction = tap > 0 ? Math.min(1, target / tap) : 0
  const tapVolume = total * tapFraction
  const roVolume = total - tapVolume
  const targetPct = tapFraction * 100

  const possible = tap > 0 && target <= tap
  const label = unit === 'gh' ? 'dGH' : 'ppm (TDS)'

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Tap-Mix (RO/Tap) Calculator"
        desc="Mix RO/DI water with your tap water to reach a target hardness or TDS. Perfect for soft-water fish, shrimp or discus keepers."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Field label="Total Volume to Mix" suffix="litres" value={totalVolume} onChange={e => setTotalVolume(e.target.value)} placeholder="100" min="0" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tap Water Value" suffix={label} value={tapGh} onChange={e => setTapGh(e.target.value)} placeholder="14" min="0" />
            <Field label="Target Value" suffix={label} value={targetGh} onChange={e => setTargetGh(e.target.value)} placeholder="8" min="0" />
          </div>
          <SelectField
            label="Unit"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            options={[
              { value: 'gh', label: 'GH (dGH hardness)' },
              { value: 'tds', label: 'TDS (ppm)' },
            ]}
          />
          <Note>
            Mixing follows the dilution rule: tap fraction = target ÷ tap. Assumes RO water is ~0. To hit a target <i>between</i> two waters with known values, this calculator is exactly what you need.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Mixing Recipe</h3>
          {total === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 p-8 text-center text-sm text-zinc-400">
              Enter a total volume to see the mix.
            </div>
          ) : !possible ? (
            <div className="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
              Your target is harder than your tap water — you can't reach it by mixing with RO alone. Add a mineral buffer (remineralizer) instead.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Result label="Tap Water" value={`${tapVolume.toFixed(1)} L`} sub={`${targetPct.toFixed(0)}% of mix`} />
                <Result label="RO / DI Water" value={`${roVolume.toFixed(1)} L`} sub={`${(100 - targetPct).toFixed(0)}% of mix`} />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Result label="Resulting Value" value={`≈ ${target} ${label}`} sub="uniform when mixed" />
                <Result label="Total Mix" value={`${total.toFixed(0)} L`} />
              </div>
              <Note>
                Stir or circulate well after mixing. If using a remineralizer for RO, add it to the RO portion before topping the tank up.
              </Note>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
