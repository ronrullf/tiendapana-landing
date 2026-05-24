import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { OrangeGlowButton } from './OrangeGlowButton'

export function StickyBottomCTA() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setVisible(scrolled > 0.4)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 bg-white border-t border-border shadow-lg"
        >
          <OrangeGlowButton fullWidth size="lg" whatsapp onClick={() => navigate('/pide-tu-demo')}>
            Quiero mi demo →
          </OrangeGlowButton>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
