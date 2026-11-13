declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

/**
 * Dispara un evento en el Meta Pixel (Lead, Contact, PageView, etc.)
 */
export function trackMetaPixel(event: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      if (params) {
        window.fbq('track', event, params)
      } else {
        window.fbq('track', event)
      }
    } catch (e) {
      console.warn('[Meta Pixel] Error tracking event:', event, e)
    }
  }
}

/**
 * Dispara los eventos de conversión (Lead y Contact) requeridos
 * al presionar el botón de contacto / apertura de WhatsApp.
 */
export function trackWhatsAppConversion(params?: Record<string, any>) {
  trackMetaPixel('Lead', params)
  trackMetaPixel('Contact', params)
}
