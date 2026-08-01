'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Field, SelectField, Note, Empty } from '@/components/utilityUi'
import { stockingSpecies, estimateFishWeightGrams } from '@/lib/stockingData'

export default function FeedingCalculatorPage() {
  const [species, setSpecies] = useState('neon')
  const [qty, setQty] = useState('6')
  const [feedings, setFeedings] = useState('2')
  const [mode, setMode] = useState('adult')
  const [stock, setStock] = useState([])

  const qtyNum = Math.max(0, parseInt(qty, 10) || 0)
  const feedingsNum = Math.max(1, parseInt(feedings, 10) || 2)
  const pct = mode === 'adult' ? 0.015 : 0.03

  const totalWeight = stock.reduce((sum, s) => sum + s.weight * s.qty, 0)
  const dailyGrams = totalWeight * pct
  const perFeeding = dailyGrams / feedingsNum
  const weeklyGrams = dailyGrams * 7
  const pinchesPerFeeding = perFeeding / 0.5

  function addFish() {
    const sp = stockingSpecies.find(s => s.id === species)
    if (!sp || qtyNum < 1) return
    setStock([...stock, { id: sp.id, name: sp.name, cm: sp.adultCm, weight: estimateFishWeightGrams(sp.adultCm), qty: qtyNum }])
  }

  function removeFish(index) {
    setStock([...stock.slice(0, index), ...stock.slice(index + 1)])
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Feeding Calculator"
        desc="Estimate how much food your fish need each day. Based on total adult body weight — about 1.5% for adults and 3% for growing fish."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-1">
              <SelectField
                label="Species"
                value={species}
                onChange={e => setSpecies(e.target.value)}
                options={stockingSpecies.map(s => ({ value: s.id, label: s.name }))}
              />
            </div>
            <div>
              <Field label="How many" suffix="" value={qty} onChange={e => setQty(e.target.value)} placeholder="6" min="0" />
            </div>
            <button
              type="button"
              onClick={addFish}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 transition-colors"
            >
              Add to tank
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Feedings per day"
              value={feedings}
              onChange={e => setFeedings(e.target.value)}
              options={[1, 2, 3].map(d => ({ value: String(d), label: `${d}× per day` }))}
            />
            <SelectField
              label="Fish life stage"
              value={mode}
              onChange={e => setMode(e.target.value)}
              options={[
                { value: 'adult', label: 'Adult (1.5%)' },
                { value: 'grow', label: 'Growing (3%)' },
              ]}
            />
          </div>

          {stock.length > 0 && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-700">
              {stock.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-800 dark:text-white truncate">{s.name}</p>
                    <p className="text-xs text-zinc-400">{s.qty}× adult ≈ {s.weight * s.qty} g</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFish(i)}
                    className="text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                    aria-label={`Remove ${s.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <Note>
            Weights are estimated from adult length (0.015 × cm³) — a typical rule for aquarium fish. Feeding 1.5% of body weight daily is enough for adults; young fish need about double. Feed only what they eat in 1–2 minutes.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Daily Food</h3>
          {stock.length === 0 ? (
            <Empty>Add some fish to estimate their food needs.</Empty>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Result label="Total Biomass" value={`${totalWeight.toFixed(0)} g`} sub={`${stock.reduce((s, i) => s + i.qty, 0)} fish`} />
                <Result label="Daily Food" value={`${dailyGrams.toFixed(1)} g`} sub={mode === 'adult' ? 'adult maintenance' : 'growth rate'} />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Result label="Per Feeding" value={`${perFeeding.toFixed(2)} g`} sub={`${feedingsNum} feedings/day`} />
                <Result label="≈ Pinches" value={`${pinchesPerFeeding.toFixed(1)}`} sub="≈ 0.5 g per pinch" />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Result label="Weekly" value={`${weeklyGrams.toFixed(1)} g`} />
                <Result label="Per Fish / Day" value={stock.length > 0 ? `${(dailyGrams / stock.reduce((s, i) => s + i.qty, 0)).toFixed(2)} g` : '—'} sub="average across tank" />
              </div>
              <Note>
                A pinch of flakes is roughly 0.5 g. Skip a fast day once a week — it keeps water cleaner and fish healthier.
              </Note>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
