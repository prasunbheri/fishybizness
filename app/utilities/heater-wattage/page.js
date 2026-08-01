'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Field, Note } from '@/components/utilityUi'

const standardSizes = [50, 75, 100, 150, 200, 250, 300]

function nextSize(w) {
  for (const s of standardSizes) {
    if (w <= s) return s
  }
  return Math.ceil(w / 100) * 100
}

export default function HeaterWattagePage() {
  const [volume, setVolume] = useState('100')
  const [room, setRoom] = useState('20')
  const [target, setTarget] = useState('25')
  const [insulated, setInsulated] = useState('normal')

  const vol = Math.max(0, parseFloat(volume) || 0)
  const roomC = parseFloat(room)
  const targetC = parseFloat(target)

  const factor = insulated === 'normal' ? 0.12 : insulated === 'cold' ? 0.17 : 0.09
  const delta = !isNaN(roomC) && !isNaN(targetC) ? Math.max(0, targetC - roomC) : 0
  const watts = vol * factor * delta
  const rec = watts > 0 ? nextSize(watts) : 0
  const twoHeaters = rec >= 200 && vol >= 100

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Heater Wattage Calculator"
        desc="Find the right heater size for your aquarium based on tank volume, room temperature and the temperature you want to hold."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Field label="Tank Volume" suffix="litres" value={volume} onChange={e => setVolume(e.target.value)} placeholder="100" min="0" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Room Temp" suffix="°C" value={room} onChange={e => setRoom(e.target.value)} placeholder="20" />
            <Field label="Target Temp" suffix="°C" value={target} onChange={e => setTarget(e.target.value)} placeholder="25" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Room situation</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'warm', label: 'Warm room / lid' },
                { value: 'normal', label: 'Normal room' },
                { value: 'cold', label: 'Cold room / draughty' },
              ].map(o => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setInsulated(o.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    insulated === o.value
                      ? 'bg-cyan-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <Note>
            Rule of thumb: about 0.12 W per litre per °C of temperature rise needed. Tropical tanks in normal rooms (20 °C room, 25 °C target) usually need 2.5–3 W per litre.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Heater Size</h3>
          <div className="grid grid-cols-2 gap-3">
            <Result label="Temperature Rise" value={`${delta.toFixed(1)} °C`} />
            <Result label="Calculated Power" value={`${watts.toFixed(0)} W`} />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Result label="Recommended Heater" value={rec > 0 ? `${rec} W` : '—'} sub="nearest standard size" />
            <Result label="Setup" value={rec > 0 ? (twoHeaters ? `${rec / 2} W × 2` : `1 × ${rec} W`) : '—'} sub={twoHeaters ? 'two smaller, one each end' : 'single heater'} />
          </div>
          <Note>
            For tanks over ~100 L it's safer to run two smaller heaters — if one fails you still have heating. Always size up slightly rather than down; heaters cycle on and off to hold temperature.
          </Note>
        </div>
      </div>
    </div>
  )
}
