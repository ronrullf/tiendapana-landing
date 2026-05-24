import { useQuery } from '@tanstack/react-query'

export function useDollarRate() {
  return useQuery({
    queryKey: ['bcv'],
    queryFn: async () => {
      const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial')
      if (!res.ok) throw new Error('BCV fetch failed')
      return res.json() as Promise<{ promedio: number; fechaActualizacion: string }>
    },
    staleTime: 30 * 60 * 1000,
    retry: 1,
  })
}
