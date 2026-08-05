'use client'

import { useRef, useEffect } from 'react'
import { sanitizeHtml } from '@/lib/sanitize'

const toolCls =
  'w-8 h-8 rounded flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors'

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

  useEffect(() => {
    const el = ref.current
    if (el && el.innerHTML !== (valueRef.current || '')) {
      el.innerHTML = valueRef.current || ''
    }
  }, [revision])

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
