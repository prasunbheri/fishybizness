'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Field, SelectField, Note } from '@/components/utilityUi'

const presets = {
  low: { no3: 5, po4: 0.5, k: 5, label: 'Low light / slow growers' },
  medium: { no3: 10, po4: 1, k: 10, label: 'Medium light, regular plants' },
  high: { no3: 20, po4: 2, k: 20, label: 'High light / fast growers (EI-style)' },
}

function gramsPerWeek(rise, volume, factor) {
  return (rise * volume * factor) / 1000
}

export default function FertilizerDosingPage() {
  const [volume, setVolume] = useState('100')
  const [preset, setPreset] = useState('medium')
  const [no3, setNo3] = useState('10')
  const [po4, setPo4] = useState('1')
  const [k, setK] = useState('10')
  const [doses, setDoses] = useState('3')

  const vol = Math.max(0, parseFloat(volume) || 0)
  const dosesNum = Math.max(1, parseInt(doses, 10) || 3)

  function applyPreset(p) {
    setPreset(p)
    const v = presets[p]
    setNo3(String(v.no3))
    setPo4(String(v.po4))
    setK(String(v.k))
  }

  const kno3 = gramsPerWeek(parseFloat(no3) || 0, vol, 1.63)
  const kh2po4 = gramsPerWeek(parseFloat(po4) || 0, vol, 1.43)
  const k2so4 = gramsPerWeek(parseFloat(k) || 0, vol, 2.23)

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Fertilizer Dosing Calculator"
        desc="Work out how many grams of dry salts (KNO₃, KH₂PO₄, K₂SO₄) to add each week to hit your target N-P-K levels in parts per million."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Field label="Tank Volume" suffix="litres" value={volume} onChange={e => setVolume(e.target.value)} placeholder="100" min="0" />

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Intensity preset</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(presets).map(([key, p]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    preset === key
                      ? 'bg-cyan-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Nitrate" suffix="ppm/wk" value={no3} onChange={e => setNo3(e.target.value)} min="0" />
            <Field label="Phosphate" suffix="ppm/wk" step="0.1" value={po4} onChange={e => setPo4(e.target.value)} min="0" />
            <Field label="Potassium" suffix="ppm/wk" value={k} onChange={e => setK(e.target.value)} min="0" />
          </div>

          <SelectField
            label="Doses per week"
            value={doses}
            onChange={e => setDoses(e.target.value)}
            options={[1, 2, 3, 4, 5, 6, 7].map(d => ({ value: String(d), label: `${d}× per week` }))}
          />

          <Note>
            Target ppm is the weekly rise, not the absolute level — your water change resets the tank each week. Defaults are classic low-tech (10/1/10) and EI-style (20/2/20) values.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Dry Salts per Week</h3>
          <div className="grid grid-cols-2 gap-3">
            <Result label="KNO₃" value={vol > 0 ? `${kno3.toFixed(2)} g` : '—'} sub="nitrate source" />
            <Result label="KH₂PO₄" value={vol > 0 ? `${kh2po4.toFixed(2)} g` : '—'} sub="phosphate source" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Result label="K₂SO₄" value={vol > 0 ? `${k2so4.toFixed(2)} g` : '—'} sub="potassium source" />
            <Result label="Per Dose" value={vol > 0 ? `${((kno3 + kh2po4 + k2so4) / dosesNum).toFixed(2)} g` : '—'} sub={`split over ${dosesNum} doses`} />
          </div>
          <Note>
            Weigh dry salts to ±0.1 g. Split the weekly total evenly across your doses. For traces, a pinch of a commercial trace mix after each water change is enough for most tanks.
          </Note>
        </div>
      </div>
    </div>
  )
}
