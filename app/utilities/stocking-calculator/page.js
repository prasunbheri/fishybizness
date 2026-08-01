'use client'

import { useState } from 'react'
import { UtilityHeader, Result, SelectField, Field, Note, Empty } from '@/components/utilityUi'
import { stockingSpecies } from '@/lib/stockingData'

const cmPerLitre = 1.51

export default function StockingCalculatorPage() {
  const [volume, setVolume] = useState('')
  const [species, setSpecies] = useState('neon')
  const [qty, setQty] = useState('6')
  const [stock, setStock] = useState([])

  const tankVol = Math.max(0, parseFloat(volume) || 0)
  const qtyNum = Math.max(0, parseInt(qty, 10) || 0)

  const totalCm = stock.reduce((sum, s) => sum + s.cm * s.qty, 0)
  const litresNeeded = totalCm * cmPerLitre
  const capacity = tankVol > 0 ? Math.round((litresNeeded / tankVol) * 100) : 0

  const groupViolations = stockingSpecies
    .filter(s => s.minGroup > 1 && stock.some(i => i.id === s.id && i.qty < s.minGroup))
    .map(s => ({ name: s.name, min: s.minGroup }))

  const status =
    tankVol === 0
      ? null
      : capacity <= 80
        ? { label: 'Comfortable', cls: 'bg-green-500', note: 'Plenty of room — fish can swim freely and water stays stable.' }
        : capacity <= 100
          ? { label: 'At capacity', cls: 'bg-amber-400', note: 'Fully stocked. Watch water quality — consider extra filtration.' }
          : { label: 'Overstocked', cls: 'bg-red-500', note: 'Too many fish for this tank. Reduce stocking or upgrade the tank.' }

  function addFish() {
    const sp = stockingSpecies.find(s => s.id === species)
    if (!sp || qtyNum < 1) return
    setStock([...stock, { id: sp.id, name: sp.name, cm: sp.adultCm, qty: qtyNum }])
  }

  function removeFish(index) {
    setStock([...stock.slice(0, index), ...stock.slice(index + 1)])
  }

  function updateQty(index, qty) {
    setStock(stock.map((s, i) => (i === index ? { ...s, qty: Math.max(0, qty) } : s)))
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Stocking Calculator"
        desc="Work out how many fish your tank can safely hold. Uses the adult size of each species and the classic '1 cm of fish per 1.5 litres' rule — always on the cautious side."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Field
            label="Tank Volume"
            suffix="litres"
            value={volume}
            onChange={e => setVolume(e.target.value)}
            placeholder="0"
            min="0"
          />

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

          {stock.length > 0 && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-700">
              {stock.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-800 dark:text-white truncate">{s.name}</p>
                    <p className="text-xs text-zinc-400">~{s.cm} cm adult · {s.qty}× = {s.cm * s.qty} cm</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min="0"
                      value={s.qty}
                      onChange={e => updateQty(i, parseInt(e.target.value, 10) || 0)}
                      className="w-16 px-2 py-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeFish(i)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${s.name}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {groupViolations.length > 0 && (
            <div className="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">Shoaling fish need friends</p>
              <ul className="text-xs text-amber-700 dark:text-amber-400 list-disc list-inside space-y-0.5">
                {groupViolations.map(v => (
                  <li key={v.name}>{v.name} are happier in groups of {v.min}+.</li>
                ))}
              </ul>
            </div>
          )}

          <Note>
            Rule: 1 cm of adult fish per 1.5 litres of water (roughly the metric version of the old '1 inch per gallon'). Adult sizes are averages — large species like Oscars and Goldfish need much more space than this rule allows.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Tank Load</h3>
          {stock.length === 0 ? (
            <Empty>Add some fish to see whether your tank is comfortably stocked.</Empty>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Result label="Total Adult Length" value={`${totalCm} cm`} sub={`${stock.reduce((s, i) => s + i.qty, 0)} fish`} />
                <Result label="Water Needed" value={`${litresNeeded.toFixed(0)} L`} sub="for this stocking" />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Result label="Tank Volume" value={`${tankVol} L`} />
                <Result label="Stocking Level" value={tankVol > 0 ? `${capacity}%` : '—'} sub={status ? status.label : 'enter tank size'} />
              </div>
              {status && (
                <div className={`rounded-xl p-4 ${status.cls === 'bg-green-500' ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700' : status.cls === 'bg-amber-400' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700' : 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700'}`}>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-white mb-1">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${status.cls} mr-2 align-middle`}></span>
                    {status.label}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">{status.note}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
