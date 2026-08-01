export const WHATSAPP_MSG = 'Hi Fishy Bizness, I got a fishy need'

export function whatsappUrl(baseUrl) {
  const text = encodeURIComponent(WHATSAPP_MSG)
  return baseUrl.includes('?')
    ? `${baseUrl}&text=${text}`
    : `${baseUrl}?text=${text}`
}
