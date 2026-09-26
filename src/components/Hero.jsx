import { useEffect, useRef, useState } from 'react'
import { Clock, FileCheck, Phone, ShieldCheck, Star, Zap } from 'lucide-react'
import { SITE } from '../data/site'
import { openQuote } from '../lib/quote'
import { usePrefersReducedMotion } from '../lib/hooks'
import { useThreeScene } from '../lib/useThreeScene'
import QuickForm from './QuickForm'

const loadStorm = () => import('../three/stormScene')

// Clicks on these are normal UI, not a request for lightning.
const INTERACTIVE = 'a, button, input, label, select, textarea, #quote'

const HOOKS = ['Dangerous Tree Falling?', 'Tree Through Your Roof?', 'Limbs on Power Lines?', 'Storm-Split Oak?']

const STATS = [
  { icon: Clock, value: '60 min', label: 'Avg. emergency arrival' },
  { icon: Star, value: '4.9★', label: '612 verified reviews' },
  { icon: ShieldCheck, value: '$2M', label: 'Liability coverage' },
]

// Deterministic pine-tree silhouette for the hero's lower edge.
const TREELINE = (() => {
  let d = 'M0 120 L0 96'
  for (let i = 0; i < 37; i++) {
    const x = i * 40
    const h = 38 + ((i * 53) % 58)
    d += ` L${x + 6} ${114 - h * 0.25} L${x + 20} ${120 - h} L${x + 34} ${114 - h * 0.25}`
  }
  return `${d} L1480 96 L1480 120 Z`
})()

function RotatingHook() {
  const [index, setIndex] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setIndex((i) => (i + 1) % HOOKS.length), 3200)
    return () => clearInterval(id)
  }, [reduced])

  // All phrases share one grid cell so the line height never jumps between phrases.
  return (
    <span className="grid text-orange-400" aria-hidden="true">
      {HOOKS.map((hook, i) => (
        <span
          key={hook}
          className={`col-start-1 row-start-1 transition-all duration-500 ${i === index ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
        >
          {hook}
        </span>
      ))}
    </span>
  )
}

function useStormInteraction(sectionRef, canvasRef, sceneRef, ready) {
  useEffect(() => {
    const section = sectionRef.current
    if (!ready || !section) return

    const toNdc = (e) => {
      const r = canvasRef.current.getBoundingClientRect()
      return [((e.clientX - r.left) / r.width) * 2 - 1, 1 - ((e.clientY - r.top) / r.height) * 2]
    }
    const onMove = (e) => {
      if (e.pointerType === 'mouse') sceneRef.current?.setPointer(...toNdc(e))
    }
    const onLeave = () => sceneRef.current?.setPointer(0, 0)
    const onClick = (e) => {
      if (e.target.closest(INTERACTIVE) || window.getSelection()?.toString()) return
      const [x, y] = toNdc(e)
      if (y >= -1 && y <= 1) sceneRef.current?.strike(x, y)
    }

    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    section.addEventListener('click', onClick)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      section.removeEventListener('click', onClick)
    }
  }, [sectionRef, canvasRef, sceneRef, ready])
}

export default function Hero() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const { sceneRef, status } = useThreeScene(canvasRef, loadStorm)
  const reduced = usePrefersReducedMotion()
  const ready = status === 'ready'
  useStormInteraction(sectionRef, canvasRef, sceneRef, ready)

  return (
    <section ref={sectionRef} id="emergency" className="relative overflow-hidden bg-forest-900 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Three.js storm; on phones it covers the first screen and fades out above the form. */}
        <div
          ref={canvasRef}
          className={`absolute inset-x-0 top-0 h-full max-h-[100svh] mask-[linear-gradient(to_bottom,black_70%,transparent)] transition-opacity duration-1000 lg:max-h-none lg:mask-none ${ready ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Static fallback shown until (or instead of) the 3D scene */}
        <div className={`transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[48px_48px] mask-[linear-gradient(to_bottom,black,transparent_85%)]" />
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute bottom-0 h-20 w-full text-forest-950 sm:h-28">
            <path d={TREELINE} fill="currentColor" />
          </svg>
        </div>
        {/* Keeps headline and form legible over the moving scene */}
        <div className="absolute inset-0 bg-forest-950/40 lg:bg-transparent lg:bg-linear-to-r lg:from-forest-950/75 lg:via-forest-950/25 lg:to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(234,88,12,0.14),transparent_50%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-forest-950 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-20 sm:px-6 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-8 lg:pt-20 lg:pb-32">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 text-[11px] font-bold tracking-widest text-orange-300 uppercase sm:text-xs">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Storm crews on call right now
          </p>

          <h1 className="mt-5 font-display text-[2.4rem] leading-[1.04] font-black tracking-tight sm:text-5xl lg:text-6xl">
            <span className="sr-only">Dangerous Tree Falling? </span>
            <RotatingHook />
            <span className="block">Immediate 24/7 Emergency Removal.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-forest-100/85 sm:text-xl">
            Fully Insured Arborists, Heavy Crane Operations, &amp; Direct Insurance Billing for Storm Cleanup.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={SITE.phoneHref}
              className="inline-flex animate-glow items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-display text-base font-extrabold tracking-wide text-white uppercase shadow-xl shadow-orange-900/40 transition hover:bg-orange-500"
            >
              🚨 Dispatch Emergency Crew Now
            </a>
            <button
              type="button"
              onClick={() => openQuote({ emergency: 'no' })}
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/25 px-6 py-4 font-bold text-white transition hover:border-orange-400 hover:bg-white/5"
            >
              Request Routine Tree Service Quote
            </button>
          </div>
          <a
            href={SITE.phoneHref}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-forest-100/80 hover:text-white"
          >
            <Phone className="h-4 w-4 text-orange-400" aria-hidden="true" />
            Live dispatcher answers 24/7: <span className="font-bold text-white">{SITE.phoneNumeric}</span>
          </a>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="flex items-center gap-1.5 font-display text-2xl font-black text-white sm:text-3xl">
                    <Icon className="hidden h-5 w-5 text-orange-400 sm:block" aria-hidden="true" />
                    {value}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-forest-100/70 sm:text-sm" aria-hidden="true">
                    {label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <QuickForm />
          <p className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-forest-100/70">
            <FileCheck className="h-4 w-4 text-orange-400" aria-hidden="true" />
            We bill most storm claims directly to your insurer.
          </p>
        </div>
      </div>

      {ready && !reduced && (
        <p className="pointer-events-none absolute inset-x-0 bottom-5 hidden justify-center lg:flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 py-1.5 text-xs font-medium text-white/75 backdrop-blur">
            <Zap className="h-3.5 w-3.5 text-orange-400" aria-hidden="true" />
            Move your mouse to steer the storm · click the sky to strike lightning
          </span>
        </p>
      )}
    </section>
  )
}
