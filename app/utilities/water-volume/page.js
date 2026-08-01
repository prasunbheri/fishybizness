'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/AnimatedSection'
import Link from 'next/link'

const inputCls = "w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"

function Result({ label, value, sub }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-zinc-800 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function WaterVolumeCalculator() {
  const [unit, setUnit] = useState('cm')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [glass, setGlass] = useState('0')
  const [substrate, setSubstrate] = useState('0')
  const [fill, setFill] = useState('100')

  const cmPerUnit = unit === 'cm' ? 1 : 2.54
  const toCm = v => parseFloat(v) || 0

  const L = Math.max(0, toCm(length) * cmPerUnit)
  const W = Math.max(0, toCm(width) * cmPerUnit)
  const H = Math.max(0, toCm(height) * cmPerUnit)
  const t = Math.max(0, toCm(glass) * cmPerUnit)
  const s = Math.max(0, toCm(substrate) * cmPerUnit)
  const fillPct = Math.min(100, Math.max(0, toCm(fill))) / 100

  const innerL = Math.max(0, L - 2 * t)
  const innerW = Math.max(0, W - 2 * t)
  const innerH = Math.max(0, H - t - s)

  const grossLitres = (L * W * H) / 1000
  const waterLitres = (innerL * innerW * innerH * fillPct) / 1000
  const usGallons = waterLitres / 3.78541
  const ukGallons = waterLitres / 4.54609
  const weightKg = waterLitres
  const substrateLitres = (innerL * innerW * s) / 1000

  const hasInput = L > 0 && W > 0 && H > 0

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <AnimatedSection>
        <Link href="/utilities" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors">
          &larr; All utilities
        </Link>
        <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">Utility</span>
        <h1 className="text-3xl sm:text-4xl font-bold mt-1 mb-3 text-zinc-800 dark:text-white">Tank Water Volume Calculator</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mb-10 text-sm">
          Enter the outside dimensions of your aquarium. We calculate the actual water volume after subtracting glass thickness, substrate, and the unfilled portion at the top.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <AnimatedSection delay={0.1}>
          <div className="space-y-4">
            <div className="flex gap-2">
              {['cm', 'inches'].map(u => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    unit === u ? 'bg-cyan-500 text-white' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {u === 'cm' ? 'Centimetres' : 'Inches'}
                </button>
              ))}
            </div>

            {[
              { label: 'Length', state: length, set: setLength },
              { label: 'Width', state: width, set: setWidth },
              { label: 'Height', state: height, set: setHeight },
            ].map((f, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {f.label} ({unit})
                </label>
                <input type="number" min="0" className={inputCls} value={f.state} onChange={e => f.set(e.target.value)} placeholder="0" />
              </div>
            ))}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Glass ({unit})</label>
                <input type="number" min="0" className={inputCls} value={glass} onChange={e => setGlass(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Substrate ({unit})</label>
                <input type="number" min="0" className={inputCls} value={substrate} onChange={e => setSubstrate(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Fill %</label>
                <input type="number" min="0" max="100" className={inputCls} value={fill} onChange={e => setFill(e.target.value)} placeholder="100" />
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              Glass thickness is subtracted from all sides. Substrate is measured from the bottom of the tank and reduces water depth.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          {!hasInput ? (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 p-8 text-center text-sm text-zinc-400">
              Enter tank dimensions to see the results.
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-1">Water Volume</h3>
              <div className="grid grid-cols-2 gap-3">
                <Result label="Water Volume" value={`${waterLitres.toFixed(1)} L`} sub="after glass, substrate & fill" />
                <Result label="US Gallons" value={`${usGallons.toFixed(2)} gal`} />
                <Result label="UK Gallons" value={`${ukGallons.toFixed(2)} gal`} />
                <Result label="Water Weight" value={`≈ ${weightKg.toFixed(1)} kg`} sub="1 L fresh water ≈ 1 kg" />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Result label="Gross Volume" value={`${grossLitres.toFixed(1)} L`} sub="empty outside box" />
                <Result label="Substrate Volume" value={`${substrateLitres.toFixed(2)} L`} sub="displaced by substrate" />
              </div>
              <p className="text-xs text-zinc-400 pt-2">
                Formula: inner L × inner W × (height − substrate) × fill %, divided by 1000 for litres. Add ~10% for plants, hardscape and equipment displacement.
              </p>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  )
}
