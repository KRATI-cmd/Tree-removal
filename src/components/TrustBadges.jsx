import { Award, BadgeCheck, FileCheck, ShieldCheck, Truck } from 'lucide-react'
import Reveal from './Reveal'

const BADGES = [
  {
    icon: Award,
    title: 'Certified Arborists on Staff',
    detail: 'ISA-certified professionals assess and supervise every job.',
  },
  {
    icon: ShieldCheck,
    title: 'Fully Licensed & $2M Insured',
    detail: 'Liability + workers’ comp. Certificate sent before work starts.',
  },
  {
    icon: Truck,
    title: 'Crane & Bucket Truck Equipped',
    detail: 'We own our heavy equipment — no waiting on rentals.',
  },
  {
    icon: FileCheck,
    title: 'Direct Insurance Claim Handling',
    detail: 'We document, file, and bill your insurer directly.',
  },
]

export default function TrustBadges() {
  return (
    <section aria-label="Credentials" className="relative bg-forest-950 pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map(({ icon: Icon, title, detail }, i) => (
            <Reveal as="li" key={title} delay={i * 80}>
              <div className="flex h-full gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-orange-400/40 hover:bg-white/[0.07]">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange-500 text-forest-950">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display leading-snug font-extrabold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-forest-100/70">{detail}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold tracking-wider text-green-400 uppercase">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
