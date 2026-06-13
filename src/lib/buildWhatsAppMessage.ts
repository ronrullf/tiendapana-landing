export type DemoFormData = {
  nombre: string
  instagram: string
}

export function buildWhatsAppMessage(data: DemoFormData): string {
  const ig = data.instagram.replace(/^@/, '')
  return `¡Hola Tienda Pana! 👋\n\nSoy ${data.nombre} y me consigues en Instagram como @${ig}.\n\nQuiero saber más sobre cómo tener mi tienda online. ¿Cuándo podemos hablar?`
}
