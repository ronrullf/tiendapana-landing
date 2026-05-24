import { useMemo } from 'react'
import { buildWhatsAppMessage, type DemoFormData } from '@/lib/buildWhatsAppMessage'

interface Props {
  data: Partial<DemoFormData>
}

function renderWithPlaceholders(data: Partial<DemoFormData>): string {
  const filled: DemoFormData = {
    nombre:           data.nombre           || '[tu nombre]',
    negocio:          data.negocio          || '[tu negocio]',
    instagram:        data.instagram        || '[tuusuario]',
    facturacion:      data.facturacion      || '[facturación]',
    cuandoLanzar:     data.cuandoLanzar     || '[cuándo lanzar]',
    productos:        data.productos,
    whatsappBusiness: data.whatsappBusiness,
    algoMas:          data.algoMas,
  }
  return buildWhatsAppMessage(filled)
}

export function WhatsAppPreview({ data }: Props) {
  const message = useMemo(() => renderWithPlaceholders(data), [data])

  // Current time for the timestamp
  const now = new Date()
  const time = now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#E5DDD5' }}>
      {/* Chat header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#075E54' }}>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-none">Tienda Pana</p>
          <p className="text-white/60 text-xs mt-0.5">Equipo de ventas</p>
        </div>
      </div>

      {/* Chat body */}
      <div className="p-4 min-h-[160px] flex flex-col items-end">
        {/* Message bubble */}
        <div
          className="max-w-[90%] px-3 py-2 text-sm leading-relaxed"
          style={{
            background: '#DCF8C6',
            borderRadius: '12px 12px 4px 12px',
            boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
            color: '#111B21',
            fontSize: '13.5px',
            lineHeight: '1.45',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message}

          {/* Timestamp */}
          <div className="flex items-center justify-end gap-1 mt-1">
            <span style={{ fontSize: '11px', color: '#667781' }}>{time}</span>
            {/* Double check */}
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
              <path d="M11.071.653L4.948 7.875 2.304 5.023" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.071.653L8.948 7.875" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
