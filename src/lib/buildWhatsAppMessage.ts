export type DemoFormData = {
  nombre: string
  negocio: string
  instagram: string
  facturacion: string
  cuandoLanzar: string
  productos?: string
  whatsappBusiness?: 'si' | 'no' | ''
  algoMas?: string
}

const cuandoLanzarMap: Record<string, string> = {
  'Cuanto antes, en 72 horas 🔥': 'cuanto antes, en 72 horas',
  'En 1-2 semanas':               'en 1 o 2 semanas',
  'Solo estoy explorando':        'cuando esté listo, todavía estoy explorando',
}

export function buildWhatsAppMessage(data: DemoFormData): string {
  const ig = data.instagram.replace(/^@/, '')
  const cuandoTexto = cuandoLanzarMap[data.cuandoLanzar] ?? data.cuandoLanzar

  const lineas: string[] = [
    `¡Hola Tienda Pana! 👋`,
    ``,
    `Soy ${data.nombre}. Tengo un negocio de ${data.negocio} y me consigues en Instagram como @${ig}.`,
    ``,
    `Actualmente facturo ${data.facturacion} al mes y me gustaría lanzar mi tienda ${cuandoTexto}.`,
    ``,
  ]

  if (data.productos) lineas.push(`Tengo aproximadamente ${data.productos}.`)
  if (data.whatsappBusiness === 'si')  lineas.push(`Ya tengo WhatsApp Business configurado.`)
  if (data.whatsappBusiness === 'no')  lineas.push(`Aún no tengo WhatsApp Business.`)
  if (data.algoMas?.trim())            lineas.push(`Algo más: ${data.algoMas.trim()}`)

  lineas.push(``, `¿Cuándo podemos hablar?`)

  return lineas.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}
