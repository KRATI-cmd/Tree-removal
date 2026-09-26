import { useEffect, useRef, useState } from 'react'
import { CloudLightning, Construction, FileCheck, PhoneCall, Recycle } from 'lucide-react'
import { SITE } from '../data/site'
import { usePrefersReducedMotion } from '../lib/hooks'
import SectionHeading from './SectionHeading'

const HEADER_OFFSET = 100 // sticky alert bar + nav

const STEPS = [
  {
    icon: CloudLightning,
    title: 'A storm drops a tree on your home',
    text: 'High winds snap a mature oak and send it through your roof, often in the middle of the night.',
    at: [0, 0.2],
  },
  {
    icon: PhoneCall,
    title: 'One call. A crew is dispatched in minutes.',
    text: `A live dispatcher answers ${SITE.phoneVanity}, triages the hazard, and rolls a crane crew. Average arrival: 60 minutes.`,
    at: [0.2, 0.4],
  },
  {
    icon: Construction,
    title: 'The crane lifts it off. Nothing is dropped.',
    text: 'Certified riggers attach a sling, and the crane lifts the tree clear of your house with zero added damage.',
    at: [0.4, 0.64],
  },
  {
    icon: Recycle,
    title: 'Chipped and hauled away the same day',
    text: 'Industrial chippers turn the debris into mulch on site. Your yard is raked and cleared before we leave.',
    at: [0.64, 0.85],
  },
  {
    icon: FileCheck,
    title: 'Roof tarped. Insurance billed directly.',
    text: 'We secure the damage, document everything, and file with your insurer. You pay just your deductible.',
    at: [0.85, 1],
  },
]

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const seg = (p, a, b) => clamp01((p - a) / (b - a))
const mix = (a, b, t) => a + (b - a) * t
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const easeIn = (t) => t * t * t
const easeOutBack = (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2
const rad = (deg) => (deg * Math.PI) / 180

const ATTACH = 126 // sling point, measured from the tree base along the trunk
const CHIP_COLORS = ['#c2410c', '#a16207', '#92400e', '#ea580c']

// Every moving part of the illustration, derived from scroll progress p (0..1).
function computeScene(p) {
  const storm = 1 - easeInOut(seg(p, 0.28, 0.7))
  const flash = Math.max(0, 1 - Math.abs(p - 0.1) / 0.025)
  const fall = easeIn(seg(p, 0.03, 0.13))
  const truckX = mix(-280, 40, easeInOut(seg(p, 0.22, 0.38)))

  const raise = easeInOut(seg(p, 0.4, 0.47))
  const lift = easeInOut(seg(p, 0.52, 0.62))
  const stow = easeInOut(seg(p, 0.8, 0.88))
  let boomAngle = mix(-172, -48, raise)
  boomAngle = mix(boomAngle, -62, lift)
  boomAngle = mix(boomAngle, -172, stow)
  const boomLen = mix(150, 300, easeInOut(seg(p, 0.45, 0.5)) * (1 - stow))
  const pivot = [truckX + 152, 332]
  const tip = [pivot[0] + boomLen * Math.cos(rad(boomAngle)), pivot[1] + boomLen * Math.sin(rad(boomAngle))]

  const chip = easeInOut(seg(p, 0.64, 0.8))
  const base = [mix(250, 205, lift), mix(400, 160, lift)]
  const angle = mix(mix(0, 52, fall), 90, lift)
  const attach = [base[0] + ATTACH * Math.sin(rad(angle)), base[1] - ATTACH * Math.cos(rad(angle))]
  const rig = seg(p, 0.48, 0.52) * (1 - seg(p, 0.79, 0.81))

  return {
    storm,
    flash,
    upright: fall === 0,
    fallen: fall > 0,
    truckX,
    boomAngle,
    boomLen,
    pivot,
    tip,
    base,
    angle,
    attach,
    treeScale: 1 - chip,
    cableEnd: [mix(tip[0], attach[0], rig), mix(tip[1], attach[1], rig)],
    rig,
    damage: seg(p, 0.125, 0.135),
    pile: easeInOut(seg(p, 0.66, 0.82)),
    tarp: easeInOut(seg(p, 0.86, 0.91)),
    stumpGround: seg(p, 0.86, 0.9),
    sunY: mix(360, 110, easeInOut(seg(p, 0.45, 0.95))),
    phone: seg(p, 0.17, 0.21) * (1 - seg(p, 0.38, 0.42)),
    dispatched: p > 0.28,
    badge: easeOutBack(seg(p, 0.9, 0.95)),
    claim: easeInOut(seg(p, 0.92, 0.99)),
    p,
  }
}

function Tree() {
  return (
    <g>
      <rect x="-9" y="-150" width="18" height="150" rx="3" fill="#6b4423" />
      <path d="M0 -110 L-34 -150 M0 -90 L30 -128" stroke="#6b4423" strokeWidth="7" strokeLinecap="round" />
      <circle cx="0" cy="-190" r="60" fill="#1f5d24" />
      <circle cx="-46" cy="-160" r="44" fill="#256b2a" />
      <circle cx="46" cy="-166" r="47" fill="#1a4f1f" />
      <circle cx="-24" cy="-222" r="40" fill="#2f7a2f" />
      <circle cx="28" cy="-226" r="42" fill="#256b2a" />
    </g>
  )
}

function Truck({ s }) {
  return (
    <g transform={`translate(${s.truckX} 0)`}>
      <rect x="62" y="346" width="128" height="42" rx="3" fill="#144414" stroke="#0b2a0b" strokeWidth="2" />
      <text x="126" y="373" textAnchor="middle" fill="#fdba74" fontSize="12" fontWeight="800" fontFamily="Montserrat, sans-serif">
        IRONWOOD
      </text>
      <g transform={`translate(0 350) scale(1 ${Math.max(s.pile, 0.001)}) translate(0 -350)`}>
        <path d="M68 350 Q126 312 184 350 Z" fill="#b45309" />
        <path d="M84 350 Q126 326 168 350 Z" fill="#92400e" />
      </g>
      <rect x="0" y="318" width="64" height="70" rx="7" fill="#ea580c" />
      <rect x="9" y="326" width="32" height="22" rx="3" fill="#bae6fd" />
      <rect x="21" y="309" width="16" height="9" rx="2" fill="#fb923c" className="animate-story-blink" />
      <rect x="140" y="326" width="26" height="24" rx="3" fill="#c2410c" />
      {[32, 160].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="390" r="13" fill="#111827" />
          <circle cx={cx} cy="390" r="5" fill="#9ca3af" />
        </g>
      ))}
    </g>
  )
}

function Scene({ s }) {
  return (
    <>
      <defs>
        <linearGradient id="story-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdba74" />
          <stop offset="1" stopColor="#fff7ed" />
        </linearGradient>
        <linearGradient id="story-storm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07140c" />
          <stop offset="1" stopColor="#23392b" />
        </linearGradient>
        <pattern id="story-rain" width="30" height="60" patternUnits="userSpaceOnUse">
          <line x1="20" y1="0" x2="14" y2="22" stroke="#cfe0ea" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="6" y1="32" x2="0" y2="54" stroke="#cfe0ea" strokeWidth="1.3" strokeLinecap="round" />
        </pattern>
      </defs>

      {/* Sky: warm sunrise under a storm layer that clears as the job progresses */}
      <rect width="800" height="460" fill="url(#story-sky)" />
      <circle cx="690" cy={s.sunY} r="64" fill="#fb923c" opacity="0.25" />
      <circle cx="690" cy={s.sunY} r="40" fill="#f97316" />
      <rect width="800" height="460" fill="url(#story-storm)" opacity={s.storm} />
      <g opacity={s.storm} className="animate-story-drift">
        <ellipse cx="150" cy="54" rx="190" ry="52" fill="#16241b" />
        <ellipse cx="460" cy="38" rx="220" ry="48" fill="#1b2d21" />
        <ellipse cx="730" cy="64" rx="180" ry="50" fill="#16241b" />
      </g>

      <path d="M0 360 Q120 300 250 340 T520 330 T800 318 V400 H0 Z" fill="#2f6b35" />
      {[40, 90, 580, 640, 700, 760].map((x, i) => (
        <polygon key={x} points={`${x - 14},${352 - (i % 2) * 8} ${x},${300 - (i % 3) * 10} ${x + 14},${352 - (i % 2) * 8}`} fill="#1f4d26" />
      ))}
      <rect y="400" width="800" height="60" fill="#3d7a2e" />

      {/* House */}
      <rect x="330" y="300" width="230" height="100" fill="#f5ede4" />
      <polygon points="312,305 445,215 578,305" fill="#5b2a13" />
      <rect x="425" y="340" width="38" height="60" rx="2" fill="#7c2d12" />
      {[356, 494].map((x) => (
        <rect key={x} x={x} y="322" width="44" height="36" fill="#fde68a" stroke="#78716c" strokeWidth="4" />
      ))}
      <polygon points="372,262 388,240 398,256 410,236 424,262 404,274 384,272" fill="#1c1917" opacity={s.damage * (1 - s.tarp)} />
      <g opacity={s.tarp}>
        <polygon points="358,272 380,240 432,236 440,272" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
        <path d="M368 258 L436 254 M384 244 L400 272 M418 238 L426 272" stroke="#c2410c" strokeWidth="1.5" />
      </g>

      {/* Snapped stump, later ground into mulch */}
      <g opacity={s.fallen ? 1 - s.stumpGround : 0}>
        <polygon points="238,400 240,382 246,376 250,386 256,372 262,386 264,400" fill="#6b4423" />
      </g>
      <ellipse cx="251" cy="401" rx="30" ry="6" fill="#92400e" opacity={s.stumpGround} />

      {/* Tree: sways, falls onto the roof, is lifted, then shrinks into chips */}
      {s.treeScale > 0.01 && (
        <g
          transform={`translate(${s.base[0]} ${s.base[1]}) rotate(${s.angle}) translate(0 ${-ATTACH}) scale(${s.treeScale}) translate(0 ${ATTACH})`}
        >
          <g className={s.upright ? 'animate-story-sway' : ''} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
            <Tree />
          </g>
          {s.rig > 0.99 && <rect x="-12" y={-ATTACH - 4} width="24" height="8" rx="2" fill="#fb923c" />}
        </g>
      )}

      {/* Crane truck, telescoping boom and cable */}
      <Truck s={s} />
      <g transform={`translate(${s.pivot[0]} ${s.pivot[1]}) rotate(${s.boomAngle})`}>
        <rect x="0" y="-7" width={Math.min(s.boomLen, 160)} height="14" rx="3" fill="#c2410c" />
        <rect x="140" y="-5" width={Math.max(s.boomLen - 140, 0)} height="10" rx="2" fill="#fb923c" />
      </g>
      {s.rig > 0 && (
        <>
          <line x1={s.tip[0]} y1={s.tip[1]} x2={s.cableEnd[0]} y2={s.cableEnd[1]} stroke="#111827" strokeWidth="2" />
          <circle cx={s.cableEnd[0]} cy={s.cableEnd[1]} r="4" fill="#111827" />
        </>
      )}

      {/* Wood chips arcing into the truck bed */}
      {Array.from({ length: 16 }, (_, i) => {
        const start = 0.645 + (i % 8) * 0.018
        const t = seg(s.p, start, start + 0.05)
        if (t <= 0 || t >= 1) return null
        const [sx, sy] = [s.attach[0] + ((i * 13) % 30) - 15, s.attach[1]]
        const [ex, ey] = [s.truckX + 78 + ((i * 29) % 100), 348]
        return (
          <circle
            key={i}
            cx={mix(sx, ex, t)}
            cy={mix(sy, ey, t) - Math.sin(t * Math.PI) * 50}
            r={3 + (i % 3)}
            fill={CHIP_COLORS[i % 4]}
          />
        )
      })}

      {/* Storm atmosphere: tint, rain, lightning */}
      <rect width="800" height="460" fill="#04140a" opacity={s.storm * 0.35} />
      <g opacity={s.storm * 0.55}>
        <rect y="-60" width="800" height="520" fill="url(#story-rain)" className="animate-story-rain" />
      </g>
      <g opacity={s.flash}>
        <rect width="800" height="460" fill="#fff" opacity="0.45" />
        <polyline points="318,0 296,52 312,56 282,108 298,112 254,146" fill="none" stroke="#fff7d6" strokeWidth="10" opacity="0.35" />
        <polyline points="318,0 296,52 312,56 282,108 298,112 254,146" fill="none" stroke="#fffbeb" strokeWidth="4" strokeLinejoin="round" />
      </g>

      {/* Step 2: the call */}
      <g opacity={s.phone} transform={`translate(28 ${mix(10, 28, s.phone)})`}>
        <rect width="236" height="62" rx="14" fill="#082308" stroke="#fb923c" strokeWidth="2" />
        <circle cx="32" cy="31" r="17" fill="#fb923c" opacity="0.45" className="animate-story-ring" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        <circle cx="32" cy="31" r="17" fill="#ea580c" />
        <path d="M26 24c2 7 5 10 12 12l3-3-4-3-2 2c-2-1-4-3-5-5l2-2-3-4z" fill="#fff" />
        <text x="60" y="27" fill="#fff" fontSize="14" fontWeight="800" fontFamily="Montserrat, sans-serif">
          {s.dispatched ? 'Crew dispatched' : 'Calling dispatch…'}
        </text>
        <text x="60" y="46" fill="#fdba74" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">
          {s.dispatched ? 'Crane truck · ETA 60 min' : SITE.phoneVanity}
        </text>
      </g>

      {/* Step 5: secured and billed */}
      <g transform={`translate(445 150) scale(${Math.max(s.badge, 0.001)})`} opacity={s.badge > 0 ? 1 : 0}>
        <circle r="30" fill="#144414" stroke="#fb923c" strokeWidth="4" />
        <path d="M-12 0 L-3 10 L14 -10" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g opacity={s.claim} transform={`translate(${mix(-40, 28, s.claim)} 28)`}>
        <rect width="236" height="62" rx="14" fill="#082308" stroke="#fb923c" strokeWidth="2" />
        <rect x="16" y="14" width="26" height="34" rx="4" fill="#fb923c" />
        <path d="M22 32 l5 5 l9 -11" fill="none" stroke="#082308" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="56" y="27" fill="#fff" fontSize="14" fontWeight="800" fontFamily="Montserrat, sans-serif">
          Insurance claim filed
        </text>
        <text x="56" y="46" fill="#fdba74" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">
          You pay: deductible only
        </text>
      </g>
    </>
  )
}

function useScrollProgress(trackRef, enabled) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let raf = 0
    const measure = () => {
      raf = 0
      const el = trackRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const distance = r.height - (window.innerHeight - HEADER_OFFSET)
      setProgress(distance > 0 ? clamp01((HEADER_OFFSET - r.top) / distance) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [trackRef, enabled])

  return progress
}

export default function StormStory() {
  const trackRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  const scrolled = useScrollProgress(trackRef, !reduced)
  // Reduced motion: no scroll-driven animation; the steps become buttons that jump between still frames.
  const [manual, setManual] = useState(STEPS[0].at[1] - 0.01)
  const p = reduced ? manual : scrolled
  const s = computeScene(p)
  const active = Math.max(0, STEPS.findIndex((step) => p < step.at[1]))
  const current = p >= 1 ? STEPS.length - 1 : active

  function goToStep(i) {
    const target = STEPS[i].at[0] + (STEPS[i].at[1] - STEPS[i].at[0]) * 0.85
    if (reduced) {
      setManual(i === STEPS.length - 1 ? 1 : target)
      return
    }
    const el = trackRef.current
    const distance = el.offsetHeight - (window.innerHeight - HEADER_OFFSET)
    const top = window.scrollY + el.getBoundingClientRect().top - HEADER_OFFSET
    window.scrollTo({ top: top + target * distance, behavior: 'smooth' })
  }

  const CurrentIcon = STEPS[current].icon

  return (
    <section id="how-it-works" className="bg-forest-900 pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="From Storm Damage to a Clean Yard: One Call"
          intro={reduced ? 'Step through a real emergency removal.' : 'Scroll to watch a real emergency removal play out, step by step.'}
        />
      </div>

      <div ref={trackRef} className={reduced ? 'pb-20 sm:pb-24' : 'h-[380vh] lg:h-[420vh]'}>
        <div
          className={
            reduced
              ? 'mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8'
              : 'sticky top-[100px] mx-auto flex h-[calc(100svh-100px)] max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8'
          }
        >
          <div className="grid items-center gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            {/* Step list (desktop) */}
            <ol className="hidden space-y-2 lg:block">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                const isActive = i === current
                const isDone = i < current
                return (
                  <li key={step.title}>
                    <button
                      type="button"
                      onClick={() => goToStep(i)}
                      aria-current={isActive ? 'step' : undefined}
                      className={`flex w-full gap-4 rounded-2xl border p-4 text-left transition duration-300 ${isActive ? 'border-orange-500/60 bg-white/[0.06] shadow-lg shadow-black/20' : 'border-transparent hover:bg-white/[0.03]'}`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${isActive ? 'bg-orange-500 text-forest-950' : isDone ? 'bg-orange-500/20 text-orange-300' : 'bg-white/10 text-forest-100/60'}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className={`block font-display font-extrabold transition-colors ${isActive ? 'text-white' : 'text-forest-100/60'}`}>
                          {step.title}
                        </span>
                        <span
                          className={`grid transition-[grid-template-rows,opacity] duration-300 ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                          <span className="overflow-hidden">
                            <span className="block pt-1.5 text-sm leading-relaxed text-forest-100/75">{step.text}</span>
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <figure className="overflow-hidden rounded-3xl bg-forest-950 shadow-2xl ring-1 shadow-black/40 ring-white/10">
              <svg viewBox="0 0 800 460" className="block h-auto w-full" role="img" aria-label={STEPS[current].title}>
                <Scene s={s} />
              </svg>
              <figcaption className="flex items-center gap-3 border-t border-white/10 px-4 py-3">
                <span className="text-xs font-bold tracking-wider whitespace-nowrap text-orange-400 uppercase">
                  Step {current + 1} / {STEPS.length}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-linear-to-r from-orange-500 to-orange-300" style={{ width: `${p * 100}%` }} />
                </span>
              </figcaption>
            </figure>

            {/* Current step (mobile/tablet) */}
            <div className="lg:hidden">
              <div key={current} className="flex animate-step-in gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-500 text-forest-950">
                  <CurrentIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display font-extrabold text-white">{STEPS[current].title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-forest-100/75">{STEPS[current].text}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                {STEPS.map((step, i) => (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => goToStep(i)}
                    aria-label={`Step ${i + 1}: ${step.title}`}
                    aria-current={i === current ? 'step' : undefined}
                    className={`h-2.5 rounded-full transition-all ${i === current ? 'w-8 bg-orange-500' : 'w-2.5 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
