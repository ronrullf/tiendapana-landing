import { useState, useRef } from 'react'
import { Plus, X, ImageIcon, Camera, FolderOpen } from 'lucide-react'
import { showFieldToast } from '@/lib/fieldToast'
import type { Product } from './ProductCard'

interface Props {
  index: number
  onAdd: (product: Product) => void
  onRemove: () => void
  canRemove: boolean
}

export function ProductForm({ index, onAdd, onRemove, canRemove }: Props) {
  const [name, setName]         = useState('')
  const [price, setPrice]       = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [added, setAdded]       = useState(false)
  const galleryRef = useRef<HTMLInputElement>(null)
  const cameraRef  = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    // reset so same file can be re-selected
    e.target.value = ''
  }

  const handleAdd = () => {
    if (!name.trim())                                          { showFieldToast('el nombre del producto'); return }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) { showFieldToast('el precio del producto'); return }
    if (!imageUrl)                                             { showFieldToast('la foto del producto'); return }
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      priceUSD: Number(price),
      imageUrl,
    })
    setAdded(true)
  }

  if (added) {
    return (
      <div className="flex items-center gap-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#0A0A0A] truncate">{name}</p>
          <p className="text-xs text-[#16A34A]">${Number(price).toFixed(2)} · Agregado ✓</p>
        </div>
        {canRemove && (
          <button onClick={onRemove} className="text-[#94A3B8] hover:text-red-400 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="border border-[#F0E8E0] rounded-2xl p-4 flex flex-col gap-3 bg-white">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00]">
          Producto {index + 1}
        </span>
        {canRemove && (
          <button onClick={onRemove} className="text-[#94A3B8] hover:text-red-400 transition-colors">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Image upload */}
      {imageUrl ? (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#F0E8E0]">
          <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#0A0A0A] px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-transform"
          >
            Cambiar foto
          </button>
        </div>
      ) : (
        <div
          className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-[#F0E8E0] flex flex-col items-center justify-center gap-3 p-4"
          style={{ background: '#FEF3E2' }}
        >
          <ImageIcon size={28} className="text-[#FF6B00] opacity-50" />
          <span className="text-sm font-semibold text-[#737373]">Foto del producto</span>
          <div className="flex gap-2 w-full max-w-[260px]">
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="flex-1 h-11 rounded-xl border border-[#FF6B00] text-[#FF6B00] font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              style={{ background: '#fff' }}
            >
              <FolderOpen size={15} />
              Mis archivos
            </button>
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="flex-1 h-11 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)' }}
            >
              <Camera size={15} />
              Cámara
            </button>
          </div>
        </div>
      )}

      {/* Input desde galería/archivos — sin capture */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
        className="hidden"
        onChange={handleImage}
      />
      {/* Input desde cámara — con capture */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImage}
      />

      {/* Name */}
      <input
        type="text"
        placeholder="Nombre del producto"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] text-base text-[#0A0A0A] bg-white outline-none focus:border-[#FF6B00] transition-colors"
        style={{ fontSize: '16px' }}
      />

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-[#737373] font-bold text-base shrink-0">$</span>
        <input
          type="number"
          inputMode="decimal"
          placeholder="Precio en USD"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="flex-1 h-12 px-4 rounded-xl border border-[#E5E7EB] text-base text-[#0A0A0A] bg-white outline-none focus:border-[#FF6B00] transition-colors"
          style={{ fontSize: '16px' }}
        />
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full h-11 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
        style={{ background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)' }}
      >
        <Plus size={16} />
        Agregar producto
      </button>
    </div>
  )
}
