import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackMetaPixel } from '@/lib/metaPixel'

export function MetaPixelTracker() {
  const location = useLocation()

  useEffect(() => {
    // Registra PageView en cambios de ruta de la SPA
    trackMetaPixel('PageView')
  }, [location.pathname, location.search])

  return null
}
