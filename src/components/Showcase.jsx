import { Cog, Construction, HardHat, ShieldCheck, Tractor, Truck } from 'lucide-react'
import BeforeAfter from './BeforeAfter'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const EQUIPMENT = [
  {
    icon: Construction,
    name: '60-Ton Hydraulic Crane',
    spec: '140 ft reach · 8,000 lb picks',
    desc: 'Lifts whole sections over homes and pools. Nothing gets dropped.',
  },
  {
    icon: Truck,
    name: '75 ft Aerial Bucket Truck',
    spec: 'Insulated boom · ANSI A92.2',
    desc: 'Safe canopy access near structures and utility corridors.',
  },
  {
    icon: Cog,
    name: 'Industrial Wood Chipper',
    spec: '19" capacity · on-site processing',
    desc: 'Debris chipped on the spot, so your yard is clear the same day.',
  },
  {
    icon: Tractor,
    name: 'Tracked Stump Grinder',
    spec: 'Fits 36" gates · 24" depth',
    desc: 'Gets through standard backyard gates and grinds below grade.',
  },
]

const PROTOCOLS = [
  'ANSI Z133 arboricultural safety compliance',
  'OSHA-trained climbers & riggers',
  'Daily pre-lift crane inspections',
  'Utility line-clearance certified crew',
]

export default function Showcase() {
  return (
    <section id="equipment" className="relative overflow-hidden bg-forest-900 py-20 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.10),transparent_50%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Equipment & Safety"
          title="Precision Over Your Roof. Not Through It."
          intro="Handymen with a chainsaw and a ladder cause more damage than the storm. We bring engineered rigging, cranes, and certified operators."
        />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <Reveal>
            <BeforeAfter />
          </Reveal>

          <div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {EQUIPMENT.map(({ icon: Icon, name, spec, desc }, i) => (
                <Reveal as="li" key={name} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <Icon className="h-7 w-7 text-orange-400" aria-hidden="true" />
                    <p className="mt-3 font-display font-extrabold">{name}</p>
                    <p className="mt-0.5 text-xs font-bold tracking-wide text-orange-300/90 uppercase">{spec}</p>
                    <p className="mt-2 text-sm leading-relaxed text-forest-100/70">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={200} className="mt-4 rounded-2xl bg-orange-500 p-5 text-forest-950">
              <p className="flex items-center gap-2 font-display font-extrabold">
                <HardHat className="h-5 w-5" aria-hidden="true" /> Our Safety Protocol
              </p>
              <ul className="mt-3 grid gap-2 text-sm font-semibold sm:grid-cols-2">
                {PROTOCOLS.map((p) => (
                  <li key={p} className="flex gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
