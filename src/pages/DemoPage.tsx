import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus, X, ShoppingCart, Trash2, Minus } from 'lucide-react'
import { useDollarRate } from '@/hooks/useDollarRate'
import { isValidVzlaPhone } from '@/lib/normalizeVzlaPhone'
import { normalizeVzlaPhone } from '@/lib/normalizeVzlaPhone'
import { ProductForm } from '@/components/demo/ProductForm'
import type { Product } from '@/components/demo/ProductCard'

type Step = 'setup' | 'store'

interface CartItem {
  product: Product
  quantity: number
  paymentMethod: string
}

const PAYMENT_OPTS = [
  { id: 'pago-movil',    label: 'Pago Móvil',            icon: '📱' },
  { id: 'binance',       label: 'Binance',                icon: '🟡' },
  { id: 'transferencia', label: 'Transferencia bancaria', icon: '🏦' },
  { id: 'paypal',        label: 'PayPal',                 icon: '🅿️' },
  { id: 'zelle',         label: 'Zelle',                  icon: '💙' },
]

const PAYMENT_LABELS: Record<string, string> = {
  'pago-movil':    'Pago Móvil',
  'binance':       'Binance',
  'transferencia': 'Transferencia bancaria',
  'paypal':        'PayPal',
  'zelle':         'Zelle',
}

function inputStyle(err = false) {
  return {
    width: '100%',
    height: '52px',
    padding: '0 16px',
    borderRadius: '12px',
    border: `1px solid ${err ? '#DC2626' : '#E5E7EB'}`,
    fontSize: '16px',
    color: '#0A0A0A',
    background: '#fff',
    outline: 'none',
  } as const
}

// ── PRODUCT MODAL ────────────────────────────────────────────────────────────
function ProductModal({
  product,
  bsRate,
  payments,
  onClose,
  onAddToCart,
}: {
  product: Product
  bsRate: number | null
  payments: string[]
  onClose: () => void
  onAddToCart: (product: Product, payment: string) => void
}) {
  const [selectedPayment, setSelectedPayment] = useState(payments[0])
  const priceBS = bsRate
    ? (product.priceUSD * bsRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null

  const handleOrder = () => {
    // direct WhatsApp — modal version
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal card */}
      <motion.div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden z-10"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={{ maxHeight: '92dvh', overflowY: 'auto' }}
      >
        {/* Drag handle (mobile) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm px-5 pt-3 pb-2 flex items-center justify-between">
          <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
          <div className="w-8" />
          <button
            onClick={onClose}
            className="ml-auto w-9 h-9 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#737373] hover:bg-[#E5E7EB] transition-colors active:scale-95"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Product image */}
        <div className="w-full aspect-square bg-[#FEF3E2] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <h2 className="font-display font-black text-xl text-[#0A0A0A] leading-tight">
            {product.name}
          </h2>

          {/* Prices — Bs. LARGE */}
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-black text-[#FF6B00]">
              ${product.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {priceBS ? (
              <span className="text-2xl font-bold text-[#0A0A0A]">
                Bs.&nbsp;{priceBS}
              </span>
            ) : (
              <span className="text-sm text-[#AAAAAA]">Calculando tasa BCV...</span>
            )}
          </div>

          {/* Payment selector */}
          {payments.length > 1 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-widest">Método de pago</p>
              <div className="flex flex-wrap gap-2">
                {payments.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedPayment(m)}
                    className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all active:scale-95"
                    style={{
                      background:  selectedPayment === m ? '#FF6B00' : '#FEF3E2',
                      borderColor: selectedPayment === m ? '#FF6B00' : '#F0E8E0',
                      color:       selectedPayment === m ? '#fff' : '#737373',
                    }}
                  >
                    {PAYMENT_LABELS[m] ?? m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-1">
            <button
              type="button"
              onClick={() => { onAddToCart(product, selectedPayment); onClose() }}
              className="w-full h-12 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)' }}
            >
              <ShoppingCart size={16} />
              Agregar al carrito
            </button>
            <WaOrderButton
              product={product}
              priceBS={priceBS}
              selectedPayment={selectedPayment}
              phone=""
              onBeforeOpen={handleOrder}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── WA ORDER BUTTON (reusable) ───────────────────────────────────────────────
function WaOrderButton({
  product,
  priceBS,
  selectedPayment,
  phone,
  onBeforeOpen,
}: {
  product: Product
  priceBS: string | null
  selectedPayment: string
  phone: string
  onBeforeOpen?: () => void
}) {
  const handleClick = () => {
    onBeforeOpen?.()
    const method = PAYMENT_LABELS[selectedPayment] || selectedPayment
    const bsText = priceBS ? ` y Bs. ${priceBS}` : ''
    const msg = `Hola quiero ${product.name}, tiene un coste de: $${product.priceUSD}${bsText}\nVoy a pagar con ${method}, me pasan los datos por favor.`
    const wa = phone ? normalizeVzlaPhone(phone) : '584120000000'
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full h-12 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
      style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.25)' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Pedir por WhatsApp
    </button>
  )
}

// ── PRODUCT CARD (store view) ────────────────────────────────────────────────
function StoreProductCard({
  product,
  bsRate,
  phone,
  payments,
  onCardClick,
  onAddToCart,
}: {
  product: Product
  bsRate: number | null
  phone: string
  payments: string[]
  onCardClick: () => void
  onAddToCart: (product: Product, payment: string) => void
}) {
  const [selectedPayment, setSelectedPayment] = useState(payments[0])
  const priceBS = bsRate
    ? (product.priceUSD * bsRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden border border-[#F0E8E0] flex flex-col cursor-pointer group"
      style={{ boxShadow: '0 4px 24px rgba(255,107,0,0.07)' }}
    >
      {/* Image — clickable */}
      <button
        type="button"
        onClick={onCardClick}
        className="relative aspect-square bg-[#FEF3E2] overflow-hidden w-full focus:outline-none"
        aria-label={`Ver detalle de ${product.name}`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full px-3 py-1 text-xs font-semibold text-[#0A0A0A]">
            Ver detalle
          </span>
        </div>
      </button>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <button
          type="button"
          onClick={onCardClick}
          className="text-left focus:outline-none"
        >
          <h3 className="font-display font-black text-base text-[#0A0A0A] leading-tight hover:text-[#FF6B00] transition-colors">
            {product.name}
          </h3>
        </button>

        {/* Prices — Bs. BIG */}
        <div className="flex flex-col gap-0.5">
          <span className="text-2xl font-black text-[#FF6B00]">
            ${product.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {priceBS ? (
            <span className="text-xl font-bold text-[#0A0A0A]">
              Bs.&nbsp;{priceBS}
            </span>
          ) : (
            <span className="text-sm text-[#AAAAAA]">Calculando tasa BCV...</span>
          )}
        </div>

        {/* Payment chips */}
        {payments.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {payments.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedPayment(m)}
                className="text-xs px-2.5 py-1 rounded-full border font-medium transition-all active:scale-95"
                style={{
                  background:  selectedPayment === m ? '#FF6B00' : '#FEF3E2',
                  borderColor: selectedPayment === m ? '#FF6B00' : '#F0E8E0',
                  color:       selectedPayment === m ? '#fff' : '#737373',
                }}
              >
                {PAYMENT_LABELS[m] ?? m}
              </button>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-auto pt-1">
          <button
            type="button"
            onClick={() => onAddToCart(product, selectedPayment)}
            className="w-full h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] border"
            style={{ borderColor: '#FF6B00', color: '#FF6B00', background: '#FEF3E2' }}
          >
            <ShoppingCart size={14} />
            Agregar al carrito
          </button>
          <WaOrderButton
            product={product}
            priceBS={priceBS}
            selectedPayment={selectedPayment}
            phone={phone}
          />
        </div>
      </div>
    </div>
  )
}

// ── CART PANEL ───────────────────────────────────────────────────────────────
function CartPanel({
  items,
  bsRate,
  phone,
  onClose,
  onRemove,
  onQtyChange,
}: {
  items: CartItem[]
  bsRate: number | null
  phone: string
  onClose: () => void
  onRemove: (productId: string) => void
  onQtyChange: (productId: string, delta: number) => void
}) {
  const totalUSD = items.reduce((acc, i) => acc + i.product.priceUSD * i.quantity, 0)
  const totalBS  = bsRate ? totalUSD * bsRate : null

  const handleCheckout = () => {
    if (items.length === 0) return
    const lines = items.map(i => {
      const bs = bsRate ? ` (Bs. ${(i.product.priceUSD * bsRate * i.quantity).toLocaleString('es-VE', { minimumFractionDigits: 2 })})` : ''
      const method = PAYMENT_LABELS[i.paymentMethod] ?? i.paymentMethod
      return `• ${i.product.name} ×${i.quantity} — $${(i.product.priceUSD * i.quantity).toFixed(2)}${bs} | Pago: ${method}`
    }).join('\n')
    const bsTotalLine = totalBS ? `\nTotal en Bs: Bs. ${totalBS.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : ''
    const msg = `Hola, quiero hacer este pedido 🛒\n\n${lines}\n\nTotal: $${totalUSD.toFixed(2)}${bsTotalLine}\n\n¿Me pasan los datos para pagar?`
    const wa = phone ? normalizeVzlaPhone(phone) : '584120000000'
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank')
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative w-full sm:w-96 sm:h-full bg-white rounded-t-3xl sm:rounded-none sm:rounded-l-3xl flex flex-col z-10 overflow-hidden"
        style={{ maxHeight: '90dvh' }}
        initial={{ y: '100%', x: '0%' }}
        animate={{ y: 0, x: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#F0E8E0] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#FF6B00]" />
            <span className="font-display font-black text-base text-[#0A0A0A]">
              Tu carrito ({items.reduce((a, i) => a + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#737373] hover:bg-[#E5E7EB] transition-colors active:scale-95"
            aria-label="Cerrar carrito"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingCart size={36} className="text-[#E5E7EB]" />
              <p className="text-sm text-[#737373]">Tu carrito está vacío.<br />Agrega productos desde la tienda.</p>
            </div>
          ) : (
            items.map(item => {
              const priceBS = bsRate
                ? (item.product.priceUSD * bsRate * item.quantity).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : null
              return (
                <div key={item.product.id} className="flex items-start gap-3 p-3 rounded-2xl border border-[#F0E8E0] bg-[#FAFAFA]">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0A0A0A] leading-tight truncate">{item.product.name}</p>
                    <p className="text-sm font-black text-[#FF6B00] mt-0.5">
                      ${(item.product.priceUSD * item.quantity).toFixed(2)}
                    </p>
                    {priceBS && (
                      <p className="text-base font-bold text-[#0A0A0A]">Bs.&nbsp;{priceBS}</p>
                    )}
                    <p className="text-xs text-[#737373] mt-0.5">
                      {PAYMENT_LABELS[item.paymentMethod] ?? item.paymentMethod}
                    </p>
                    {/* Qty control */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onQtyChange(item.product.id, -1)}
                        className="w-7 h-7 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#737373] hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors active:scale-95"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold text-[#0A0A0A] w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onQtyChange(item.product.id, 1)}
                        className="w-7 h-7 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#737373] hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors active:scale-95"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="text-[#CCCCCC] hover:text-red-400 transition-colors p-1 active:scale-95"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer totals + checkout */}
        {items.length > 0 && (
          <div className="border-t border-[#F0E8E0] px-5 py-5 flex flex-col gap-3 bg-white">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#737373]">Subtotal USD</span>
                <span className="font-black text-[#0A0A0A]">${totalUSD.toFixed(2)}</span>
              </div>
              {totalBS && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#737373]">Total en Bs.</span>
                  <span className="text-xl font-black text-[#0A0A0A]">
                    Bs.&nbsp;{totalBS.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full h-14 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
              style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.30)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pedir todo por WhatsApp
            </button>
            <p className="text-center text-xs text-[#94A3B8]">
              Se abrirá WhatsApp con el pedido completo
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function DemoPage() {
  const navigate = useNavigate()
  const { data: rateData } = useDollarRate()
  const bsRate = rateData?.promedio ?? null

  // Setup state
  const [phone,    setPhone]    = useState('')
  const [phoneErr, setPhoneErr] = useState('')
  const [payments, setPayments] = useState<string[]>(['pago-movil'])
  const [products, setProducts] = useState<Product[]>([])
  const [forms,    setForms]    = useState<number[]>([0])
  const [step,     setStep]     = useState<Step>('setup')

  // Store state
  const [cartItems,      setCartItems]      = useState<CartItem[]>([])
  const [cartOpen,       setCartOpen]       = useState(false)
  const [activeProduct,  setActiveProduct]  = useState<Product | null>(null)

  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0)

  // Handlers — setup
  const togglePayment = (id: string) => {
    setPayments(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(p => p !== id) : prev) : [...prev, id]
    )
  }

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product])
  }

  const removeForm = (idx: number) => setForms(prev => prev.filter(i => i !== idx))

  const addForm = () => {
    if (forms.length + products.length >= 5) return
    setForms(prev => [...prev, prev.length + products.length])
  }

  const handleLaunch = () => {
    if (!isValidVzlaPhone(phone)) {
      setPhoneErr('Número venezolano inválido. Ej: 0414-1234567')
      return
    }
    if (products.length === 0) {
      setPhoneErr('Agrega al menos 1 producto primero')
      return
    }
    setPhoneErr('')
    setStep('store')
  }

  // Handlers — cart
  const addToCart = (product: Product, paymentMethod: string) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1, paymentMethod }
            : i
        )
      }
      return [...prev, { product, quantity: 1, paymentMethod }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId))
  }

  const changeQty = (productId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(i => i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0)
    )
  }

  const totalSlots = forms.length + products.length
  const canAddMore = totalSlots < 5

  // ── SETUP SCREEN ────────────────────────────────────────────────────────────
  if (step === 'setup') {
    return (
      <div className="min-h-screen" style={{ background: '#FEF3E2' }}>
        <header className="sticky top-0 z-30 border-b border-[#F0E8E0]"
          style={{ background: 'rgba(254,243,226,0.95)', backdropFilter: 'blur(8px)' }}>
          <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Tienda Pana" className="w-7 h-7 object-contain" />
              <span className="font-display font-black text-base text-[#0A0A0A]">
                Tienda<span className="text-[#FF6B00]">Pana</span>
                <span className="text-[#737373] font-normal text-xs ml-1.5">· Demo</span>
              </span>
            </div>
            <span className="text-xs text-[#737373] bg-white px-2.5 py-1 rounded-full border border-[#F0E8E0]">
              {products.length}/5 productos
            </span>
          </div>
        </header>

        <div className="max-w-xl mx-auto px-5 py-8 flex flex-col gap-6">

          {/* Hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center flex flex-col gap-2"
          >
            <img src="/logo.png" alt="" className="w-20 h-20 object-contain mx-auto"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(255,107,0,0.20))' }} />
            <h1 className="font-display font-black text-2xl text-[#0A0A0A] leading-tight">
              Crea tu tienda demo en{' '}
              <span className="text-[#FF6B00]">60 segundos</span>
            </h1>
            <p className="text-sm text-[#737373]">
              Sube hasta 5 productos y mira cómo se ve tu tienda online. Cero código, cero costo.
            </p>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex flex-col gap-2"
          >
            <label className="text-sm font-semibold text-[#0A0A0A]">
              Tu número de WhatsApp <span className="text-[#FF6B00]">*</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="0414-1234567 o 04241234567"
              value={phone}
              onChange={e => { setPhone(e.target.value); setPhoneErr('') }}
              style={inputStyle(!!phoneErr)}
              onFocus={e  => { e.target.style.borderColor = '#FF6B00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.12)' }}
              onBlur={e   => { e.target.style.borderColor = phoneErr ? '#DC2626' : '#E5E7EB'; e.target.style.boxShadow = 'none' }}
            />
            {phoneErr && <p className="text-xs text-red-500">{phoneErr}</p>}
            <p className="text-xs text-[#94A3B8]">Acepta 0414, 0416, 0424, 0426, 0412 — con o sin guiones</p>
          </motion.div>

          {/* Payment methods */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="flex flex-col gap-2"
          >
            <label className="text-sm font-semibold text-[#0A0A0A]">
              Métodos de pago <span className="text-[#FF6B00]">*</span>
            </label>
            <div className="flex flex-col gap-2">
              {PAYMENT_OPTS.map(opt => {
                const active = payments.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => togglePayment(opt.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all active:scale-[0.98] text-left"
                    style={{
                      background:  active ? '#FEF3E2' : '#fff',
                      borderColor: active ? '#FF6B00' : '#E5E7EB',
                      color:       active ? '#0A0A0A' : '#737373',
                      boxShadow:   active ? '0 0 0 2px #FF6B00' : 'none',
                    }}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    {opt.label}
                    {active && <span className="ml-auto text-[#FF6B00] font-bold text-xs">✓</span>}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Product forms */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#0A0A0A]">
                Tus productos <span className="text-[#FF6B00]">*</span>
              </label>
              <span className="text-xs text-[#94A3B8]">Máximo 5</span>
            </div>

            <AnimatePresence>
              {forms.map((formIdx) => (
                <motion.div
                  key={formIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductForm
                    index={products.length + forms.indexOf(formIdx)}
                    onAdd={addProduct}
                    onRemove={() => removeForm(formIdx)}
                    canRemove={forms.length > 1 || products.length > 0}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {products.length > 0 && (
              <div className="flex flex-col gap-2">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-3">
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0A0A0A] truncate">{p.name}</p>
                      <p className="text-xs text-[#16A34A]">${p.priceUSD.toFixed(2)} · Listo ✓</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {canAddMore && (
              <button
                type="button"
                onClick={addForm}
                className="w-full h-11 rounded-xl border-2 border-dashed border-[#FF6B00]/40 text-sm font-semibold text-[#FF6B00] flex items-center justify-center gap-2 transition-colors hover:border-[#FF6B00] active:scale-[0.98]"
              >
                <Plus size={16} />
                Agregar otro producto ({totalSlots}/5)
              </button>
            )}
          </motion.div>

          {/* Launch */}
          <motion.button
            type="button"
            onClick={handleLaunch}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            whileTap={{ scale: 0.97 }}
            className="w-full h-14 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)',
              boxShadow: '0 4px 20px rgba(255,107,0,0.35)',
            }}
          >
            🚀 Ver mi tienda demo
          </motion.button>

          <p className="text-center text-xs text-[#94A3B8]">
            Los datos no se guardan — si recargas la página empiezas de nuevo.
          </p>
        </div>
      </div>
    )
  }

  // ── STORE VIEW ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* Store header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0E8E0]"
        style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.05)' }}>
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Tienda Pana" className="w-7 h-7 object-contain" />
            <span className="font-display font-black text-base text-[#0A0A0A]">
              Mi Tienda<span className="text-[#FF6B00]"> Demo</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-[#E5E7EB] text-sm font-semibold text-[#0A0A0A] hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors active:scale-95"
              aria-label="Ver carrito"
            >
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setStep('setup')}
              className="text-xs text-[#737373] border border-[#E5E7EB] px-3 py-1.5 rounded-full hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
            >
              ← Editar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Demo badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FEF3E2] border border-[#FF6B00]/20 rounded-2xl px-4 py-3 text-center"
        >
          <p className="text-xs text-[#FF6B00] font-semibold">
            👀 Esta es tu demo — así se verá tu tienda profesional con Tienda Pana pero con un diseño personalizado.
          </p>
        </motion.div>

        {/* BCV badge */}
        {bsRate && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#737373]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>Tasa BCV: <strong className="text-[#0A0A0A]">Bs. {bsRate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> · Actualizada automáticamente</span>
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <StoreProductCard
                product={product}
                bsRate={bsRate}
                phone={phone}
                payments={payments}
                onCardClick={() => setActiveProduct(product)}
                onAddToCart={addToCart}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-[#F0E8E0] p-6 flex flex-col items-center gap-4 text-center"
          style={{ boxShadow: '0 4px 24px rgba(255,107,0,0.08)' }}
        >
          <img src="/logo.png" alt="" className="w-16 h-16 object-contain"
            style={{ filter: 'drop-shadow(0 6px 16px rgba(255,107,0,0.20))' }} />
          <div>
            <p className="font-display font-black text-lg text-[#0A0A0A]">¿Te gustó cómo se ve?</p>
            <p className="text-sm text-[#737373] mt-1">
              Tu tienda real incluye dominio .com, tasa BCV automática, panel admin y mucho más.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/pide-tu-demo')}
            className="w-full h-14 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
            style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.30)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Quiero mi tienda online
          </button>
          <p className="text-xs text-[#94A3B8]">Te respondemos por WhatsApp en minutos · Sin compromiso</p>
        </motion.div>

        <div className="text-center pb-4">
          <p className="text-xs text-[#CCCCCC]">Demo creada con</p>
          <a href="/" className="font-display font-black text-sm text-[#FF6B00]">TiendaPana</a>
        </div>
      </div>

      {/* Product modal */}
      <AnimatePresence>
        {activeProduct && (
          <ProductModal
            product={activeProduct}
            bsRate={bsRate}
            payments={payments}
            onClose={() => setActiveProduct(null)}
            onAddToCart={addToCart}
          />
        )}
      </AnimatePresence>

      {/* Cart panel */}
      <AnimatePresence>
        {cartOpen && (
          <CartPanel
            items={cartItems}
            bsRate={bsRate}
            phone={phone}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
            onQtyChange={changeQty}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
