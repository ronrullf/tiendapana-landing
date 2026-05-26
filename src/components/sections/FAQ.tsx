import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqs } from '@/data/faq'
import { useNavigate } from 'react-router-dom'
import { OrangeGlowButton } from '@/components/OrangeGlowButton'

interface FaqItem {
  q: string
  a: string
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0)
  const navigate = useNavigate()

  return (
    <section className="relative py-20 md:py-28 bg-bg overflow-hidden">
      {/* Background orb */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(78% 0.14 40 / 0.06) 0%, transparent 70%)',
          animation: 'glow-pulse 11s ease-in-out infinite',
          animationDelay: '3s',
        }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto px-5 md:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display font-black text-3xl md:text-5xl text-ink">
            Preguntas que probablemente te estés haciendo
          </h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          className="flex flex-col divide-y divide-border border border-border rounded-2xl overflow-hidden bg-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {(faqs as FaqItem[]).map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-surface transition-colors min-h-[56px]"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-base text-ink">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-brand-500"
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden bg-surface"
                  >
                    <p className="px-6 pb-5 pt-1 text-sm text-muted leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Post-FAQ conversion nudge */}
        <motion.div
          className="mt-12 text-center flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-base text-muted">
            ¿Quedó alguna duda? Escríbenos y la resolvemos por WhatsApp antes de la demo.
          </p>
          <OrangeGlowButton size="md" whatsapp onClick={() => navigate('/demo')}>
            Quiero mi demo gratis →
          </OrangeGlowButton>
        </motion.div>
      </div>
    </section>
  )
}
