import { Award, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { SITE } from '../data/site'
import Logo from './Logo'

const PINS = [
  { x: 200, y: 150, label: 'Oak Valley HQ', hq: true },
  { x: 130, y: 105 },
  { x: 270, y: 95 },
  { x: 285, y: 200 },
  { x: 120, y: 205 },
  { x: 345, y: 140 },
  { x: 60, y: 150 },
]

function CoverageMap() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-forest-900">
      <svg viewBox="0 0 400 300" className="h-auto w-full" role="img" aria-label="Dispatch coverage map placeholder showing a 45-minute primary zone around Oak Valley and an extended storm zone">
        <defs>
          <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.05)" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#map-grid)" />
        <path
          d="M40 90 L110 40 L210 30 L320 55 L375 120 L360 215 L290 265 L170 272 L75 240 L28 170 Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.18)"
          strokeDasharray="4 4"
        />
        <path d="M0 230 C 90 200, 150 250, 230 225 S 360 180, 400 200" fill="none" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="6" />
        <circle cx="200" cy="150" r="140" fill="rgba(249,115,22,0.06)" stroke="rgba(249,115,22,0.35)" strokeDasharray="6 5" />
        <circle cx="200" cy="150" r="85" fill="rgba(234,88,12,0.14)" stroke="rgba(234,88,12,0.7)" />
        {PINS.map((p) => (
          <g key={`${p.x}-${p.y}`}>
            <circle cx={p.x} cy={p.y} r={p.hq ? 7 : 4} fill={p.hq ? '#EA580C' : '#FB923C'} stroke="#082308" strokeWidth="2" />
            {p.hq && (
              <text x={p.x + 12} y={p.y + 4} fill="#fff" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 px-4 py-3 text-xs text-forest-100/75">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-600" aria-hidden="true" /> 45-min primary dispatch
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border border-dashed border-orange-400" aria-hidden="true" /> Extended storm
          zone
        </span>
      </figcaption>
    </figure>
  )
}

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-forest-100/80">
      <div className="border-b border-white/10 bg-linear-to-r from-orange-700 via-orange-600 to-orange-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <p className="font-display text-2xl font-black text-white">Storm damage right now? Don’t wait.</p>
            <p className="mt-1 text-white/85">A live dispatcher answers 24/7/365, including holidays.</p>
          </div>
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-3 rounded-xl bg-forest-950 px-6 py-4 font-display text-xl font-black text-white shadow-xl shadow-orange-900/40 transition hover:bg-forest-900"
          >
            <Phone className="h-6 w-6" aria-hidden="true" /> {SITE.phoneVanity}
          </a>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Emergency storm response, crane-assisted tree removal, and certified arborist care for homes, HOAs, and
            businesses.
          </p>
          <a href={SITE.phoneHref} className="mt-6 block rounded-xl border border-orange-500/40 bg-orange-600/10 p-4 hover:bg-orange-600/20">
            <span className="block text-[11px] font-bold tracking-[0.2em] text-orange-400 uppercase">24/7 Emergency Hotline</span>
            <span className="mt-1 block font-display text-2xl font-black text-white">{SITE.phoneVanity}</span>
            <span className="block text-sm">{SITE.phoneNumeric}</span>
          </a>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 p-4">
            <ShieldCheck className="h-8 w-8 shrink-0 text-green-400" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-bold text-white">{SITE.insurance.liability}</p>
              <p className="text-xs">{SITE.insurance.carrier}</p>
              <p className="mt-1 text-xs">{SITE.license}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="flex items-center gap-2 font-display font-extrabold text-white">
            <MapPin className="h-4 w-4 text-orange-400" aria-hidden="true" /> Service Areas
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {SITE.serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>

          <h2 className="mt-8 flex items-center gap-2 font-display font-extrabold text-white">
            <Award className="h-4 w-4 text-orange-400" aria-hidden="true" /> ISA Certifications
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SITE.isaIds.map((c) => (
              <li key={c.id}>
                <span className="block text-xs font-bold tracking-wide text-forest-100/60 uppercase">{c.name}</span>
                {c.id}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-forest-100/60">Member: TCIA · ANSI Z133 compliant</p>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <h2 className="font-display font-extrabold text-white">Emergency Dispatch Coverage</h2>
          <div className="mt-4">
            <CoverageMap />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. All rights reserved. ·{' '}
            <a href="#" className="hover:text-white">
              Privacy
            </a>{' '}
            ·{' '}
            <a href="#" className="hover:text-white">
              Terms
            </a>
          </p>
          <p className="text-forest-100/60">
            If anyone is injured or power lines are down, call 911 and your utility first.
          </p>
        </div>
      </div>
    </footer>
  )
}
