import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqs } from '@/data/faq'

interface FaqItem {
  q: string
  a: string
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0)

  return (
    <section className="py-20 md:py-28 bg-bg">
      <div className="max-w-3xl mx-auto px-5 md:px-8 lg:px-12">

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
        <div className="flex flex-col divide-y divide-border border border-border rounded-2xl overflow-hidden">
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
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-muted leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
