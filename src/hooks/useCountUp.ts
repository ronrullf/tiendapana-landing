import { useState, useRef, useCallback } from 'react'

export function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0)
  const hasStarted = useRef(false)

  const start = useCallback(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // ease-out-quart
      setCount(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return { count, start }
}
