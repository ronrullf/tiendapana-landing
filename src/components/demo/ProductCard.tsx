import { normalizeVzlaPhone } from '@/lib/normalizeVzlaPhone'

export type Product = {
  id: string
  name: string
  priceUSD: number
  imageUrl: string
}

const PAYMENT_LABELS: Record<string, string> = {
  'pago-movil':   'Pago Móvil',
  'binance':      'Binance',
  'transferencia':'Transferencia bancaria',
}

interface Props {
  product: Product
  bsRate: number | null
  phone: string
  paymentMethods: string[]
  selectedPayment: string
  onPaymentChange: (v: string) => void
}

export function ProductCard({ product, bsRate, phone, paymentMethods, selectedPayment, onPaymentChange }: Props) {
  const priceBS = bsRate ? (product.priceUSD * bsRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : null

  const handleOrder = () => {
    const method = PAYMENT_LABELS[selectedPayment] || selectedPayment
    const bsText = priceBS ? ` y Bs. ${priceBS}` : ''
    const msg = `Hola quiero ${product.name}, tiene un coste de: $${product.priceUSD}${bsText}\nVoy a pagar con ${method}, me pasan los datos por favor.`
    const wa = normalizeVzlaPhone(phone)
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#F0E8E0] flex flex-col"
      style={{ boxShadow: '0 4px 24px rgba(255,107,0,0.08)' }}>

      {/* Product image */}
      <div className="relative aspect-square bg-[#FEF3E2] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-display font-black text-base text-[#0A0A0A] leading-tight">
          {product.name}
        </h3>

        {/* Prices */}
        <div className="flex flex-col gap-0.5">
          <span className="text-2xl font-black text-[#FF6B00]">
            ${product.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {priceBS && (
            <span className="text-sm text-[#737373] font-medium">
              Bs. {priceBS}
            </span>
          )}
          {!priceBS && (
            <span className="text-sm text-[#AAAAAA]">Calculando tasa BCV...</span>
          )}
        </div>

        {/* Payment method selector */}
        {paymentMethods.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {paymentMethods.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => onPaymentChange(m)}
                className="text-xs px-2.5 py-1 rounded-full border font-medium transition-all"
                style={{
                  background:  selectedPayment === m ? '#FF6B00' : '#FEF3E2',
                  borderColor: selectedPayment === m ? '#FF6B00' : '#F0E8E0',
                  color:       selectedPayment === m ? '#fff' : '#737373',
                }}
              >
                {PAYMENT_LABELS[m]}
              </button>
            ))}
          </div>
        )}

        {/* Order button */}
        <button
          type="button"
          onClick={handleOrder}
          className="mt-auto w-full h-12 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
          style={{
            background: '#25D366',
            boxShadow: '0 4px 14px rgba(37,211,102,0.30)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Pedir por WhatsApp
        </button>
      </div>
    </div>
  )
}
