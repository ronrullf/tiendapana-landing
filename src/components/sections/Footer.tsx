function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-bg">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 flex flex-col items-center gap-5 text-center">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Tienda Pana" className="w-9 h-9 object-contain" />
          <span className="font-display font-black text-xl text-ink tracking-tight">
            Tienda<span className="text-brand-500">Pana</span>
          </span>
        </a>

        {/* Tagline */}
        <p className="text-sm text-muted max-w-xs">
          Tu tienda online profesional sin dejar de vender.
        </p>

        {/* Instagram only */}
        <a
          href="https://www.instagram.com/tienda.pana/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de Tienda Pana"
          className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted hover:text-brand-500 hover:border-brand-300 transition-colors"
        >
          <InstagramIcon size={20} />
        </a>

        {/* Copyright */}
        <p className="text-xs text-muted">
          © 2026 Tienda Pana · Hecho con 🧡 en Venezuela
        </p>
      </div>
    </footer>
  )
}
