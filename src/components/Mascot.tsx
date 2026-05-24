interface MascotProps {
  variant: 'saludando' | 'con-telefono' | 'sonriendo-circulo' | 'sonriendo-grande' | 'asombrado' | 'pulgar-arriba'
  eager?: boolean
  width?: number
  className?: string
  alt?: string
}

const altTexts: Record<MascotProps['variant'], string> = {
  'saludando':        'Mascota Tienda Pana saludando',
  'con-telefono':     'Mascota Tienda Pana con teléfono',
  'sonriendo-circulo':'Mascota Tienda Pana sonriendo',
  'sonriendo-grande': 'Mascota Tienda Pana sonriendo grande',
  'asombrado':        'Mascota Tienda Pana asombrada',
  'pulgar-arriba':    'Mascota Tienda Pana pulgar arriba',
}

export function Mascot({ variant, eager = false, width, className = '', alt }: MascotProps) {
  const glowFilter =
    variant === 'saludando' || variant === 'pulgar-arriba'
      ? 'drop-shadow(0 8px 24px rgba(255,107,0,0.15))'
      : undefined

  return (
    <img
      src={`/mascot/${variant}.png`}
      alt={alt ?? altTexts[variant]}
      loading={eager ? 'eager' : 'lazy'}
      width={width}
      className={className}
      style={{ filter: glowFilter }}
    />
  )
}
