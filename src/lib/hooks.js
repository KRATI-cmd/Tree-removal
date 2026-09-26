import { useEffect, useRef, useState } from 'react'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

// Eases a number toward `target`; an interrupted animation continues from its current value.
export function useAnimatedNumber(target, duration = 450) {
  const [value, setValue] = useState(target)
  const current = useRef(target)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const from = current.current
    if (from === target) return
    if (reduced) {
      current.current = target
      setValue(target)
      return
    }
    let raf
    let start
    const tick = (now) => {
      start ??= now
      const p = Math.min(1, (now - start) / duration)
      const next = from + (target - from) * (1 - Math.pow(1 - p, 3))
      current.current = next
      setValue(next)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, reduced])

  return value
}
