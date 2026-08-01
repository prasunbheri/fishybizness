'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Field, Note } from '@/components/utilityUi'

function glassThickness(length, height) {
  const table = [
    { height: 40, cols: [[60, 6], [90, 8], [120, 10], [Infinity, 12]] },
    { height: 50, cols: [[60, 6], [90, 8], [120, 10], [150, 12], [Infinity, 15]] },
    { height: 60, cols: [[90, 8], [120, 10], [150, 12], [Infinity, 15]] },
    { height: 75, cols: [[120, 10], [150, 12], [180, 15], [Infinity, 19]] },
    { height: Infinity, cols: [[120, 12], [150, 15], [Infinity, 19]] },
  ]
  const row = table.find(r => height <= r.height)
  const col = row.cols.find(([maxL]) => length <= maxL)
  return col[1]
}

export default function GlassThicknessPage() {
  const [length, setLength] = useState('60')
  const [height, setHeight] = useState('40')
  const [brackets, setBrackets] = useState(true)

  const L = Math.max(0, parseFloat(length) || 0)
  const H = Math.max(0, parseFloat(height) || 0)

  const mm = L > 0 && H > 0 ? glassThickness(L, H) : 0
  const braced = L > 120
  const recommendation =
    mm === 0
      ? '—'
      : braced && brackets
        ? `${mm} mm with top braces`
        : braced
          ? `${mm + 2} mm (or ${mm} mm with top braces)`
          : `${mm} mm`

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Glass Thickness Calculator"
        desc="Choose safe glass thickness for your custom aquarium based on its length and height. Water pressure grows quickly with height — thicker glass stops bowing and blowouts."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Length" suffix="cm" value={length} onChange={e => setLength(e.target.value)} placeholder="60" min="0" />
            <Field label="Height" suffix="cm" value={height} onChange={e => setHeight(e.target.value)} placeholder="40" min="0" />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="brackets"
              checked={brackets}
              onChange={e => setBrackets(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="brackets" className="text-sm text-zinc-700 dark:text-zinc-300">
              I'll add top braces (recommended for tanks over 120 cm)
            </label>
          </div>
          <Note>
            This uses a standard aquarium glass table. For tanks taller than ~60 cm, serious DIYers use thicker glass or euro-bracing. Always oversize on the safe side — a flooded floor costs more than thicker glass.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Recommended Glass</h3>
          <div className="grid grid-cols-2 gap-3">
            <Result label="Thickness" value={recommendation} sub={`${mm} mm base rating`} />
            <Result label="Panel Height" value={`${H.toFixed(0)} cm`} sub="drives the pressure" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Result label="Length" value={`${L.toFixed(0)} cm`} />
            <Result label="Top Braces" value={braced ? 'Strongly advised' : 'Not required'} sub={braced ? 'tanks this long bow without them' : 'under 120 cm'} />
          </div>
          <Note>
            Height matters most — doubling the height roughly quadruples the pressure on the bottom panels. Keep the tank on a flat, level stand with a foam leveling mat underneath.
          </Note>
        </div>
      </div>
    </div>
  )
}
