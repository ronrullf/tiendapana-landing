export interface LeadInput {
  nombre: string
  instagram: string
  que_vende: string
  whatsapp?: string
}

export function buildLeadWhatsAppMessage(d: LeadInput): string {
  return `Hola equipo Tienda Pana 👋

Quiero mi demo gratis 🛍️

📝 Mi info:
• Nombre: ${d.nombre}
• Instagram: ${d.instagram}
• Vendo: ${d.que_vende}${d.whatsapp ? `\n• WhatsApp: ${d.whatsapp}` : ''}

¿Cuándo arrancamos?`
}
