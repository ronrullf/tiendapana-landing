import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { leadSchema, type LeadFormData } from '@/lib/schema'
import { saveLeadToSupabase } from '@/lib/leads'
import { buildLeadWhatsAppMessage } from '@/lib/whatsapp'
import { trackWhatsAppConversion } from '@/lib/metaPixel'

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || '584241825739'

export function useLeadSubmit(fuente: 'hero' | 'final' | 'sticky-mobile') {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { nombre: '', instagram: '', que_vende: '', whatsapp: '' },
  })

  async function onSubmit(data: LeadFormData) {
    try {
      await saveLeadToSupabase(data, fuente)
    } catch {
      // Lead save failed — still open WhatsApp so we don't lose the conversion
    }

    // Meta Pixel: registrar eventos de conversión (Lead y Contact)
    trackWhatsAppConversion({
      content_name: 'lead_form_landing',
      fuente,
      name: data.nombre,
    })

    const msg = buildLeadWhatsAppMessage(data)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`

    toast.success('¡Listo! Te llevamos a WhatsApp.')
    setSubmitted(true)

    setTimeout(() => window.open(url, '_blank'), 600)
  }

  return { form, onSubmit: form.handleSubmit(onSubmit), submitted }
}
