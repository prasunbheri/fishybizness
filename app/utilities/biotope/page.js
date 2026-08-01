'use client'

import { useState } from 'react'
import { UtilityHeader, Toggle, Note, Empty } from '@/components/utilityUi'
import { stockingSpecies, waterLabels } from '@/lib/stockingData'

export default function BiotopePage() {
  const [water, setWater] = useState('neutral')
  const [temp, setTemp] = useState('tropical')

  const matches = stockingSpecies.filter(s => s.water.includes(water) && (temp === 'any' || s.temp === temp))
  const tempMismatch = stockingSpecies.filter(s => s.water.includes(water) && s.temp !== temp && temp !== 'any')
  const waterMismatch = stockingSpecies.filter(s => !s.water.includes(water) && (temp === 'any' || s.temp === temp))

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Stocking by Biotope"
        desc="Tell us about your water and find fish that naturally suit it. Matching your stocking to your source water means healthier fish and less fiddling with chemistry."
      />

      <div className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Your water hardness</label>
          <Toggle
            options={Object.entries(waterLabels).map(([k, label]) => ({ value: k, label }))}
            value={water}
            onChange={setWater}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tank temperature</label>
          <Toggle
            options={[
              { value: 'tropical', label: 'Tropical (24–28 °C)' },
              { value: 'cool', label: 'Cool (18–22 °C)' },
              { value: 'any', label: 'Either' },
            ]}
            value={temp}
            onChange={setTemp}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-3">
        Good matches for {waterLabels[water].split(' ')[0].toLowerCase()} water
        {temp !== 'any' && `, ${temp} tank`}
      </h3>

      {matches.length === 0 ? (
        <Empty>No species in the list match that combination — try a different hardness.</Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {matches.map(s => (
            <div key={s.id} className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <div>
                <p className="font-medium text-sm text-zinc-800 dark:text-white">{s.name}</p>
                <p className="text-xs text-zinc-400">
                  {s.group} · up to {s.adultCm} cm · keep in groups of {s.minGroup}+
                </p>
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium">
                Fits
              </span>
            </div>
          ))}
        </div>
      )}

      {temp !== 'any' && tempMismatch.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-3">Water matches, wrong temperature</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {tempMismatch.map(s => (
              <span key={s.id} className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                {s.name} ({s.temp === 'cool' ? 'cool' : 'tropical'})
              </span>
            ))}
          </div>
        </>
      )}

      {waterMismatch.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-3">Prefer different water — skip these</h3>
          <div className="flex flex-wrap gap-2">
            {waterMismatch.map(s => (
              <span key={s.id} className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                {s.name}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="mt-8">
        <Note>
          This is a general guide. Hardy species can adapt to slightly different water, but long-term health is always better when fish live in water close to what they evolved in.
        </Note>
      </div>
    </div>
  )
}
