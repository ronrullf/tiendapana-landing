// ─────────────────────────────────────────────────────────────────────────────
// Productos de la TIENDA DEMO pre-cargada (/demo)
// Precios en USD. El precio en Bs. se calcula en vivo con la tasa BCV.
// ─────────────────────────────────────────────────────────────────────────────

export interface DemoProduct {
  id: string
  name: string
  priceUSD: number
  imageUrl: string
  categoria: string
  descripcion: string
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'set-gamer',
    name: 'Set Gamer Completo',
    priceUSD: 65,
    imageUrl: '/productos/set-gamer.webp',
    categoria: 'Gaming',
    descripcion: 'Teclado, mouse, audífonos y mousepad con luces RGB. Todo lo que necesitas para jugar como un pana.',
  },
  {
    id: 'laptop-8gb',
    name: 'Laptop 8GB RAM',
    priceUSD: 310,
    imageUrl: '/productos/laptop-8gb.webp',
    categoria: 'Laptops',
    descripcion: 'Perfecta para trabajar, estudiar y vender por Instagram sin que se te trabe.',
  },
  {
    id: 'laptop-16gb',
    name: 'Laptop 16GB RAM',
    priceUSD: 659,
    imageUrl: '/productos/laptop-16gb.webp',
    categoria: 'Laptops',
    descripcion: 'Más potencia, más velocidad. Para los que no tienen tiempo que perder.',
  },
  {
    id: 'memoria-sd',
    name: 'Memoria SD 64GB',
    priceUSD: 21,
    imageUrl: '/productos/memoria-sd.webp',
    categoria: 'Accesorios',
    descripcion: 'Almacenamiento extra para tus fotos, videos y archivos. Rápida y confiable.',
  },
  {
    id: 'mouse',
    name: 'Mouse Inalámbrico',
    priceUSD: 15,
    imageUrl: '/productos/mouse.webp',
    categoria: 'Accesorios',
    descripcion: 'Cómodo, preciso y sin cables enredados. Un clásico que no falla.',
  },
  {
    id: 'pendrive',
    name: 'Pendrive USB',
    priceUSD: 19,
    imageUrl: '/productos/pendrive.webp',
    categoria: 'Accesorios',
    descripcion: 'Lleva tus archivos a donde vayas. Compacto y resistente.',
  },
  {
    id: 'powerbank',
    name: 'Powerbank 10000mAh',
    priceUSD: 40,
    imageUrl: '/productos/powerbank.webp',
    categoria: 'Energía',
    descripcion: 'Que nunca se te apague el teléfono en plena venta. Carga rápida para 2-3 recargas.',
  },
  {
    id: 'mini-ups',
    name: 'Mini UPS',
    priceUSD: 58,
    imageUrl: '/productos/mini-ups.webp',
    categoria: 'Energía',
    descripcion: 'Mantén tu router y modem encendidos cuando se va la luz. Sigue vendiendo sin parar.',
  },
  {
    id: 'onn-googletv',
    name: 'Onn. Google TV 4K Streaming Box',
    priceUSD: 38,
    imageUrl: '/productos/onn-googletv.webp',
    categoria: 'Entretenimiento',
    descripcion: 'Android 14.0 con Dolby Audio. Convierte cualquier TV en Smart TV 4K.',
  },
  {
    id: 'televisor-toxiik',
    name: 'Televisor Toxiik',
    priceUSD: 222,
    imageUrl: '/productos/televisor-toxiik.webp',
    categoria: 'Entretenimiento',
    descripcion: 'Imagen nítida y colores vivos para disfrutar tus series, películas y partidos.',
  },
]

// Cupón demo
export const DEMO_COUPON = { code: 'PANA', percent: 20 }

// Descuento extra por cada producto distinto agregado al carrito (demo)
export const PER_PRODUCT_DISCOUNT = 5   // %
export const MAX_QTY_DISCOUNT     = 40  // % tope

// Métodos de pago
export interface PaymentMethod {
  id: string
  label: string
  icon: string
  discount: number // % de descuento extra
  note?: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pago-movil', label: 'Pago Móvil', icon: '📱', discount: 0 },
  { id: 'binance',    label: 'Binance',    icon: '🟡', discount: 30, note: '30% de descuento en pagos hechos con Binance' },
  { id: 'zelle',      label: 'Zelle',      icon: '💙', discount: 0 },
]
