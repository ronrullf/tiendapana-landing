import { useEffect } from 'react'

/**
 * Carga Microsoft Clarity si VITE_CLARITY_PROJECT_ID está definido.
 * Pasos para activarlo:
 *   1. Crea una cuenta gratis en https://clarity.microsoft.com
 *   2. Crea un proyecto nuevo y copia el Project ID (ej: "abcde12345")
 *   3. Agrégalo en Vercel → Settings → Environment Variables:
 *        VITE_CLARITY_PROJECT_ID = tu-project-id
 *   4. Re-deploya y listo — Clarity empieza a grabar sesiones automáticamente.
 */
export function ClarityScript() {
  const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined

  useEffect(() => {
    if (!projectId) return                   // no hacer nada en dev sin ID
    if (typeof window === 'undefined') return
    if ((window as any).clarity) return      // ya cargado

    // Inyectar el snippet oficial de Clarity
    ;(function (c: any, l: any, a: string, r: string, i: string) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }
      const t = l.createElement(r) as HTMLScriptElement
      t.async = true
      t.src = 'https://www.clarity.ms/tag/' + i
      const y = l.getElementsByTagName(r)[0]
      y.parentNode?.insertBefore(t, y)
    })(window, document, 'clarity', 'script', projectId)
  }, [projectId])

  return null
}
