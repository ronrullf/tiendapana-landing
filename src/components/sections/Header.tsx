import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrangeGlowButton } from '@/components/OrangeGlowButton'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    // Set initial state too
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navigate = useNavigate()

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md bg-[oklch(99%_0.008_40/0.92)] border-b border-[oklch(92%_0.01_40)] shadow-sm'
          : 'bg-[oklch(99%_0.008_40/0.7)] backdrop-blur-sm border-b border-[oklch(95%_0.01_40/0.5)]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="Tienda Pana" className="w-8 h-8 object-contain" />
          <span className="font-display font-black text-lg text-ink tracking-tight">
            Tienda<span className="text-brand-500">Pana</span>
          </span>
        </a>

        {/* CTA */}
        <OrangeGlowButton size="sm" whatsapp onClick={() => navigate('/pide-tu-demo')}>
          Quiero mi tienda
        </OrangeGlowButton>
      </div>
    </header>
  )
}
