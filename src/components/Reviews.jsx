import { Star } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const REVIEWS = [
  {
    quote:
      'At 2 a.m. a 70-foot oak came through our bedroom ceiling. Their crew was in the driveway in under an hour, had the crane set by sunrise, and billed our insurance directly. We paid our deductible and nothing else.',
    name: 'Danielle R.',
    place: 'Cedar Heights',
    job: 'Storm Emergency',
  },
  {
    quote:
      'Three other companies wanted to drop it in sections and hope for the best. Ironwood craned a dead pine over our house and pool without a scratch. Worth every penny.',
    name: 'Marcus T.',
    place: 'Maple Grove',
    job: 'Crane Removal',
  },
  {
    quote:
      'Annual pruning on 14 mature trees across our HOA. The arborist walked the property first, the crew was on time, and cleanup was spotless.',
    name: 'Priya S.',
    place: 'Willow Creek HOA',
    job: 'Trimming & Pruning',
  },
]

function Stars({ className = 'h-4 w-4', color = 'text-orange-400' }) {
  return (
    <span className={`flex gap-0.5 ${color}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${className} fill-current`} />
      ))}
    </span>
  )
}

export default function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-linear-to-br from-orange-600 via-orange-600 to-orange-700 py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.16),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading tone="orange" eyebrow="Reviews" title="Homeowners Call Us on Their Worst Night" />
          <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-forest-950/25 px-5 py-4 backdrop-blur">
            <p className="font-display text-4xl font-black text-white">4.9</p>
            <div>
              <Stars color="text-white" />
              <p className="mt-1 text-sm font-medium text-white/90">612 reviews on Google &amp; BBB</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal as="figure" key={r.name} delay={i * 90} className="flex flex-col rounded-2xl border border-white/10 bg-forest-950 p-6 shadow-xl shadow-orange-950/30">
              <Stars />
              <span className="sr-only">Rated 5 out of 5</span>
              <blockquote className="mt-4 flex-1 leading-relaxed text-forest-50/90">“{r.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <span>
                  <span className="block font-bold text-white">{r.name}</span>
                  <span className="block text-sm text-forest-100/60">{r.place}</span>
                </span>
                <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-orange-300 uppercase">
                  {r.job}
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
