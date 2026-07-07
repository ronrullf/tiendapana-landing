import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { findClientByCode } from '@/lib/portal'

export default function PortalFinderPage() {
  const navigate = useNavigate()
  const [code, setCode]       = useState('')
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const client = await findClientByCode(code)
      if (!client) {
        setError('Código incorrecto. Revisa el mensaje que te enviamos por WhatsApp.')
        setLoading(false)
        return
      }
      navigate(`/cliente/${client.slug}?code=${encodeURIComponent(code.trim())}`)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-white">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Tienda Pana" className="w-10 h-10 object-contain" />
            <span className="font-display font-black text-xl text-ink">
              Tienda<span className="text-brand-500">Pana</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-8" style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.08)' }}>
          <h1 className="font-display font-black text-2xl text-ink mb-1">Portal de clientes</h1>
          <p className="text-sm text-muted mb-6">
            Ingresa tu código de acceso y te llevamos directo a tu proyecto.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Tu código de acceso"
                autoFocus
                className="w-full h-12 px-4 pr-12 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-base text-ink font-mono tracking-widest focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink transition-colors"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="h-12 rounded-xl font-bold text-white text-base transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #FF7A33 0%, #FF6B00 100%)',
                boxShadow: !loading && code.trim() ? '0 4px 14px rgba(255,107,0,0.35)' : 'none',
              }}
            >
              {loading ? 'Buscando tu proyecto...' : 'Entrar a mi portal →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-4">
          ¿No tienes código?{' '}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, necesito mi código para ingresar al portal 🙏')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-500 hover:underline"
          >
            Escríbenos por WhatsApp
          </a>
        </p>
      </motion.div>
    </div>
  )
}
