'use client'

import { useRef, useEffect, useState } from 'react'
import { sanitizeHtml } from '@/lib/sanitize'

const toolCls =
  'w-8 h-8 rounded flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors'

const PRESET_SIZES = [12, 14, 16, 18, 20, 24, 32]

function ToolbarButton({ label, title, onClick }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      className={toolCls}
    >
      {label}
    </button>
  )
}

export default function RichTextEditor({ value = '', onChange, placeholder = '', minHeight = '120px', revision = 0 }) {
  const ref = useRef(null)
  const valueRef = useRef(value)
  valueRef.current = value
  const savedRangeRef = useRef(null)
  const sizeWrapRef = useRef(null)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [sizeValue, setSizeValue] = useState('16')

  useEffect(() => {
    const el = ref.current
    if (el && el.innerHTML !== (valueRef.current || '')) {
      el.innerHTML = valueRef.current || ''
    }
  }, [revision])

  useEffect(() => {
    if (!sizeOpen) return
    function onDocMouseDown(e) {
      if (sizeWrapRef.current && !sizeWrapRef.current.contains(e.target)) {
        setSizeOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [sizeOpen])

  function handleInput() {
    if (ref.current) onChange(sanitizeHtml(ref.current.innerHTML))
  }

  function exec(cmd, val = null) {
    document.execCommand(cmd, false, val)
    if (ref.current) onChange(sanitizeHtml(ref.current.innerHTML))
  }

  function addLink() {
    const url = prompt('Enter link URL (https://...)')
    if (url) exec('createLink', url)
  }

  function toggleSize() {
    if (sizeOpen) {
      setSizeOpen(false)
      return
    }
    const sel = window.getSelection()
    savedRangeRef.current = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null
    setSizeOpen(true)
  }

  function applyFontSize(px) {
    const el = ref.current
    const saved = savedRangeRef.current
    const n = Math.round(Number(px))
    if (!el || !saved || saved.collapsed || !n || n < 8 || n > 72) return
    const sel = window.getSelection()
    el.focus()
    sel.removeAllRanges()
    sel.addRange(saved)
    const div = document.createElement('div')
    div.appendChild(saved.cloneContents())
    document.execCommand('styleWithCSS', false, true)
    document.execCommand('insertHTML', false, `<span style="font-size:${n}px">${div.innerHTML}</span>`)
    setSizeOpen(false)
    if (ref.current) onChange(sanitizeHtml(ref.current.innerHTML))
  }

  function applyPreset(n) {
    setSizeValue(String(n))
    applyFontSize(n)
  }

  return (
    <div className="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus-within:ring-2 focus-within:ring-cyan-500 overflow-hidden">
      <div className="flex flex-wrap gap-0.5 p-1 border-b border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/60">
        <ToolbarButton label={<span className="font-bold">B</span>} title="Bold" onClick={() => exec('bold')} />
        <ToolbarButton label={<span className="italic">I</span>} title="Italic" onClick={() => exec('italic')} />
        <ToolbarButton label={<span className="underline">U</span>} title="Underline" onClick={() => exec('underline')} />
        <ToolbarButton label={<span className="line-through">S</span>} title="Strikethrough" onClick={() => exec('strikeThrough')} />
        <span className="w-px bg-zinc-200 dark:bg-zinc-600 mx-1 self-stretch" />
        <ToolbarButton label="H2" title="Heading 2" onClick={() => exec('formatBlock', 'h2')} />
        <ToolbarButton label="H3" title="Heading 3" onClick={() => exec('formatBlock', 'h3')} />
        <ToolbarButton label="¶" title="Paragraph" onClick={() => exec('formatBlock', 'p')} />
        <span className="w-px bg-zinc-200 dark:bg-zinc-600 mx-1 self-stretch" />
        <ToolbarButton label="•≡" title="Bullet list" onClick={() => exec('insertUnorderedList')} />
        <ToolbarButton label="1≡" title="Numbered list" onClick={() => exec('insertOrderedList')} />
        <span className="w-px bg-zinc-200 dark:bg-zinc-600 mx-1 self-stretch" />
        <ToolbarButton label="🔗" title="Insert link" onClick={addLink} />
        <ToolbarButton label="🔓" title="Remove link" onClick={() => exec('unlink')} />
        <ToolbarButton label="Tx" title="Clear formatting" onClick={() => exec('removeFormat')} />
        <span className="w-px bg-zinc-200 dark:bg-zinc-600 mx-1 self-stretch" />
        <div className="relative" ref={sizeWrapRef}>
          <button
            type="button"
            title="Font size"
            aria-label="Font size"
            onMouseDown={e => e.preventDefault()}
            onClick={toggleSize}
            className={`${toolCls} w-auto px-2 text-xs`}
          >
            T {sizeValue}
          </button>
          {sizeOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 p-2 shadow-lg">
              <div className="flex items-center gap-1 mb-2">
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={sizeValue}
                  onChange={e => setSizeValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') applyFontSize(sizeValue)
                  }}
                  className="w-16 px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">px</span>
                <button
                  type="button"
                  onClick={() => applyFontSize(sizeValue)}
                  className="ml-auto px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-zinc-900 text-xs font-semibold transition-colors"
                >
                  Apply
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {PRESET_SIZES.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => applyPreset(n)}
                    className={`w-8 h-7 rounded text-xs transition-colors ${n === Math.round(Number(sizeValue))
                      ? 'bg-cyan-500 text-zinc-900 font-semibold'
                      : 'bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        className="px-3 py-2 text-sm text-zinc-800 dark:text-white focus:outline-none rich-editor"
        style={{ minHeight }}
      />
    </div>
  )
}
