export const WHATSAPP_MSG = 'Hi Fishy Bizness, I got a fishy need'
export const WHATSAPP_NUMBER = '917702855385'

export function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function whatsappUrl(baseUrl) {
  const text = encodeURIComponent(WHATSAPP_MSG)
  return baseUrl.includes('?')
    ? `${baseUrl}&text=${text}`
    : `${baseUrl}?text=${text}`
}
