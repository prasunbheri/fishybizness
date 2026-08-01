'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Field, SelectField, Note } from '@/components/utilityUi'

const DECHLOR_PER_L = 1 / 40

export default function WaterChangePage() {
  const [volume, setVolume] = useState('100')
  const [percent, setPercent] = useState('25')
  const [frequency, setFrequency] = useState('7')

  const vol = Math.max(0, parseFloat(volume) || 0)
  const pct = Math.min(100, Math.max(0, parseFloat(percent) || 0))
  const freq = Math.max(1, parseInt(frequency, 10) || 7)

  const litres = (vol * pct) / 100
  const usGallons = litres / 3.78541
  const ukGallons = litres / 4.54609
  const dechlorMl = litres * DECHLOR_PER_L
  const changesPerMonth = 30 / freq
  const monthlyLitres = litres * changesPerMonth

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Water Change Calculator"
        desc="Work out exactly how many litres to remove for a partial water change, plus the dechlorinator dose for the fresh water you add."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Field label="Tank Volume" suffix="litres" value={volume} onChange={e => setVolume(e.target.value)} placeholder="100" min="0" />
          <Field label="Change Size" suffix="%" value={percent} onChange={e => setPercent(e.target.value)} placeholder="25" min="0" max="100" />
          <SelectField
            label="How often"
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
            options={[
              { value: '3', label: 'Every 3 days' },
              { value: '7', label: 'Weekly' },
              { value: '14', label: 'Every 2 weeks' },
              { value: '30', label: 'Monthly' },
            ]}
          />
          <Note>
            A 25% weekly change is a solid default for most tanks. Heavy-stocked or messy tanks do better with 30–50% weekly. Dechlorinator dose assumes the standard 1 mL per 40 L — check your bottle's label.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Change Volume</h3>
          <div className="grid grid-cols-2 gap-3">
            <Result label="Water to Remove" value={`${litres.toFixed(1)} L`} sub={`${pct.toFixed(0)}% of tank`} />
            <Result label="US Gallons" value={`${usGallons.toFixed(2)} gal`} />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Result label="Dechlorinator Dose" value={`${dechlorMl.toFixed(2)} mL`} sub="for the fresh water" />
            <Result label="UK Gallons" value={`${ukGallons.toFixed(2)} gal`} />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Result label="Per Month" value={`${monthlyLitres.toFixed(0)} L`} sub={`${changesPerMonth.toFixed(1)} changes`} />
            <Result label="Monthly Dechlorinator" value={`${(dechlorMl * changesPerMonth).toFixed(1)} mL`} />
          </div>
          <Note>
            Match the temperature of the new water and dose dechlorinator before or during refill. Never rinse filter media in tap water.
          </Note>
        </div>
      </div>
    </div>
  )
}
