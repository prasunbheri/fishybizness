'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Field, Toggle, Note } from '@/components/utilityUi'

const presets = {
  low: { label: 'Low', lumens: [10, 20], note: 'Low-energy plants like anubias, java fern and crypts. Little to no algae pressure.' },
  medium: { label: 'Medium', lumens: [20, 40], note: 'Most stem plants, swords and carpeting with CO₂. The sweet spot for planted tanks.' },
  high: { label: 'High', lumens: [40, 60], note: "Fast growers and demanding carpets — needs CO₂ and consistent fertilization or you'll get algae." },
}

const LED_LM_PER_W = 100
const CFL_LM_PER_W = 60

export default function LightingPage() {
  const [volume, setVolume] = useState('100')
  const [intensity, setIntensity] = useState('medium')

  const vol = Math.max(0, parseFloat(volume) || 0)
  const [lo, hi] = presets[intensity].lumens

  const lumensLo = vol * lo
  const lumensHi = vol * hi
  const ledLo = lumensLo / LED_LM_PER_W
  const ledHi = lumensHi / LED_LM_PER_W
  const cflLo = lumensLo / CFL_LM_PER_W
  const cflHi = lumensHi / CFL_LM_PER_W

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Lighting Calculator"
        desc="Find the right amount of light for your planted tank. Gives a lumens and wattage range based on tank volume and your plant goals."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Field label="Tank Volume" suffix="litres" value={volume} onChange={e => setVolume(e.target.value)} placeholder="100" min="0" />
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Lighting intensity</label>
            <Toggle
              options={Object.entries(presets).map(([k, p]) => ({ value: k, label: p.label }))}
              value={intensity}
              onChange={setIntensity}
            />
          </div>
          <Note>{presets[intensity].note}</Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Recommended Light</h3>
          <div className="grid grid-cols-2 gap-3">
            <Result label="Light Output" value={vol > 0 ? `${lumensLo.toFixed(0)} – ${lumensHi.toFixed(0)} lm` : '—'} sub="lumens for the tank" />
            <Result label="LED Fixture" value={vol > 0 ? `${ledLo.toFixed(0)} – ${ledHi.toFixed(0)} W` : '—'} sub="≈100 lm/W" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Result label="T5 / CFL" value={vol > 0 ? `${cflLo.toFixed(0)} – ${cflHi.toFixed(0)} W` : '—'} sub="≈60 lm/W" />
            <Result label="Watts per Litre" value={`${(lo / 1000).toFixed(3)} – ${(hi / 1000).toFixed(3)} W/L`} sub="rule-of-thumb" />
          </div>
          <Note>
            Wattage is a rough guide — modern LEDs are far more efficient. Height matters too: light on a 60 cm-deep tank needs ~2× the lumens to reach the substrate compared to a 30 cm tank.
          </Note>
        </div>
      </div>
    </div>
  )
}
