'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Field, SelectField, Note } from '@/components/utilityUi'

export default function Co2DosingPage() {
  const [kh, setKh] = useState('4')
  const [ph, setPh] = useState('7.0')
  const [volume, setVolume] = useState('100')
  const [injection, setInjection] = useState('8')

  const khNum = Math.max(0, parseFloat(kh) || 0)
  const phNum = parseFloat(ph)
  const vol = Math.max(0, parseFloat(volume) || 0)
  const hours = Math.max(1, Math.min(12, parseFloat(injection) || 8))

  const co2Ppm = !isNaN(phNum) ? Math.round(3 * khNum * Math.pow(10, 7 - phNum)) : 0

  const zone =
    co2Ppm < 15
      ? { label: 'Too low for plants', cls: 'text-cyan-600 dark:text-cyan-400', bar: 'bg-cyan-500', note: 'Add more CO2 or extend injection hours — plants will grow slowly.' }
      : co2Ppm <= 30
        ? { label: 'Ideal range', cls: 'text-green-600 dark:text-green-400', bar: 'bg-green-500', note: 'Great for healthy plant growth with no risk to fish.' }
        : co2Ppm <= 40
          ? { label: 'Watch closely', cls: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-400', note: 'Marginal zone — fish may be stressed. Increase surface agitation or cut CO2.' }
          : { label: 'Dangerous for fish', cls: 'text-red-600 dark:text-red-400', bar: 'bg-red-500', note: 'Risk of gassing fish. Stop injection and aerate heavily until ppm drops.' }

  const co2PerDay = co2Ppm >= 15 && co2Ppm <= 35 ? ((vol * co2Ppm) / 1000) * 0.8 : 0
  const bps = co2PerDay > 0 ? co2PerDay / (hours * 60 * 60) : 0

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="CO2 Dosing Calculator"
        desc="Estimate your dissolved CO2 concentration from water hardness (KH) and pH, and get a rough bubble rate to aim for in your planted tank."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Carbonate Hardness" suffix="dKH" value={kh} onChange={e => setKh(e.target.value)} placeholder="4" min="0" />
            <Field label="pH" suffix="" step="0.1" value={ph} onChange={e => setPh(e.target.value)} placeholder="7.0" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tank Volume" suffix="litres" value={volume} onChange={e => setVolume(e.target.value)} placeholder="100" min="0" />
            <SelectField
              label="Injection Hours / Day"
              value={injection}
              onChange={e => setInjection(e.target.value)}
              options={[6, 7, 8, 9, 10].map(h => ({ value: String(h), label: `${h} hours` }))}
            />
          </div>
          <Note>
            Formula: CO₂ (ppm) = 3 × KH × 10⁽⁷⁻ᵖᴴ⁾. In low-KH tanks (soft water) even a small pH swing means a lot of CO₂, so test often when the tank is lightly buffered.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Dissolved CO₂</h3>
          <div className="grid grid-cols-2 gap-3">
            <Result label="CO₂ Concentration" value={`${co2Ppm} ppm`} />
            <Result label="Suggested Bubble Rate" value={bps > 0 ? `${bps.toFixed(2)} bps` : '—'} sub="per second, rough estimate" />
          </div>

          {!isNaN(phNum) && khNum > 0 && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
              <p className={`text-sm font-semibold mb-2 ${zone.cls}`}>{zone.label}</p>
              <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                <div
                  className={`h-full ${zone.bar} transition-all`}
                  style={{ width: `${Math.min(100, (co2Ppm / 50) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>0</span>
                <span>15</span>
                <span>30</span>
                <span>50+</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">{zone.note}</p>
              <p className="text-xs text-zinc-400 mt-2">
                Bubble rate is a rough guide only — every diffuser and tank is different. Use a drop checker for real confirmation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
