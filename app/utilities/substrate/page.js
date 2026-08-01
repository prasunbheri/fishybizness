'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Field, SelectField, Note } from '@/components/utilityUi'

const substrates = [
  { id: 'aquasoil', label: 'Aqua Soil', density: 0.9, bag: 2 },
  { id: 'sand', label: 'Sand', density: 1.6, bag: 4 },
  { id: 'gravel', label: 'Gravel', density: 1.5, bag: 4 },
  { id: 'cap', label: 'Capped Clay / Laterite', density: 1.2, bag: 2 },
]

export default function SubstratePage() {
  const [length, setLength] = useState('60')
  const [width, setWidth] = useState('30')
  const [depth, setDepth] = useState('5')
  const [type, setType] = useState('aquasoil')

  const L = Math.max(0, parseFloat(length) || 0)
  const W = Math.max(0, parseFloat(width) || 0)
  const D = Math.max(0, parseFloat(depth) || 0)
  const sub = substrates.find(s => s.id === type)

  const volumeLitres = (L * W * D) / 1000
  const weightKg = volumeLitres * sub.density
  const bags = Math.ceil(volumeLitres / sub.bag)
  const bags2 = Math.ceil(volumeLitres / 2)

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Substrate Calculator"
        desc="How much substrate do you need? Enter your tank footprint and the desired depth — we'll give you the volume, weight and how many bags to buy."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Length" suffix="cm" value={length} onChange={e => setLength(e.target.value)} placeholder="60" min="0" />
            <Field label="Width" suffix="cm" value={width} onChange={e => setWidth(e.target.value)} placeholder="30" min="0" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Depth" suffix="cm" value={depth} onChange={e => setDepth(e.target.value)} placeholder="5" min="0" />
            <SelectField
              label="Substrate Type"
              value={type}
              onChange={e => setType(e.target.value)}
              options={substrates.map(s => ({ value: s.id, label: `${s.label} (${s.density.toFixed(1)} kg/L)` }))}
            />
          </div>
          <Note>
            Typical depths: 2–3 cm fine sand for bottom-dwellers, 5–8 cm planted substrate (including a nutrient layer), or ~2 cm of cap over a soil base.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">How Much Substrate</h3>
          <div className="grid grid-cols-2 gap-3">
            <Result label="Volume Needed" value={`${volumeLitres.toFixed(2)} L`} />
            <Result label="Weight" value={`${weightKg.toFixed(1)} kg`} sub={`${sub.density.toFixed(1)} kg/L`} />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Result label={`${sub.bag} L Bags`} value={`${bags}`} sub={type === 'aquasoil' || type === 'cap' ? 'usual retail size' : 'standard retail size'} />
            <Result label="2 L Bags" value={`${bags2}`} sub="if buying small bags" />
          </div>
          <Note>
            Buy slightly more than you need — substrate settles over the first weeks and you'll want a little left to top up slopes. Rinse sand and gravel before adding.
          </Note>
        </div>
      </div>
    </div>
  )
}
