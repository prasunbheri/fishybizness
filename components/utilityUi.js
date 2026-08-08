'use client'

import AnimatedSection from './AnimatedSection'
import Link from 'next/link'

export const inputCls =
  'w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500'

export const selectCls = inputCls

export function UtilityHeader({ title, desc }) {
  return (
    <AnimatedSection>
      <Link
        href="/utilities"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors"
      >
        &larr; Back to utilities
      </Link>
      <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-zinc-800 dark:text-white">{title}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mb-10 text-sm">{desc}</p>
    </AnimatedSection>
  )
}

export function Result({ label, value, sub }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-zinc-800 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export function Toggle({ options, value, onChange, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            value === o.value
              ? 'bg-cyan-500 text-white'
              : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Field({ label, suffix, ...inputProps }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        {label}
        {suffix && <span className="text-xs text-zinc-400 font-normal ml-1">({suffix})</span>}
      </label>
      <input type="number" className={inputCls} {...inputProps} />
    </div>
  )
}

export function SelectField({ label, options, ...selectProps }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{label}</label>
      )}
      <select className={selectCls} {...selectProps}>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Empty({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 p-8 text-center text-sm text-zinc-400">
      {children}
    </div>
  )
}

export function Note({ children }) {
  return <p className="text-xs text-zinc-400 pt-2 leading-relaxed">{children}</p>
}
