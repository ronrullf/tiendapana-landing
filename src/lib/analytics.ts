/**
 * Eventos de analítica centralizados.
 * Usa Vercel Analytics track() — aparecen en el dashboard de Vercel
 * bajo la sección "Events". Clarity los captura automáticamente por nombre de clic.
 *
 * Cómo ver los eventos en Vercel:
 *   vercel.com → tu proyecto → Analytics → Events
 */
import { track } from '@vercel/analytics'

// ── Eventos de la Landing ─────────────────────────────────────────────────────

/** CTA principal de la landing ("Pídeme mi demo gratis") */
export const trackCTALanding = (fuente: 'hero' | 'final' | 'sticky' | 'header') =>
  track('cta_landing', { fuente })

// ── Eventos de la Demo ────────────────────────────────────────────────────────

/** El usuario abre el detalle de un producto */
export const trackProductoVisto = (nombre: string, categoria: string) =>
  track('producto_visto', { nombre, categoria })

/** El usuario toca "Pedir por WhatsApp" en una tarjeta o modal */
export const trackPedirWhatsApp = (nombre: string, desde: 'tarjeta' | 'detalle') =>
  track('pedir_whatsapp', { nombre, desde })

/** El usuario agrega un producto al carrito */
export const trackAgregarCarrito = (nombre: string) =>
  track('agregar_carrito', { nombre })

/** El usuario abre el carrito */
export const trackAbreCarrito = () =>
  track('abre_carrito')

/** El usuario aplica el cupón PANA */
export const trackCuponAplicado = (codigo: string) =>
  track('cupon_aplicado', { codigo })

/** El usuario elige un método de pago */
export const trackMetodoPago = (metodo: string) =>
  track('metodo_pago', { metodo })

/** El usuario llega al modal final de "Comprar" (coloca número) */
export const trackIniciaCheckout = (tipo: 'producto' | 'carrito') =>
  track('inicia_checkout', { tipo })

/** El usuario confirma el número y abre WhatsApp → pedido enviado */
export const trackPedidoEnviado = (tipo: 'producto' | 'carrito', metodo: string) =>
  track('pedido_enviado', { tipo, metodo })

// ── Eventos de /pide-tu-demo ──────────────────────────────────────────────────

/** El usuario envía el formulario de solicitud de demo */
export const trackFormularioDemoEnviado = () =>
  track('formulario_demo_enviado')

/** El usuario hace clic en "Quiero mi tienda online" desde la tienda demo */
export const trackDemoConvierte = () =>
  track('demo_convierte')
