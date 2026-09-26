import { useState } from 'react'
import { Check, ClipboardCheck, House, Phone, Siren, Sprout, TreeDeciduous, TreePine, Trees, Zap } from 'lucide-react'
import { SITE } from '../data/site'
import { openQuote } from '../lib/quote'
import { useAnimatedNumber } from '../lib/hooks'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import TreePreview3D from './TreePreview3D'

// Ballpark ranges in USD — tune to local market pricing.
const HEIGHTS = [
  { id: 'small', label: 'Small', detail: 'Under 20 ft', icon: TreeDeciduous, base: [250, 650], stump: [125, 250] },
  { id: 'medium', label: 'Medium', detail: '20–50 ft', icon: TreePine, base: [650, 1600], stump: [200, 400] },
  { id: 'large', label: 'Large', detail: '50 ft +', icon: Trees, base: [1600, 4200], stump: [350, 750] },
]

const LOCATIONS = [
  { id: 'yard', label: 'Open Yard', detail: 'Clear drop zone', icon: Sprout, factor: 1 },
  { id: 'roof', label: 'Over Roof', detail: 'Rigging & lowering', icon: House, factor: 1.35 },
  { id: 'power', label: 'Near Powerlines', detail: 'Line-clearance crew', icon: Zap, factor: 1.6 },
  { id: 'fallen', label: 'Active Fallen Emergency', detail: 'Tree down now', icon: Siren, factor: 1.85, urgent: true },
]

const STUMP = [
  { id: 'yes', label: 'Yes, grind it', detail: 'Below-grade removal' },
  { id: 'no', label: 'No thanks', detail: 'Cut flush to ground' },
]

const roundTo50 = (n) => Math.round(n / 50) * 50
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function estimate(heightId, locationId, stump) {
  const h = HEIGHTS.find((x) => x.id === heightId)
  const l = LOCATIONS.find((x) => x.id === locationId)
  const extra = stump === 'yes' ? h.stump : [0, 0]
  return [roundTo50(h.base[0] * l.factor + extra[0]), roundTo50(h.base[1] * l.factor + extra[1])]
}

function OptionGroup({ number, legend, name, options, value, onChange, className }) {
  return (
    <fieldset>
      <legend className="flex items-center gap-2.5 font-display text-base font-extrabold text-white">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-orange-500 text-xs text-forest-950">{number}</span>
        {legend}
      </legend>
      <div className={`mt-3 grid gap-2.5 ${className}`}>
        {options.map((o) => {
          const selected = value === o.id
          const Icon = o.icon
          return (
            <label
              key={o.id}
              className={`relative flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange-500 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-forest-900 ${selected ? (o.urgent ? 'border-orange-500 bg-orange-600/20' : 'border-orange-500 bg-orange-500/10') : 'border-white/10 bg-forest-950/40 hover:border-white/25'}`}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={selected}
                onChange={() => onChange(o.id)}
                className="sr-only"
              />
              {Icon && (
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${selected ? 'bg-orange-500 text-forest-950' : o.urgent ? 'bg-orange-500/15 text-orange-400' : 'bg-white/10 text-forest-100'}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
              <span className="min-w-0">
                <span className="block text-sm leading-tight font-bold text-white">{o.label}</span>
                <span className="block text-xs text-forest-100/60">{o.detail}</span>
              </span>
              {selected && (
                <Check
                  className={`ml-auto h-4 w-4 shrink-0 text-orange-400`}
                  aria-hidden="true"
                />
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function Calculator() {
  const [height, setHeight] = useState('medium')
  const [location, setLocation] = useState('yard')
  const [stump, setStump] = useState('no')

  const [low, high] = estimate(height, location, stump)
  const animLow = useAnimatedNumber(low)
  const animHigh = useAnimatedNumber(high)
  const isEmergency = location === 'fallen'

  const heightOption = HEIGHTS.find((h) => h.id === height)
  const locationOption = LOCATIONS.find((l) => l.id === location)
  const summary = [
    ['Tree size', heightOption.detail],
    ['Location', locationOption.label],
    ['Stump grinding', stump === 'yes' ? 'Included' : 'Not included'],
  ]

  return (
    <section id="calculator" className="bg-forest-950 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Instant Estimate"
          title="Tree Removal Cost & Hazard Calculator"
          intro="Get a realistic price range in seconds. Every final quote is confirmed in writing after a free on-site safety inspection."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
          <Reveal className="space-y-8 rounded-2xl border border-white/10 bg-forest-900 p-5 shadow-xl shadow-black/20 sm:p-7">
            <OptionGroup
              number={1}
              legend="Tree height"
              name="height"
              options={HEIGHTS}
              value={height}
              onChange={setHeight}
              className="sm:grid-cols-3"
            />
            <OptionGroup
              number={2}
              legend="Hazard / location"
              name="location"
              options={LOCATIONS}
              value={location}
              onChange={setLocation}
              className="sm:grid-cols-2"
            />
            <OptionGroup
              number={3}
              legend="Stump grinding needed?"
              name="stump"
              options={STUMP}
              value={stump}
              onChange={setStump}
              className="grid-cols-2"
            />
          </Reveal>

          <Reveal delay={120}>
            <div
              className={`overflow-hidden rounded-2xl bg-linear-to-b from-orange-600 to-orange-700 text-white shadow-2xl shadow-orange-950/40 transition ${isEmergency ? 'ring-4 ring-white/70' : ''}`}
            >
              <TreePreview3D
                height={height}
                location={location}
                stump={stump}
                heightLabel={`${heightOption.label} · ${heightOption.detail}`}
                locationLabel={locationOption.label}
              />
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.2em] text-forest-950 uppercase">Estimated price range</p>
                <p className="mt-3 font-display text-4xl font-black tracking-tight tabular-nums sm:text-5xl" aria-hidden="true">
                  {usd.format(roundTo50(animLow))}
                  <span className="px-2 text-orange-200">–</span>
                  {usd.format(roundTo50(animHigh))}
                </p>
                <p className="sr-only" aria-live="polite">
                  Estimated range {usd.format(low)} to {usd.format(high)}
                </p>

                <dl className="mt-6 divide-y divide-white/20 border-y border-white/20 text-sm">
                  {summary.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-2.5">
                      <dt className="text-white/75">{k}</dt>
                      <dd className="text-right font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-5 space-y-2 text-sm text-white/90">
                  {['Full cleanup & debris haul-away', 'Certified arborist on site', '$2M liability coverage on every job'].map(
                    (item) => (
                      <li key={item} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-950" aria-hidden="true" /> {item}
                      </li>
                    ),
                  )}
                </ul>

                {isEmergency && (
                  <div className="mt-6 rounded-xl bg-forest-950/35 p-4 ring-1 ring-white/25">
                    <p className="flex items-center gap-2 font-bold text-white">
                      <Siren className="h-4 w-4" aria-hidden="true" /> Tree down right now?
                    </p>
                    <p className="mt-1 text-sm text-white/85">
                      Skip the estimate. Storm removals from structures are usually billed straight to your homeowners
                      insurance.
                    </p>
                    <a
                      href={SITE.phoneHref}
                      className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-bold text-orange-700 hover:bg-orange-50"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" /> Call {SITE.phoneVanity}
                    </a>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => openQuote({ emergency: isEmergency ? 'yes' : 'no' })}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-forest-950 px-5 py-4 font-display font-extrabold text-white shadow-lg shadow-orange-950/40 transition hover:bg-forest-900"
                >
                  <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                  Schedule Free On-Site Safety Inspection
                </button>
              </div>
              <p className="bg-orange-800/60 px-6 py-3 text-[11px] leading-snug text-white/75 sm:px-8">
                Ballpark only, based on typical regional jobs. Access, wood species, and debris volume affect the final
                price — which is always confirmed in writing before work begins.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
