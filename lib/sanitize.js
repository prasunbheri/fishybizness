export function sanitizeHtml(html) {
  if (!html) return ''
  let out = String(html)

  out = out
    .replace(/<\s*script[\s\S]*?>[\s\S]*?<\/\s*script\s*>/gi, '')
    .replace(/<\s*iframe[\s\S]*?>[\s\S]*?<\/\s*iframe\s*>/gi, '')
    .replace(/<\s*style[\s\S]*?>[\s\S]*?<\/\s*style\s*>/gi, '')
    .replace(/<\s*object[\s\S]*?>/gi, '')
    .replace(/<\s*embed[\s\S]*?>/gi, '')
    .replace(/<\s*frame[\s\S]*?>/gi, '')

  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')

  out = out.replace(/(href|src)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (match, attr, value) => {
    const clean = value.replace(/^["']|["']$/g, '').trim().toLowerCase()
    if (clean.startsWith('javascript:') || clean.startsWith('data:')) return `${attr}="#"`
    return match
  })

  return out
}

export function stripTags(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
