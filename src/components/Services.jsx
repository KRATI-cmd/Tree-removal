import { ArrowRight, Check, CloudLightning, Phone, Scissors, Tractor, TriangleAlert } from 'lucide-react'
import { SITE } from '../data/site'
import { openQuote } from '../lib/quote'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const SERVICES = [
  {
    icon: CloudLightning,
    title: 'Emergency Storm Care',
    tag: '24/7 Rapid Response',
    desc: 'When a storm puts a tree where it doesn’t belong, we stabilize, tarp, and remove it — day or night.',
    bullets: ['24/7 rapid crew dispatch', 'Hazard removal & stabilization', 'Trees lifted off structures'],
    featured: true,
  },
  {
    icon: TriangleAlert,
    title: 'Hazardous Tree Removal',
    tag: 'Precision Rigging',
    desc: 'Dead, leaning, or rotten trees taken down piece by piece with controlled, zero-drop rigging.',
    bullets: ['Precision rigging & lowering', 'Tight-space & backyard removals', 'Crane-assisted cutting'],
    prefill: { emergency: 'no', hazard: 'leaning' },
  },
  {
    icon: Scissors,
    title: 'Tree Trimming & Pruning',
    tag: 'ISA Pruning Standards',
    desc: 'Arborist-led pruning that improves tree health, clearance, and resistance to the next storm.',
    bullets: ['Canopy thinning', 'Deadwooding', 'Crown reduction & raising'],
    prefill: { emergency: 'no', hazard: 'routine' },
  },
  {
    icon: Tractor,
    title: 'Stump Grinding & Land Clearing',
    tag: 'Complete Cleanup',
    desc: 'Reclaim your yard or building lot — stumps, roots, and brush ground down and hauled away.',
    bullets: ['Complete root removal', 'Lot & brush clearing', 'On-site wood chipping'],
    prefill: { emergency: 'no' },
  },
]

function ServiceCard({ service }) {
  const { icon: Icon, title, tag, desc, bullets, featured, prefill } = service

  return (
    <article
      className={`group flex h-full flex-col rounded-2xl p-6 transition duration-300 hover:-translate-y-1 sm:p-7 ${featured ? 'bg-linear-to-b from-forest-800 to-forest-950 text-white shadow-2xl shadow-orange-950/40 ring-2 ring-orange-300' : 'border border-white/10 bg-forest-950 shadow-xl shadow-orange-950/30 hover:border-orange-300/60'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid h-12 w-12 place-items-center rounded-xl ${featured ? 'bg-orange-600 text-white' : 'bg-orange-500/15 text-orange-400 group-hover:bg-orange-500 group-hover:text-forest-950'} transition-colors`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${featured ? 'bg-orange-600/25 text-orange-300' : 'bg-white/10 text-forest-100'}`}
        >
          {tag}
        </span>
      </div>
      <h3 className={`mt-5 font-display text-xl font-extrabold text-white`}>{title}</h3>
      <p className={`mt-2 text-[15px] leading-relaxed text-forest-100/75`}>{desc}</p>
      <ul className="mt-5 space-y-2.5">
        {bullets.map((b) => (
          <li key={b} className={`flex items-start gap-2.5 text-sm font-medium text-forest-50`}>
            <Check className={`mt-0.5 h-4 w-4 shrink-0 text-orange-400`} aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        {featured ? (
          <a
            href={SITE.phoneHref}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-bold text-white transition hover:bg-orange-500"
          >
            <Phone className="h-4 w-4" aria-hidden="true" /> Call Dispatch Now
          </a>
        ) : (
          <button
            type="button"
            onClick={() => openQuote(prefill)}
            className="inline-flex items-center gap-1.5 font-bold text-orange-400 transition group-hover:gap-2.5 hover:text-orange-300"
          >
            Get a free quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  )
}

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-linear-to-br from-orange-600 via-orange-600 to-orange-700 py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="orange"
          eyebrow="What We Handle"
          title="From 2 a.m. Storm Emergencies to Planned Tree Care"
          intro="One insured, fully equipped crew for every stage — emergency response, removal, pruning, and final cleanup."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
