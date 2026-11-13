export type DemoFormData = {
  nombre: string
}

export function buildWhatsAppMessage(data: DemoFormData): string {
  return `Hola un placer soy ${data.nombre} quiero más informacion`
}
