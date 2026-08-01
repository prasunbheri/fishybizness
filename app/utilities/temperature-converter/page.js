'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Note } from '@/components/utilityUi'
import { Field } from '@/components/utilityUi'

function toC(value, unit) {
  const v = parseFloat(value)
  if (isNaN(v)) return NaN
  if (unit === 'C') return v
  if (unit === 'F') return (v - 32) / 1.8
  return v - 273.15
}

function fmt(v) {
  if (isNaN(v)) return ''
  return (Math.round(v * 100) / 100).toFixed(2)
}

export default function TemperatureConverterPage() {
  const [c, setC] = useState('25')
  const [f, setF] = useState('77')
  const [k, setK] = useState('298.15')

  function updateC(v) {
    setC(v)
    const t = toC(v, 'C')
    setF(isNaN(t) ? '' : (t * 1.8 + 32).toFixed(2))
    setK(isNaN(t) ? '' : (t + 273.15).toFixed(2))
  }

  function updateF(v) {
    setF(v)
    const t = toC(v, 'F')
    setC(isNaN(t) ? '' : t.toFixed(2))
    setK(isNaN(t) ? '' : (t + 273.15).toFixed(2))
  }

  function updateK(v) {
    setK(v)
    const t = toC(v, 'K')
    setC(isNaN(t) ? '' : t.toFixed(2))
    setF(isNaN(t) ? '' : (t * 1.8 + 32).toFixed(2))
  }

  const cNum = parseFloat(c)
  const fNum = parseFloat(f)
  const kNum = parseFloat(k)

  const zone =
    !isNaN(cNum)
      ? cNum < 10
        ? { label: 'Coldwater fish range', note: 'Goldfish, white cloud minnows.' }
        : cNum <= 20
          ? { label: 'Cool / unheated range', note: 'Some loaches and temperate species.' }
          : cNum <= 26
            ? { label: 'Ideal tropical range', note: '24–26 °C suits most community fish.' }
            : cNum <= 30
              ? { label: 'Warm — discus & bettas', note: 'Discus, bettas and some cichlids.' }
              : { label: 'Too hot for most fish', note: 'Above ~30 °C stresses most species.' }
      : null

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Temperature Converter"
        desc="Convert aquarium temperatures between Celsius, Fahrenheit and Kelvin. Type in any field — the others update instantly."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Field label="Celsius" suffix="°C" value={c} onChange={e => updateC(e.target.value)} step="0.1" />
          <Field label="Fahrenheit" suffix="°F" value={f} onChange={e => updateF(e.target.value)} step="0.1" />
          <Field label="Kelvin" suffix="K" value={k} onChange={e => updateK(e.target.value)} step="0.1" />
          <Note>
            Common tank temps: 20 °C = 68 °F (goldfish), 25 °C = 77 °F (most tropicals), 28 °C = 82.4 °F (discus). Keep the thermometer at the opposite end to the heater for a true average.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Temperature Guide</h3>
          <div className="grid grid-cols-2 gap-3">
            <Result label="Celsius" value={`${fmt(cNum)} °C`} />
            <Result label="Fahrenheit" value={`${fmt(fNum)} °F`} />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Result label="Kelvin" value={`${fmt(kNum)} K`} />
            <Result label="Water Temp Zone" value={zone ? zone.label : '—'} />
          </div>
          {zone && <Note>{zone.note}</Note>}
        </div>
      </div>
    </div>
  )
}
