import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function House({ roof }) {
  return (
    <g>
      <rect x="498" y="186" width="26" height="56" fill="#57534e" />
      <rect x="300" y="268" width="260" height="132" fill="#e7e5e4" />
      <rect x="300" y="268" width="260" height="10" fill="#d6d3d1" />
      <polygon points="280,276 430,170 580,276" fill={roof} />
      <polygon points="280,276 430,170 580,276 572,276 430,180 288,276" fill="#000" opacity="0.18" />
      <circle cx="430" cy="236" r="14" fill="#fef3c7" stroke="#78716c" strokeWidth="4" />
      <rect x="410" y="326" width="42" height="74" rx="2" fill="#7c2d12" />
      <circle cx="444" cy="366" r="3" fill="#fbbf24" />
      {[330, 482].map((x) => (
        <g key={x}>
          <rect x={x} y="298" width="50" height="42" fill="#bae6fd" stroke="#78716c" strokeWidth="4" />
          <line x1={x + 25} y1="298" x2={x + 25} y2="340" stroke="#78716c" strokeWidth="3" />
        </g>
      ))}
    </g>
  )
}

function BeforeScene() {
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ba-storm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset="1" stopColor="#475569" />
        </linearGradient>
        <pattern id="ba-rain" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <line x1="6" y1="0" x2="6" y2="12" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.35" />
        </pattern>
      </defs>
      <rect width="800" height="500" fill="url(#ba-storm-sky)" />
      <g fill="#1f2937" opacity="0.9">
        <ellipse cx="160" cy="70" rx="170" ry="55" />
        <ellipse cx="420" cy="50" rx="200" ry="50" />
        <ellipse cx="690" cy="80" rx="170" ry="55" />
      </g>
      <polyline points="640,40 610,120 640,120 600,210" fill="none" stroke="#fde047" strokeWidth="5" strokeLinejoin="round" />
      <rect y="400" width="800" height="100" fill="#3f4f2e" />
      <House roof="#57301a" />
      {/* roof puncture */}
      <polygon points="362,236 380,212 392,230 406,206 418,236 398,250 376,248" fill="#1c1917" />
      {/* snapped stump */}
      <polygon points="100,400 102,334 112,322 118,338 128,318 136,334 146,324 150,400" fill="#6b4423" />
      {/* fallen trunk and limbs */}
      <line x1="128" y1="330" x2="496" y2="206" stroke="#5b3a1e" strokeWidth="26" strokeLinecap="round" />
      <line x1="300" y1="272" x2="340" y2="214" stroke="#5b3a1e" strokeWidth="9" strokeLinecap="round" />
      <line x1="400" y1="238" x2="446" y2="272" stroke="#5b3a1e" strokeWidth="8" strokeLinecap="round" />
      <g fill="#1f3b1f">
        <circle cx="432" cy="198" r="34" />
        <circle cx="474" cy="182" r="42" />
        <circle cx="524" cy="204" r="46" />
        <circle cx="566" cy="240" r="38" />
        <circle cx="504" cy="246" r="36" />
        <circle cx="340" cy="212" r="22" />
      </g>
      <g fill="#2f5530">
        <circle cx="492" cy="190" r="24" />
        <circle cx="546" cy="226" r="22" />
      </g>
      {/* scattered debris */}
      <g stroke="#5b3a1e" strokeWidth="5" strokeLinecap="round">
        <line x1="600" y1="430" x2="650" y2="418" />
        <line x1="230" y1="446" x2="270" y2="438" />
        <line x1="680" y1="460" x2="700" y2="440" />
      </g>
      <rect width="800" height="500" fill="url(#ba-rain)" />
    </svg>
  )
}

function AfterScene() {
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ba-clear-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#ba-clear-sky)" />
      <circle cx="680" cy="90" r="42" fill="#fde68a" />
      <g fill="#fff" opacity="0.9">
        <ellipse cx="170" cy="80" rx="70" ry="22" />
        <ellipse cx="215" cy="68" rx="46" ry="20" />
      </g>
      <ellipse cx="400" cy="420" rx="520" ry="70" fill="#86c58a" />
      <rect y="400" width="800" height="100" fill="#4d7c0f" />
      <House roof="#9a3412" />
      <polygon points="410,400 452,400 478,500 384,500" fill="#d6d3d1" />
      <g fill="#3f6212">
        <circle cx="292" cy="398" r="20" />
        <circle cx="568" cy="398" r="20" />
        <circle cx="320" cy="404" r="14" />
        <circle cx="542" cy="404" r="14" />
      </g>
      {/* stump ground out, new sapling planted */}
      <ellipse cx="125" cy="404" rx="44" ry="9" fill="#78350f" opacity="0.75" />
      <line x1="125" y1="404" x2="125" y2="352" stroke="#78350f" strokeWidth="4" />
      <circle cx="125" cy="344" r="18" fill="#65a30d" />
      <circle cx="114" cy="352" r="11" fill="#4d7c0f" />
    </svg>
  )
}

export default function BeforeAfter() {
  const [pos, setPos] = useState(50)

  return (
    <figure>
      <div className="relative aspect-[8/5] overflow-hidden rounded-2xl bg-slate-800 shadow-2xl ring-1 ring-white/10 select-none">
        <div className="absolute inset-0">
          <AfterScene />
        </div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <BeforeScene />
        </div>

        <span className="absolute top-3 left-3 rounded-md bg-orange-600 px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-white uppercase">
          Before · 2:14 a.m.
        </span>
        <span className="absolute top-3 right-3 rounded-md bg-forest-900 px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-orange-400 uppercase">
          After · Same day
        </span>

        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Drag to compare before and after the removal"
          className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
        />
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] peer-focus-visible:bg-orange-400"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-forest-900 shadow-lg ring-4 ring-black/10">
            <ChevronLeft className="-mr-1 h-4 w-4" aria-hidden="true" />
            <ChevronRight className="-ml-1 h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
      <figcaption className="mt-4 text-sm leading-relaxed text-forest-100/75">
        <strong className="text-white">Crane-lifted, not dropped:</strong> a 68-ft storm-snapped red oak removed from a
        two-story home in sections. No new roof damage, same-day tarp, stump ground and replanted.
      </figcaption>
    </figure>
  )
}
