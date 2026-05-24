import { useLeadSubmit } from '@/hooks/useLeadSubmit'
import { OrangeGlowButton } from './OrangeGlowButton'
import { Lock } from 'lucide-react'

interface Props {
  fuente: 'hero' | 'final' | 'sticky-mobile'
  title?: string
}

export function LeadForm({ fuente, title = 'Quiero mi demo gratis' }: Props) {
  const { form, onSubmit, submitted } = useLeadSubmit(fuente)
  const { register, formState: { errors, isSubmitting } } = form

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <span className="text-4xl">🎉</span>
        <p className="text-xl font-bold text-ink">¡Listo! Te llevamos a WhatsApp.</p>
        <p className="text-muted text-sm">Si el chat no abrió, revisa tu WhatsApp directamente.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <h3 className="text-xl font-bold text-ink font-display">{title}</h3>
      <div className="h-px bg-border w-full" />

      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`nombre-${fuente}`} className="text-sm font-medium text-ink">
          Tu nombre <span className="text-brand-500">*</span>
        </label>
        <input
          id={`nombre-${fuente}`}
          type="text"
          placeholder="María González"
          autoComplete="name"
          className={`h-12 rounded-xl border px-4 text-[15px] outline-none transition-all
            ${errors.nombre
              ? 'border-red-400 ring-2 ring-red-100'
              : 'border-border focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
            }`}
          {...register('nombre')}
        />
        {errors.nombre && (
          <span className="text-xs text-red-500">{errors.nombre.message}</span>
        )}
      </div>

      {/* Instagram */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`instagram-${fuente}`} className="text-sm font-medium text-ink">
          Tu @ de Instagram <span className="text-brand-500">*</span>
        </label>
        <input
          id={`instagram-${fuente}`}
          type="text"
          placeholder="@mitienda"
          autoComplete="off"
          className={`h-12 rounded-xl border px-4 text-[15px] outline-none transition-all
            ${errors.instagram
              ? 'border-red-400 ring-2 ring-red-100'
              : 'border-border focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
            }`}
          {...register('instagram')}
        />
        {errors.instagram && (
          <span className="text-xs text-red-500">{errors.instagram.message}</span>
        )}
      </div>

      {/* Qué vende */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`que_vende-${fuente}`} className="text-sm font-medium text-ink">
          ¿Qué vendes? <span className="text-brand-500">*</span>
        </label>
        <input
          id={`que_vende-${fuente}`}
          type="text"
          placeholder="Ropa, zapatos, comida, cosméticos..."
          className={`h-12 rounded-xl border px-4 text-[15px] outline-none transition-all
            ${errors.que_vende
              ? 'border-red-400 ring-2 ring-red-100'
              : 'border-border focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
            }`}
          {...register('que_vende')}
        />
        {errors.que_vende && (
          <span className="text-xs text-red-500">{errors.que_vende.message}</span>
        )}
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`whatsapp-${fuente}`} className="text-sm font-medium text-ink">
          Tu WhatsApp <span className="text-muted font-normal">(opcional)</span>
        </label>
        <input
          id={`whatsapp-${fuente}`}
          type="tel"
          placeholder="+58 412 000 0000"
          autoComplete="tel"
          className={`h-12 rounded-xl border px-4 text-[15px] outline-none transition-all
            ${errors.whatsapp
              ? 'border-red-400 ring-2 ring-red-100'
              : 'border-border focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
            }`}
          {...register('whatsapp')}
        />
        {errors.whatsapp && (
          <span className="text-xs text-red-500">{errors.whatsapp.message}</span>
        )}
      </div>

      <OrangeGlowButton
        type="submit"
        size="lg"
        fullWidth
        disabled={isSubmitting}
        className="mt-1"
        whatsapp
      >
        {isSubmitting ? 'Un momento...' : 'Quiero mi demo →'}
      </OrangeGlowButton>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted text-center">
        <Lock size={12} />
        No spam. No vendemos tu data.
      </p>
    </form>
  )
}
