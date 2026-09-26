import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './hooks'

const whenIdle = (cb) =>
  'requestIdleCallback' in window ? window.requestIdleCallback(cb, { timeout: 1500 }) : window.setTimeout(cb, 200)
const cancelIdle = (id) => ('cancelIdleCallback' in window ? window.cancelIdleCallback(id) : window.clearTimeout(id))

// Loads a Three.js scene module (kept out of the main bundle) once its container nears the viewport,
// and pauses rendering while it is off-screen or the tab is hidden.
// `load` must be a stable function returning import('...') whose default export is create(container, opts).
export function useThreeScene(containerRef, load) {
  const sceneRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | ready | failed
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let disposed = false
    let started = false
    let visible = false
    let scene = null
    let idleId

    const sync = () => scene?.setActive(visible && !document.hidden)

    const start = () => {
      started = true
      idleId = whenIdle(async () => {
        try {
          const { default: create } = await load()
          if (disposed) return
          scene = create(el, { reducedMotion })
          sceneRef.current = scene
          setStatus('ready')
          sync()
        } catch (err) {
          // No WebGL (or chunk failed to load): the static CSS design remains.
          if (!disposed) {
            console.warn('[3d] scene unavailable:', err)
            setStatus('failed')
          }
        }
      })
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !started) start()
        sync()
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    document.addEventListener('visibilitychange', sync)

    return () => {
      disposed = true
      cancelIdle(idleId)
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      scene?.dispose()
      sceneRef.current = null
      setStatus('idle')
    }
  }, [containerRef, load, reducedMotion])

  return { sceneRef, status }
}
