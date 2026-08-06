'use client'

import { useEffect, useRef, useState } from 'react'
import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle, Color, FontFamily, FontSize } from '@tiptap/extension-text-style'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { Placeholder } from '@tiptap/extension-placeholder'
import { sanitizeHtml } from '@/lib/sanitize'

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48]
const FONT_FAMILIES = [
  { label: 'Font family', value: '' },
  { label: 'Default', value: 'ui-sans-serif, system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Monospace', value: 'ui-monospace, SFMono-Regular, monospace' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet', value: '"Trebuchet MS", Helvetica, sans-serif' },
]
const COLORS = ['#18181b', '#e11d48', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#2563eb', '#7c3aed']

const toolbarBtn =
  'w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors'
const toolbarBtnOn =
  'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500/40'
const toolbarBtnOff =
  'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
const divCls = 'w-px bg-zinc-200 dark:bg-zinc-600 mx-1 self-stretch'
const selectCls =
  'h-8 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs px-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500'

function ToolbarButton({ onClick, active, title, disabled, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={`${toolbarBtn} ${active ? toolbarBtnOn : toolbarBtnOff} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value = '', onChange, placeholder = '', minHeight = '140px', revision = 0 }) {
  const [initialValue] = useState(() => value)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const popupRef = useRef(null)
  const sizePopupRef = useRef(null)
  const savedSelRef = useRef(null)

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          undoRedo: false,
          link: {
            openOnClick: false,
            autolink: true,
            linkOnPaste: true,
            HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
          },
          heading: { levels: [1, 2, 3] },
        }),
        TextStyle,
        Color,
        FontFamily,
        FontSize,
        TextAlign.configure({ types: ['heading', 'paragraph', 'blockquote'] }),
        Highlight.configure({ multicolor: true }),
        Placeholder.configure({ placeholder }),
      ],
      content: initialValue || '',
      editorProps: {
        attributes: {
          class: 'tiptap rich-editor px-3 py-2 text-sm text-zinc-800 dark:text-white focus:outline-none',
          style: `min-height:${minHeight}`,
        },
      },
      onUpdate({ editor }) {
        if (!editor.isDestroyed) onChange(sanitizeHtml(editor.getHTML()))
      },
      immediatelyRender: true,
    },
    []
  )

  const state = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null
      const textStyle = editor.getAttributes('textStyle')
      return {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike'),
        code: editor.isActive('code'),
        highlight: editor.isActive('highlight'),
        link: editor.isActive('link'),
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        blockquote: editor.isActive('blockquote'),
        codeBlock: editor.isActive('codeBlock'),
        alignCenter: editor.isActive({ textAlign: 'center' }),
        alignRight: editor.isActive({ textAlign: 'right' }),
        alignJustify: editor.isActive({ textAlign: 'justify' }),
        blockType: editor.isActive('heading', { level: 1 })
          ? 'heading1'
          : editor.isActive('heading', { level: 2 })
            ? 'heading2'
            : editor.isActive('heading', { level: 3 })
              ? 'heading3'
              : 'paragraph',
        color: textStyle.color || '',
        fontFamily: textStyle.fontFamily || '',
        fontSize: textStyle.fontSize || '',
      }
    },
  })

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    const html = sanitizeHtml(value || '')
    if (editor.getHTML() !== html) {
      editor.commands.setContent(html, { emitUpdate: false })
    }
  }, [editor, value, revision])

  useEffect(() => {
    if (!sizeOpen && !colorOpen) return
    function onDocMouseDown(e) {
      const inside = [popupRef, sizePopupRef].some(r => r.current && r.current.contains(e.target))
      if (!inside) {
        setSizeOpen(false)
        setColorOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [sizeOpen, colorOpen])

  if (!editor || !state) {
    return (
      <div className="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-400" style={{ minHeight }}>
        Loading editor...
      </div>
    )
  }

  function rememberSelection() {
    savedSelRef.current = { from: editor.state.selection.from, to: editor.state.selection.to }
  }

  function runWithSelection(builder) {
    let chain = editor.chain().focus()
    if (savedSelRef.current) {
      chain = chain.setTextSelection(savedSelRef.current)
    }
    builder(chain).run()
    editor.view.focus()
  }

  function setLink() {
    rememberSelection()
    const prev = editor.getAttributes('link').href || ''
    const url = window.prompt('Enter link URL (https://...)', prev)
    if (url === null) return
    if (!url.trim()) {
      runWithSelection(c => c.extendMarkRange('link').unsetLink())
      return
    }
    const href = /^[a-z]+:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`
    runWithSelection(c => c.extendMarkRange('link').setLink({ href }))
  }

  function applyFontSize(px) {
    const n = Math.round(Number(px))
    if (!n || n < 8 || n > 72) return
    runWithSelection(c => c.setFontSize(`${n}px`))
    setSizeOpen(false)
  }

  const currentSize = state.fontSize ? state.fontSize.replace('px', '') : '16'

  return (
    <div className="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus-within:ring-2 focus-within:ring-cyan-500 overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 p-1 border-b border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/60">
        <select
          className={selectCls}
          value={state.blockType}
          onMouseDown={rememberSelection}
          onChange={e => {
            const v = e.target.value
            if (v === 'paragraph') runWithSelection(c => c.setParagraph())
            else runWithSelection(c => c.toggleHeading({ level: Number(v.slice(-1)) }))
          }}
          aria-label="Block type"
        >
          <option value="paragraph">Paragraph</option>
          <option value="heading1">Heading 1</option>
          <option value="heading2">Heading 2</option>
          <option value="heading3">Heading 3</option>
        </select>

        <span className={divCls} />

        <ToolbarButton title="Bold" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton title="Italic" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton title="Underline" active={state.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </ToolbarButton>
        <ToolbarButton title="Inline code" active={state.code} onClick={() => editor.chain().focus().toggleCode().run()}>
          {'</>'}
        </ToolbarButton>
        <ToolbarButton title="Highlight" active={state.highlight} onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <span className="bg-yellow-200 dark:bg-yellow-500/40 px-1 rounded">H</span>
        </ToolbarButton>

        <span className={divCls} />

        <div className="relative" ref={popupRef}>
          <ToolbarButton
            title="Text color"
            active={!!state.color}
            onClick={() => { rememberSelection(); setColorOpen(o => !o); setSizeOpen(false) }}
          >
            <span className="flex flex-col items-center leading-none">
              <span className="text-[10px]">A</span>
              <span className="w-3 h-1 rounded-full" style={{ background: state.color || '#18181b' }} />
            </span>
          </ToolbarButton>
          {colorOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 p-2 shadow-lg">
              <div className="flex flex-wrap gap-1 mb-1.5">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    title={c}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => { runWithSelection(chain => chain.setColor(c)); setColorOpen(false) }}
                    className={`w-6 h-6 rounded-full border border-black/10 ${state.color === c ? 'ring-2 ring-cyan-500 ring-offset-1' : ''}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={/^#[0-9a-f]{6}$/i.test(state.color) ? state.color : '#000000'}
                  onChange={e => runWithSelection(c => c.setColor(e.target.value))}
                  className="w-7 h-7 rounded border border-zinc-300 dark:border-zinc-600 bg-transparent p-0"
                  title="Custom color"
                />
                <button
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { runWithSelection(c => c.unsetColor()); setColorOpen(false) }}
                  className="ml-auto px-2 py-1 rounded text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        <select
          className={selectCls}
          value={state.fontFamily}
          onMouseDown={rememberSelection}
          onChange={e => {
            const v = e.target.value
            if (v) runWithSelection(c => c.setFontFamily(v))
            else runWithSelection(c => c.unsetFontFamily())
          }}
          aria-label="Font family"
        >
          {FONT_FAMILIES.map(f => (
            <option key={f.label} value={f.value} style={f.value ? { fontFamily: f.value } : undefined}>
              {f.label}
            </option>
          ))}
        </select>

        <div className="relative" ref={sizePopupRef}>
          <ToolbarButton title="Font size" active={!!state.fontSize} onClick={() => { rememberSelection(); setSizeOpen(o => !o); setColorOpen(false) }}>
            <span className="text-xs w-auto px-1">T {currentSize}</span>
          </ToolbarButton>
          {sizeOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 p-2 shadow-lg">
              <div className="flex flex-wrap gap-1">
                {FONT_SIZES.map(n => (
                  <button
                    key={n}
                    type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => applyFontSize(n)}
                    className={`w-8 h-7 rounded text-xs transition-colors ${String(n) === currentSize
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

        <span className={divCls} />

        <ToolbarButton title="Align left" active={!state.alignCenter && !state.alignRight && !state.alignJustify} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <span className="text-xs">≡</span>
        </ToolbarButton>
        <ToolbarButton title="Align center" active={state.alignCenter} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <span className="text-xs">☰</span>
        </ToolbarButton>
        <ToolbarButton title="Align right" active={state.alignRight} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <span className="text-xs">↳</span>
        </ToolbarButton>
        <ToolbarButton title="Justify" active={state.alignJustify} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
          <span className="text-xs">☷</span>
        </ToolbarButton>

        <span className={divCls} />

        <ToolbarButton title="Bullet list" active={state.bulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <span className="text-xs">•≡</span>
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={state.orderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <span className="text-xs">1≡</span>
        </ToolbarButton>
        <ToolbarButton title="Quote" active={state.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <span className="text-xs">❝</span>
        </ToolbarButton>
        <ToolbarButton title="Code block" active={state.codeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <span className="text-xs">{"{ }"}</span>
        </ToolbarButton>
        <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <span className="text-xs">—</span>
        </ToolbarButton>

        <span className={divCls} />

        <ToolbarButton title="Insert link" active={state.link} onClick={setLink}>
          🔗
        </ToolbarButton>
        <ToolbarButton title="Remove link" disabled={!state.link} onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}>
          🔓
        </ToolbarButton>

        <span className={divCls} />

        <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          <span className="text-xs">Tx</span>
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
