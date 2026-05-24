import { motion } from 'framer-motion'
import { Play, ExternalLink } from 'lucide-react'

const IG_PROFILE = 'https://www.instagram.com/tienda.pana/'

// Instagram gradient colors
const reelCards = [
  { label: 'Cómo funciona la tasa BCV automática', views: '2.4K', duration: '0:45' },
  { label: 'Demo en vivo: tienda lista en 72 horas', views: '5.1K', duration: '1:12' },
  { label: 'Antes y después: de .netlify a .com', views: '3.8K', duration: '0:58' },
]

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

export function ReelsSection() {
  return (
    <section className="py-20 md:py-28 bg-surface overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12">

        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 flex items-center gap-2 mb-3">
              <span className="inline-block w-6 h-px bg-brand-500" />
              @tienda.pana
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-ink">
              Mira nuestros últimos reels
            </h2>
          </div>
          <a
            href={IG_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors shrink-0 min-h-[44px]"
          >
            <InstagramIcon size={16} />
            Ver todos en Instagram
            <ExternalLink size={13} />
          </a>
        </motion.div>

        {/* Reel cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reelCards.map((reel, i) => (
            <motion.a
              key={i}
              href={IG_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden border border-border hover:border-brand-300 hover:shadow-md transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* Reel preview area — Instagram gradient */}
              <div
                className="relative h-52 sm:h-64 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, oklch(55% 0.18 310) 0%, oklch(60% 0.20 20) 50%, oklch(72% 0.18 50) 100%)',
                }}
              >
                {/* Play button */}
                <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Play size={22} className="text-white fill-white translate-x-0.5" />
                </div>
                {/* Duration badge */}
                <span className="absolute bottom-3 right-3 text-xs font-semibold text-white bg-black/40 rounded px-1.5 py-0.5">
                  {reel.duration}
                </span>
                {/* Views */}
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-white flex items-center gap-1">
                  <Play size={10} className="fill-white" /> {reel.views}
                </span>
              </div>

              {/* Caption */}
              <div className="p-4 bg-white">
                <p className="text-sm font-medium text-ink leading-snug line-clamp-2">{reel.label}</p>
                <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                  <InstagramIcon size={12} /> @tienda.pana
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <a
            href={IG_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 h-12 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, oklch(55% 0.18 310) 0%, oklch(60% 0.20 20) 50%, oklch(72% 0.18 50) 100%)',
            }}
          >
            <InstagramIcon size={16} />
            Síguenos en Instagram
            <ExternalLink size={14} />
          </a>
        </motion.div>

        {/* NOTE FOR DEVELOPER: To show real reels, connect the Instagram Graph API:
            1. Go to developers.facebook.com and create an app
            2. Add "Instagram Graph API" product
            3. Generate a long-lived access token for the @tienda.pana account
            4. Add VITE_INSTAGRAM_TOKEN=your_token to .env.local
            5. Fetch: https://graph.instagram.com/me/media?fields=id,media_type,thumbnail_url,permalink,timestamp&access_token=VITE_INSTAGRAM_TOKEN
            Then replace the placeholder cards with real media data.
        */}
      </div>
    </section>
  )
}
