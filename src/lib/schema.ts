import { z } from 'zod'

export const leadSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  instagram: z
    .string()
    .min(2, 'Tu @ de Instagram')
    .regex(/^@?[a-zA-Z0-9._]+$/, 'Solo letras, números, puntos y guiones bajos')
    .transform((v) => (v.startsWith('@') ? v : `@${v}`)),
  que_vende: z.string().min(3, 'Cuéntanos en una frase qué vendes'),
  whatsapp: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^(\+?58)?4\d{9}$/.test(v.replace(/\s/g, '')),
      'Formato venezolano: 04XX-XXXXXXX o +58 4XX...'
    ),
})

export type LeadFormData = z.infer<typeof leadSchema>
