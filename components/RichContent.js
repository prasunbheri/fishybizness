import { sanitizeHtml } from '@/lib/sanitize'

export default function RichContent({ html, className = '' }) {
  const content = String(html || '')
  if (!content.trim()) return null

  const hasHtml = /<[a-z][\s\S]*>/i.test(content)

  if (!hasHtml) {
    return (
      <p className={`whitespace-pre-line text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm ${className}`}>
        {content}
      </p>
    )
  }

  return (
    <div
      className={`rich-content text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
    />
  )
}
