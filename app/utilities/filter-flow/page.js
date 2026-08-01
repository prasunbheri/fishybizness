'use client'

import { useState } from 'react'
import { UtilityHeader, Result, Field, SelectField, Note } from '@/components/utilityUi'

const bioloads = {
  low: { turnover: 4, label: 'Low — few fish, planted' },
  medium: { turnover: 6, label: 'Medium — typical community' },
  heavy: { turnover: 10, label: 'Heavy — messy fish, high stocking' },
}

export default function FilterFlowPage() {
  const [volume, setVolume] = useState('100')
  const [bioload, setBioload] = useState('medium')
  const [filterLph, setFilterLph] = useState('')

  const vol = Math.max(0, parseFloat(volume) || 0)
  const lph = Math.max(0, parseFloat(filterLph) || 0)
  const turnover = bioloads[bioload].turnover

  const minFlow = vol * turnover
  const maxFlow = vol * (turnover + 2)
  const actual = vol > 0 && lph > 0 ? lph / vol : 0

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <UtilityHeader
        title="Filter Flow Calculator"
        desc="Choose a filter that matches your tank. Flow should turn the whole tank over several times an hour — more for heavy stocking."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Field label="Tank Volume" suffix="litres" value={volume} onChange={e => setVolume(e.target.value)} placeholder="100" min="0" />
          <SelectField
            label="Bioload"
            value={bioload}
            onChange={e => setBioload(e.target.value)}
            options={Object.entries(bioloads).map(([k, v]) => ({ value: k, label: v.label }))}
          />
          <Field
            label="Your Filter"
            suffix="L/h"
            value={filterLph}
            onChange={e => setFilterLph(e.target.value)}
            placeholder="600"
            min="0"
          />
          <Note>
            Flow rates on filter boxes are measured without media. Expect 30–50% less in real use with sponges and ceramics — add a flow divider or point the outlet at the glass if it's too strong.
          </Note>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Recommended Flow</h3>
          <div className="grid grid-cols-2 gap-3">
            <Result label="Target Turnover" value={`${turnover}× / hour`} sub="whole tank per hour" />
            <Result label="Flow Range" value={vol > 0 ? `${minFlow.toFixed(0)} – ${maxFlow.toFixed(0)} L/h` : '—'} sub="filter rating" />
          </div>
          {lph > 0 && vol > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Result label="Your Turnover" value={`${actual.toFixed(1)}× / hour`} sub={`${lph.toFixed(0)} L/h filter`} />
              <Result
                label="Verdict"
                value={actual >= turnover ? 'Good' : 'Under-powered'}
                sub={actual >= turnover ? 'covers your bioload' : 'consider a bigger filter'}
              />
            </div>
          )}
          <Note>
            Heads-up: flow ≠ filtration quality. A slightly slow filter with good media beats a fast one with none. Aim for the middle of the range, then tune with the tank's inhabitants and plants.
          </Note>
        </div>
      </div>
    </div>
  )
}
