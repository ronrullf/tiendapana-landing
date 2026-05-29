import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, X, Plus, Minus, Trash2, Tag, Check, Sparkles,
} from 'lucide-react'
import { useDollarRate } from '@/hooks/useDollarRate'
import { isValidVzlaPhone, normalizeVzlaPhone } from '@/lib/normalizeVzlaPhone'
import {
  DEMO_PRODUCTS, DEMO_COUPON, PER_PRODUCT_DISCOUNT, MAX_QTY_DISCOUNT,
  PAYMENT_METHODS, type DemoProduct,
} from '@/data/demoProducts'

const DEMO_REQUEST_PATH = '/pide-tu-demo'

interface CartItem {
  product: DemoProduct
  quantity: number
}

type PendingOrder =
  | { type: 'single'; product: DemoProduct }
  | { type: 'cart' }
  | null

// ── helpers de formato ───────────────────────────────────────────────────────
const fmtUSD = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtBS = (usd: number, rate: number | null) =>
  rate
    ? `Bs. ${(usd * rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : 'Bs. —'

const paymentLabel = (id: string) => PAYMENT_METHODS.find(p => p.id === id)?.label ?? id
const paymentDiscount = (id: string) => PAYMENT_METHODS.find(p => p.id === id)?.discount ?? 0

// ── lógica de precios ──────────────────────────────────────────────────────────
function priceSingle(product: DemoProduct, paymentId: string, couponApplied: boolean) {
  const base = product.priceUSD
  const couponPct = couponApplied ? DEMO_COUPON.percent : 0
  const payPct = paymentDiscount(paymentId)
  const afterDisc = base * (1 - couponPct / 100) * (1 - payPct / 100)
  return { base, couponPct, payPct, afterDisc, total: afterDisc, saved: base - afterDisc }
}

function priceCart(items: CartItem[], couponApplied: boolean, paymentId: string) {
  const subtotal = items.reduce((a, i) => a + i.product.priceUSD * i.quantity, 0)
  const distinct = items.length
  const qtyPct = Math.min(distinct * PER_PRODUCT_DISCOUNT, MAX_QTY_DISCOUNT)
  const couponPct = couponApplied ? DEMO_COUPON.percent : 0
  const payPct = paymentDiscount(paymentId)
  const afterDisc = subtotal * (1 - qtyPct / 100) * (1 - couponPct / 100) * (1 - payPct / 100)
  return { subtotal, distinct, qtyPct, couponPct, payPct, afterDisc, total: afterDisc, saved: subtotal - afterDisc }
}

// ── ícono WhatsApp ───────────────────────────────────────────────────────────
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ── CTA verde "Quiero mi tienda online" ────────────────────────────────────────
function GreenCTA({
  onClick, label = 'Quiero mi tienda online', size = 'lg', full = true,
}: {
  onClick: () => void
  label?: string
  size?: 'sm' | 'lg'
  full?: boolean
}) {
  const isSm = size === 'sm'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${full ? 'w-full' : ''} min-w-0 ${isSm ? 'h-10 px-3 text-sm' : 'h-14 px-4 sm:px-6 text-[15px] sm:text-base'} rounded-2xl font-black text-white flex items-center justify-center gap-2 whitespace-nowrap transition-all active:scale-[0.97]`}
      style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.30)' }}
    >
      <WhatsAppIcon size={isSm ? 16 : 20} />
      <span className="truncate">{label}</span>
    </button>
  )
}

// ── Banner "¿Te gusta cómo se ve?" (con logo) ──────────────────────────────────
function LikeItBanner({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl border border-[#F0E8E0] p-6 flex flex-col items-center gap-4 text-center"
      style={{ boxShadow: '0 4px 24px rgba(255,107,0,0.08)' }}
    >
      <img src="/logo.png" alt="Tienda Pana" className="w-16 h-16 object-contain"
        style={{ filter: 'drop-shadow(0 6px 16px rgba(255,107,0,0.20))' }} />
      <div>
        <p className="font-display font-black text-xl text-[#0A0A0A]">¿Te gusta cómo se ve?</p>
        <p className="text-sm text-[#737373] mt-1 max-w-md mx-auto">
          Esta es una tienda <strong className="text-[#FF6B00]">demo</strong>. La tuya viene con tu dominio .com,
          tasa BCV automática, panel admin y tus productos reales.
        </p>
      </div>
      <GreenCTA onClick={onClick} />
      <p className="text-xs text-[#94A3B8]">Te respondemos por WhatsApp en minutos · Sin compromiso</p>
    </motion.div>
  )
}

// ── Campo de cupón reutilizable ────────────────────────────────────────────────
function CouponField({
  coupon, couponInput, setCouponInput, couponError, applyCoupon,
}: {
  coupon: boolean
  couponInput: string
  setCouponInput: (v: string) => void
  couponError: string
  applyCoupon: () => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-widest text-[#737373]">Cupón de descuento</p>
      {coupon ? (
        <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-3 py-2.5">
          <Check size={16} className="text-[#16A34A] shrink-0" />
          <span className="text-sm font-semibold text-[#16A34A]">
            Cupón {DEMO_COUPON.code} aplicado · -{DEMO_COUPON.percent}%
          </span>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 flex items-center gap-2 border border-[#E5E7EB] rounded-xl px-3 bg-white">
              <Tag size={15} className="text-[#94A3B8] shrink-0" />
              <input
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Escribe tu cupón"
                className="flex-1 min-w-0 h-11 bg-transparent outline-none text-base text-[#0A0A0A]"
                style={{ fontSize: '16px' }}
              />
            </div>
            <button onClick={applyCoupon}
              className="px-4 h-11 rounded-xl font-bold text-sm text-white active:scale-95 shrink-0"
              style={{ background: '#FF6B00' }}>
              Aplicar
            </button>
          </div>
          <p className="text-xs font-semibold text-[#FF6B00]">
            Prueba el código <strong>PANA</strong> para un {DEMO_COUPON.percent}% de descuento.
          </p>
          {couponError && <p className="text-xs text-red-500">{couponError}</p>}
        </>
      )}
    </div>
  )
}

// ── Selector de método de pago reutilizable ────────────────────────────────────
function PaymentMethods({ payment, setPayment }: { payment: string; setPayment: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-widest text-[#737373]">Método de pago</p>
      <div className="flex flex-col gap-2">
        {PAYMENT_METHODS.map(m => {
          const active = payment === m.id
          return (
            <button key={m.id} type="button" onClick={() => setPayment(m.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all active:scale-[0.98] text-left"
              style={{
                background:  active ? '#FEF3E2' : '#fff',
                borderColor: active ? '#FF6B00' : '#E5E7EB',
                color:       active ? '#0A0A0A' : '#737373',
                boxShadow:   active ? '0 0 0 2px #FF6B00' : 'none',
              }}>
              <span className="text-lg shrink-0">{m.icon}</span>
              <span className="flex-1 min-w-0">
                {m.label}
                {m.note && <span className="block text-[11px] font-semibold text-[#16A34A] mt-0.5">{m.note}</span>}
              </span>
              {active && <Check size={15} className="text-[#FF6B00] shrink-0" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Tarjeta de producto ────────────────────────────────────────────────────────
function ProductCard({
  product, rate, onOpen, onOrder,
}: {
  product: DemoProduct
  rate: number | null
  onOpen: () => void
  onOrder: () => void
}) {
  return (
    <div
      className="bg-white rounded-3xl overflow-hidden border border-[#F0E8E0] flex flex-col"
      style={{ boxShadow: '0 4px 24px rgba(255,107,0,0.07)' }}
    >
      <button type="button" onClick={onOpen}
        className="relative aspect-square bg-white overflow-hidden w-full group" aria-label={`Ver ${product.name}`}>
        <img src={product.imageUrl} alt={product.name} loading="lazy"
          className="w-full h-full object-contain p-3 group-active:scale-95 transition-transform" />
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-[#FEF3E2] text-[#FF6B00] px-2.5 py-1 rounded-full">
          {product.categoria}
        </span>
      </button>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <button type="button" onClick={onOpen} className="text-left">
          <h3 className="font-display font-black text-base text-[#0A0A0A] leading-tight hover:text-[#FF6B00] transition-colors">
            {product.name}
          </h3>
        </button>
        <p className="text-xs text-[#737373] leading-snug line-clamp-2 flex-1">{product.descripcion}</p>

        {/* Precios — USD grande naranja, Bs. grande y NEGRO */}
        <div className="flex flex-col gap-0.5 mt-1 min-w-0">
          <span className="text-lg xs:text-xl sm:text-2xl font-black text-[#FF6B00] leading-none truncate">{fmtUSD(product.priceUSD)}</span>
          <span className="text-sm xs:text-base sm:text-lg font-black text-[#0A0A0A] truncate">{fmtBS(product.priceUSD, rate)}</span>
        </div>

        <button
          type="button"
          onClick={onOrder}
          className="mt-2 w-full h-11 px-2 rounded-xl font-bold text-[13px] sm:text-sm text-white flex items-center justify-center gap-1.5 whitespace-nowrap transition-all active:scale-[0.97]"
          style={{ background: '#25D366', boxShadow: '0 3px 12px rgba(37,211,102,0.25)' }}
        >
          <WhatsAppIcon size={15} />
          <span className="hidden xs:inline">Pedir por WhatsApp</span>
          <span className="xs:hidden">Pedir</span>
        </button>
      </div>
    </div>
  )
}

// ── Modal de detalle del producto ──────────────────────────────────────────────
function ProductDetailModal({
  product, rate, payment, setPayment, onClose, onAddToCart, onOrder,
  coupon, couponInput, setCouponInput, couponError, applyCoupon,
}: {
  product: DemoProduct
  rate: number | null
  payment: string
  setPayment: (id: string) => void
  onClose: () => void
  onAddToCart: () => void
  onOrder: () => void
  coupon: boolean
  couponInput: string
  setCouponInput: (v: string) => void
  couponError: string
  applyCoupon: () => void
}) {
  const { base, couponPct, payPct, total, saved } = priceSingle(product, payment, coupon)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

      <motion.div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl z-10 flex flex-col"
        style={{ maxHeight: '92dvh' }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        {/* Header sticky con cierre */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm px-5 pt-3 pb-2 flex items-center justify-between rounded-t-3xl">
          <div className="w-10 h-1 bg-[#E5E7EB] rounded-full absolute left-1/2 -translate-x-1/2 top-2 sm:hidden" />
          <div className="w-8" />
          <button onClick={onClose} aria-label="Cerrar"
            className="ml-auto w-9 h-9 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#737373] hover:bg-[#E5E7EB] transition-colors active:scale-95">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-5 flex flex-col gap-4">
          {/* Imagen */}
          <div className="w-full aspect-square bg-white rounded-2xl border border-[#F0E8E0] overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-4" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FEF3E2] text-[#FF6B00] px-2.5 py-1 rounded-full">
              {product.categoria}
            </span>
            <h2 className="font-display font-black text-xl text-[#0A0A0A] leading-tight mt-2">{product.name}</h2>
            <p className="text-sm text-[#737373] mt-1">{product.descripcion}</p>
          </div>

          {/* Método de pago */}
          <PaymentMethods payment={payment} setPayment={setPayment} />

          {/* Cupón de descuento */}
          <CouponField
            coupon={coupon}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            couponError={couponError}
            applyCoupon={applyCoupon}
          />

          {/* Sistema de descuentos / desglose */}
          <div className="bg-[#FAFAFA] border border-[#F0E8E0] rounded-2xl p-4 flex flex-col gap-1.5 text-sm">
            <Row label="Precio" value={fmtUSD(base)} />
            {couponPct > 0 && <Row label={`Cupón ${DEMO_COUPON.code}`} value={`-${couponPct}%`} green />}
            {payPct > 0 && <Row label={`Pago con ${paymentLabel(payment)}`} value={`-${payPct}%`} green />}
            {saved > 0 && <Row label="Ahorras" value={fmtUSD(saved)} green bold />}
            <div className="flex items-end justify-between border-t border-dashed border-[#E5E7EB] pt-2 mt-1">
              <span className="text-sm font-semibold text-[#737373]">Total</span>
              <div className="text-right">
                <p className="text-2xl font-black text-[#FF6B00] leading-none">{fmtUSD(total)}</p>
                <p className="text-lg font-black text-[#0A0A0A] mt-0.5">{fmtBS(total, rate)}</p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-2">
            <button type="button" onClick={onOrder}
              className="w-full h-13 py-3.5 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 active:scale-[0.97]"
              style={{ background: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.30)' }}>
              <WhatsAppIcon size={18} />
              Pedir por WhatsApp
            </button>
            <button type="button" onClick={onAddToCart}
              className="w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.97] border"
              style={{ borderColor: '#FF6B00', color: '#FF6B00', background: '#FEF3E2' }}>
              <ShoppingCart size={16} />
              Agregar al carrito
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Modal de número de WhatsApp ─────────────────────────────────────────────────
function PhoneModal({
  summary, onClose, onConfirm,
  payment, setPayment,
  coupon, couponInput, setCouponInput, couponError, applyCoupon,
}: {
  summary: React.ReactNode
  onClose: () => void
  onConfirm: (phone: string) => void
  payment: string
  setPayment: (id: string) => void
  coupon: boolean
  couponInput: string
  setCouponInput: (v: string) => void
  couponError: string
  applyCoupon: () => void
}) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const handleBuy = () => {
    if (!isValidVzlaPhone(phone)) {
      setError('Número inválido. Debe ser 0414, 0416, 0422, 0424 o 0426.')
      return
    }
    onConfirm(phone)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

      <motion.div
        className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl z-10 flex flex-col
                   h-[100dvh] sm:h-auto sm:max-h-[92dvh]"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        {/* Header sticky — drag handle + cerrar */}
        <div className="sticky top-0 z-20 bg-white px-5 pt-3 pb-2 flex items-center justify-between rounded-t-3xl shrink-0">
          <div className="w-10 h-1 bg-[#E5E7EB] rounded-full absolute left-1/2 -translate-x-1/2 top-2 sm:hidden" />
          <div className="w-8" />
          <button onClick={onClose} aria-label="Cerrar"
            className="ml-auto w-9 h-9 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#737373] hover:bg-[#E5E7EB] transition-colors active:scale-95">
            <X size={16} />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white mb-2"
              style={{ background: '#25D366' }}>
              <WhatsAppIcon size={22} />
            </div>
            <h2 className="font-display font-black text-lg text-[#0A0A0A]">Coloca el número de tu tienda para la demo</h2>
            <p className="text-sm text-[#737373] mt-1">
              Pon tu número y mira cómo te llega el pedido listo para cerrar la venta.
            </p>
          </div>

          {summary}

          <PaymentMethods payment={payment} setPayment={setPayment} />

          <CouponField
            coupon={coupon}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            couponError={couponError}
            applyCoupon={applyCoupon}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0A0A0A]">Número de WhatsApp de tu tienda</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="0414-1234567"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError('') }}
              className="w-full py-3.5 px-4 rounded-xl border bg-white outline-none transition-colors"
              style={{ fontSize: '16px', borderColor: error ? '#DC2626' : '#E5E7EB', color: '#0A0A0A' }}
              onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.12)' }}
              onBlur={e  => { e.target.style.borderColor = error ? '#DC2626' : '#E5E7EB'; e.target.style.boxShadow = 'none' }}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <p className="text-xs text-[#94A3B8]">Acepta 0414, 0416, 0422, 0424, 0426 — con o sin guiones</p>
          </div>
        </div>

        {/* Botón de Comprar — siempre visible, anclado al fondo */}
        <div className="shrink-0 px-4 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] border-t border-[#F0E8E0] bg-white">
          <button type="button" onClick={handleBuy}
            className="w-full rounded-2xl font-black text-white flex items-center justify-center gap-3 active:scale-[0.97] transition-transform"
            style={{ height: '80px', fontSize: '22px', background: '#25D366', boxShadow: '0 8px 32px rgba(37,211,102,0.45)' }}>
            <WhatsAppIcon size={28} />
            Comprar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Drawer del carrito ─────────────────────────────────────────────────────────
function CartDrawer({
  items, rate, onClose, onInc, onDec, onRemove, onAdd, onClear,
  coupon, couponInput, setCouponInput, couponError, applyCoupon,
  payment, setPayment, onCheckout,
}: {
  items: CartItem[]
  rate: number | null
  onClose: () => void
  onInc: (id: string) => void
  onDec: (id: string) => void
  onRemove: (id: string) => void
  onAdd: (p: DemoProduct) => void
  onClear: () => void
  coupon: boolean
  couponInput: string
  setCouponInput: (v: string) => void
  couponError: string
  applyCoupon: () => void
  payment: string
  setPayment: (id: string) => void
  onCheckout: () => void
}) {
  const calc = priceCart(items, coupon, payment)
  const inCart = new Set(items.map(i => i.product.id))
  const upsell = DEMO_PRODUCTS.filter(p => !inCart.has(p.id)).slice(0, 3)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

      <motion.div
        className="relative w-full sm:w-[420px] bg-white rounded-t-3xl sm:rounded-none flex flex-col z-10"
        style={{ maxHeight: '92dvh' }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        <div className="sticky top-0 z-20 bg-white border-b border-[#F0E8E0] px-5 py-4 flex items-center justify-between">
          <div className="w-10 h-1 bg-[#E5E7EB] rounded-full absolute left-1/2 -translate-x-1/2 top-2 sm:hidden" />
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#FF6B00]" />
            <span className="font-display font-black text-base text-[#0A0A0A]">
              Tu carrito ({items.reduce((a, i) => a + i.quantity, 0)})
            </span>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={onClear}
                className="text-xs text-[#94A3B8] hover:text-red-400 transition-colors flex items-center gap-1">
                <Trash2 size={13} /> Vaciar
              </button>
            )}
            <button onClick={onClose} aria-label="Cerrar carrito"
              className="w-9 h-9 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#737373] hover:bg-[#E5E7EB] transition-colors active:scale-95">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingCart size={36} className="text-[#E5E7EB]" />
              <p className="text-sm text-[#737373]">Tu carrito está vacío.<br />Agrega productos para ver la magia.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-start gap-3 p-3 rounded-2xl border border-[#F0E8E0] bg-[#FAFAFA]">
                    <img src={item.product.imageUrl} alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-contain bg-white border border-[#F0E8E0] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0A0A0A] leading-tight">{item.product.name}</p>
                      <p className="text-base font-black text-[#FF6B00] mt-0.5">{fmtUSD(item.product.priceUSD * item.quantity)}</p>
                      <p className="text-base font-black text-[#0A0A0A]">{fmtBS(item.product.priceUSD * item.quantity, rate)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => onDec(item.product.id)}
                          className="w-7 h-7 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#737373] hover:border-[#FF6B00] hover:text-[#FF6B00] active:scale-95">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold text-[#0A0A0A] w-4 text-center">{item.quantity}</span>
                        <button onClick={() => onInc(item.product.id)}
                          className="w-7 h-7 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#737373] hover:border-[#FF6B00] hover:text-[#FF6B00] active:scale-95">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => onRemove(item.product.id)} aria-label="Eliminar"
                      className="text-[#CCCCCC] hover:text-red-400 transition-colors p-1 active:scale-95">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upselling */}
              {upsell.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B00] flex items-center gap-1.5">
                    <Sparkles size={13} /> Completa tu compra
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {upsell.map(p => (
                      <div key={p.id} className="shrink-0 w-32 bg-white border border-[#F0E8E0] rounded-2xl p-2 flex flex-col gap-1">
                        <img src={p.imageUrl} alt={p.name} className="w-full aspect-square object-contain rounded-lg bg-[#FAFAFA]" />
                        <p className="text-xs font-semibold text-[#0A0A0A] leading-tight line-clamp-1">{p.name}</p>
                        <span className="text-sm font-black text-[#FF6B00] leading-none">{fmtUSD(p.priceUSD)}</span>
                        <span className="text-xs font-black text-[#0A0A0A]">{fmtBS(p.priceUSD, rate)}</span>
                        <button onClick={() => onAdd(p)}
                          className="mt-1 w-full h-8 rounded-lg text-xs font-bold text-[#FF6B00] border border-[#FF6B00] flex items-center justify-center gap-1 active:scale-95">
                          <Plus size={12} /> Agregar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cupón */}
              <CouponField
                coupon={coupon}
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                couponError={couponError}
                applyCoupon={applyCoupon}
              />

              {/* Método de pago */}
              <PaymentMethods payment={payment} setPayment={setPayment} />
            </>
          )}
        </div>

        {/* Footer: desglose + total + CTA */}
        {items.length > 0 && (
          <div className="border-t border-[#F0E8E0] px-5 py-4 flex flex-col gap-3 bg-white">
            <div className="flex flex-col gap-1.5 text-sm">
              <Row label="Subtotal" value={fmtUSD(calc.subtotal)} />
              {calc.qtyPct > 0 && <Row label={`Descuento demo (${calc.distinct} × ${PER_PRODUCT_DISCOUNT}%)`} value={`-${calc.qtyPct}%`} green />}
              {calc.couponPct > 0 && <Row label={`Cupón ${DEMO_COUPON.code}`} value={`-${calc.couponPct}%`} green />}
              {calc.payPct > 0 && <Row label={`Pago con ${paymentLabel(payment)}`} value={`-${calc.payPct}%`} green />}
              {calc.saved > 0 && <Row label="Ahorras" value={fmtUSD(calc.saved)} green bold />}
            </div>

            <div className="flex items-end justify-between border-t border-dashed border-[#E5E7EB] pt-3">
              <span className="text-sm font-semibold text-[#737373]">Total a pagar</span>
              <div className="text-right">
                <p className="text-2xl font-black text-[#FF6B00] leading-none">{fmtUSD(calc.total)}</p>
                <p className="text-lg font-black text-[#0A0A0A] mt-1">{fmtBS(calc.total, rate)}</p>
              </div>
            </div>

            <button type="button" onClick={onCheckout}
              className="w-full h-14 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 active:scale-[0.97]"
              style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.30)' }}>
              <WhatsAppIcon size={20} />
              Pedir por WhatsApp
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function Row({ label, value, green, bold }: { label: string; value: string; green?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${bold ? 'font-bold' : ''} text-[#737373]`}>{label}</span>
      <span className={`${bold ? 'font-black' : 'font-semibold'} ${green ? 'text-[#16A34A]' : 'text-[#0A0A0A]'}`}>{value}</span>
    </div>
  )
}

// ── Modal de bienvenida (al cargar la demo) ─────────────────────────────────────
function IntroModal({ onClose, onCta }: { onClose: () => void; onCta: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

      <motion.div
        className="relative w-full max-w-sm bg-white rounded-3xl z-10 p-6 flex flex-col items-center text-center gap-3"
        initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      >
        <button onClick={onClose} aria-label="Cerrar"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#737373] hover:bg-[#E5E7EB] transition-colors active:scale-95">
          <X size={16} />
        </button>

        <img src="/logo.png" alt="Tienda Pana" className="w-20 h-20 object-contain"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(255,107,0,0.22))' }} />
        <h2 className="font-display font-black text-2xl text-[#0A0A0A] leading-tight">
          Esto es una <span className="text-[#FF6B00]">demo</span>
        </h2>
        <p className="text-sm text-[#737373]">
          Así de profesional se vería tu tienda online — pero <strong className="text-[#0A0A0A]">totalmente
          personalizada</strong> con tu marca, tus colores, tus productos reales y tu dominio .com.
          Explórala, agrega al carrito y prueba el cupón <strong className="text-[#FF6B00]">PANA</strong>.
        </p>
        <button type="button" onClick={onClose}
          className="w-full h-12 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 active:scale-[0.97] mt-1"
          style={{ background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)' }}>
          Explorar la demo
        </button>
        <button type="button" onClick={onCta} className="text-sm font-semibold text-[#25D366] underline underline-offset-2">
          O pídeme mi tienda online ya
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function DemoPage() {
  const navigate = useNavigate()
  const { data: rateData } = useDollarRate()
  const rate = rateData?.promedio ?? null

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen]   = useState(false)
  const [coupon, setCoupon]       = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [payment, setPayment]     = useState('pago-movil')
  const [activeProduct, setActiveProduct] = useState<DemoProduct | null>(null)
  const [pendingOrder, setPendingOrder]   = useState<PendingOrder>(null)
  const [introOpen, setIntroOpen] = useState(true)

  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0)
  const goToRequest = () => navigate(DEMO_REQUEST_PATH)

  const addToCart = (p: DemoProduct) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.product.id === p.id)
      if (ex) return prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product: p, quantity: 1 }]
    })
  }
  const inc = (id: string) => setCartItems(prev => prev.map(i => i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i))
  const dec = (id: string) => setCartItems(prev => prev
    .map(i => i.product.id === id ? { ...i, quantity: i.quantity - 1 } : i)
    .filter(i => i.quantity > 0))
  const remove = (id: string) => setCartItems(prev => prev.filter(i => i.product.id !== id))
  const clearCart = () => setCartItems([])

  const applyCoupon = () => {
    if (couponInput.trim().toUpperCase() === DEMO_COUPON.code) { setCoupon(true); setCouponError('') }
    else setCouponError('Ese cupón no existe. Prueba con PANA 😉')
  }

  // Confirmar pedido → abre WhatsApp con mensaje
  const handlePhoneConfirm = (phoneRaw: string) => {
    const wa = normalizeVzlaPhone(phoneRaw)
    let msg = ''

    if (pendingOrder?.type === 'single') {
      const p = pendingOrder.product
      const { total, couponPct } = priceSingle(p, payment, coupon)
      const cuponTxt = couponPct > 0 ? ` (con cupón ${DEMO_COUPON.code} -${couponPct}%)` : ''
      msg = `Hola quiero ${p.name} con un valor de ${fmtUSD(total)} y ${fmtBS(total, rate)}${cuponTxt} voy a pagar con ${paymentLabel(payment)} me manda los datos por favor.`
    } else if (pendingOrder?.type === 'cart' && cartItems.length > 0) {
      const calc = priceCart(cartItems, coupon, payment)
      const lines = cartItems
        .map(i => `• ${i.product.name} ×${i.quantity} — ${fmtUSD(i.product.priceUSD * i.quantity)}`)
        .join('\n')
      const descLines = [
        calc.qtyPct  > 0 ? `Descuento demo: -${calc.qtyPct}%` : '',
        calc.couponPct > 0 ? `Cupón ${DEMO_COUPON.code}: -${calc.couponPct}%` : '',
        calc.payPct  > 0 ? `Pago ${paymentLabel(payment)}: -${calc.payPct}%` : '',
      ].filter(Boolean).join('\n')
      const descBlock = descLines ? `\n${descLines}` : ''
      msg = `Hola, quiero hacer este pedido 🛒\n\n${lines}\n\nSubtotal: ${fmtUSD(calc.subtotal)}${descBlock}\n\nTotal: ${fmtUSD(calc.total)} (${fmtBS(calc.total, rate)})\nVoy a pagar con ${paymentLabel(payment)}\n\n¿Me pasan los datos para pagar?`
    }

    if (msg) window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank')
    setPendingOrder(null)
  }

  // Resumen mostrado dentro del PhoneModal
  const orderSummary = (() => {
    if (pendingOrder?.type === 'single') {
      const { total } = priceSingle(pendingOrder.product, payment, coupon)
      return (
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-[#F0E8E0] bg-[#FAFAFA]">
          <img src={pendingOrder.product.imageUrl} alt={pendingOrder.product.name}
            className="w-14 h-14 rounded-xl object-contain bg-white border border-[#F0E8E0] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0A0A0A] leading-tight">{pendingOrder.product.name}</p>
            <p className="text-base font-black text-[#FF6B00] mt-0.5">{fmtUSD(total)}</p>
            <p className="text-base font-black text-[#0A0A0A]">{fmtBS(total, rate)}</p>
            <p className="text-xs text-[#737373] mt-0.5">Pago: {paymentLabel(payment)}</p>
          </div>
        </div>
      )
    }
    if (pendingOrder?.type === 'cart') {
      const calc = priceCart(cartItems, coupon, payment)
      return (
        <div className="p-3 rounded-2xl border border-[#F0E8E0] bg-[#FAFAFA] flex flex-col gap-1">
          <p className="text-sm font-semibold text-[#0A0A0A]">{cartCount} producto(s) · Pago: {paymentLabel(payment)}</p>
          <p className="text-xl font-black text-[#FF6B00] leading-none">{fmtUSD(calc.total)}</p>
          <p className="text-base font-black text-[#0A0A0A]">{fmtBS(calc.total, rate)}</p>
        </div>
      )
    }
    return null
  })()

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0E8E0]"
        style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.05)' }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/logo.png" alt="Tienda Pana" className="w-7 h-7 object-contain shrink-0" />
            <span className="font-display font-black text-base text-[#0A0A0A] truncate">
              Mi Tienda<span className="text-[#FF6B00]"> Demo</span>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={goToRequest}
              className="hidden sm:flex h-9 px-4 rounded-full font-bold text-sm text-white items-center gap-1.5 active:scale-95"
              style={{ background: '#25D366' }}>
              <WhatsAppIcon size={15} /> Quiero mi tienda
            </button>
            <button type="button" onClick={() => setCartOpen(true)} aria-label="Ver carrito"
              className="relative flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-[#E5E7EB] text-sm font-semibold text-[#0A0A0A] hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors active:scale-95">
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Aviso demo + BCV + cupón */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#FEF3E2] border border-[#FF6B00]/20 rounded-2xl px-4 py-3 flex flex-col gap-1.5 text-center"
        >
          <p className="text-xs text-[#FF6B00] font-semibold">
            👀 Esto es una tienda demo. Así de pro se verá la tuya con Tienda Pana — totalmente personalizada.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-[#737373]">
            {rate && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Tasa BCV: <strong className="text-[#0A0A0A]">Bs. {rate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </span>
            )}
            <span>· Cupón demo: <strong className="text-[#FF6B00]">{DEMO_COUPON.code}</strong> (-{DEMO_COUPON.percent}%)</span>
            <span>· Binance -30%</span>
          </div>
        </motion.div>

        {/* CTA superior */}
        <LikeItBanner onClick={goToRequest} />

        {/* Grid de productos */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {DEMO_PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: (i % 2) * 0.05 }}
            >
              <ProductCard
                product={product}
                rate={rate}
                onOpen={() => setActiveProduct(product)}
                onOrder={() => setPendingOrder({ type: 'single', product })}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA inferior */}
        <LikeItBanner onClick={goToRequest} />

        <div className="text-center pb-2">
          <p className="text-xs text-[#CCCCCC]">Demo creada con</p>
          <a href="/" className="font-display font-black text-sm text-[#FF6B00]">TiendaPana</a>
        </div>
      </div>

      {/* Barra sticky mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#F0E8E0] px-4 py-3"
        style={{ boxShadow: '0 -2px 16px rgba(0,0,0,0.06)' }}>
        {cartCount > 0 ? (
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setCartOpen(true)}
              className="relative h-12 w-14 rounded-xl bg-[#FEF3E2] flex items-center justify-center text-[#FF6B00] active:scale-95 shrink-0">
              <ShoppingCart size={20} />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            </button>
            <GreenCTA onClick={goToRequest} />
          </div>
        ) : (
          <GreenCTA onClick={goToRequest} />
        )}
      </div>

      {/* Modal de bienvenida */}
      <AnimatePresence>
        {introOpen && (
          <IntroModal onClose={() => setIntroOpen(false)} onCta={() => { setIntroOpen(false); goToRequest() }} />
        )}
      </AnimatePresence>

      {/* Modal detalle producto */}
      <AnimatePresence>
        {activeProduct && (
          <ProductDetailModal
            product={activeProduct}
            rate={rate}
            payment={payment}
            setPayment={setPayment}
            onClose={() => setActiveProduct(null)}
            onAddToCart={() => { addToCart(activeProduct); setActiveProduct(null); setCartOpen(true) }}
            onOrder={() => { const p = activeProduct; setActiveProduct(null); setPendingOrder({ type: 'single', product: p }) }}
            coupon={coupon}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            couponError={couponError}
            applyCoupon={applyCoupon}
          />
        )}
      </AnimatePresence>

      {/* Carrito */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer
            items={cartItems}
            rate={rate}
            onClose={() => setCartOpen(false)}
            onInc={inc}
            onDec={dec}
            onRemove={remove}
            onAdd={addToCart}
            onClear={clearCart}
            coupon={coupon}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            couponError={couponError}
            applyCoupon={applyCoupon}
            payment={payment}
            setPayment={setPayment}
            onCheckout={() => { setCartOpen(false); setPendingOrder({ type: 'cart' }) }}
          />
        )}
      </AnimatePresence>

      {/* Modal de número de WhatsApp */}
      <AnimatePresence>
        {pendingOrder && (
          <PhoneModal
            summary={orderSummary}
            onClose={() => setPendingOrder(null)}
            onConfirm={handlePhoneConfirm}
            payment={payment}
            setPayment={setPayment}
            coupon={coupon}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            couponError={couponError}
            applyCoupon={applyCoupon}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
