import { useState } from 'react'
import { ChevronDown, Phone } from 'lucide-react'
import { SITE } from '../data/site'
import SectionHeading from './SectionHeading'

const FAQS = [
  {
    q: 'Will my homeowners insurance cover storm damage tree removal?',
    a: 'In most cases, yes. When a tree falls on a covered structure (your house, garage, or fence) because of wind, lightning, or hail, standard homeowners policies typically pay to remove it from the structure and repair the damage. A tree that falls without hitting anything usually isn’t covered. We photograph and document everything, provide an arborist’s report, and bill your carrier directly, so in most claims you only pay your deductible. Coverage varies by policy, and we’ll review yours free.',
  },
  {
    q: 'How quickly can your crew arrive during an active storm?',
    a: 'Our dispatch line is answered by a live person 24/7/365. For life-safety situations, such as a tree through a roof or blocking an exit, we target arrival within 60–90 minutes in our core service area. During regional storm events we triage by hazard severity and keep you updated by text. We never send climbers up during lightning or sustained high winds: we secure the scene and tarp first, then remove the tree as soon as it’s safe.',
  },
  {
    q: 'Are you insured if a branch damages my property during removal?',
    a: 'Yes. We carry $2,000,000 in general liability plus full workers’ compensation, and we email you a certificate of insurance before any work begins. We can also name you or your HOA as additionally insured. Be careful with uninsured crews: if they damage your home or a worker is injured on your property, the liability can fall on you.',
  },
  {
    q: 'Can you remove a tree that’s touching power lines?',
    a: 'We never cut around energized lines. We coordinate with your utility to de-energize the service, then our line-clearance certified arborists and insulated bucket truck handle the removal. If a line is down, stay at least 35 feet away and call 911 and your utility first.',
  },
  {
    q: 'Do I need a permit to remove a tree?',
    a: 'Many municipalities require a permit for trees above a certain trunk diameter or for protected species. Emergency removals of hazardous trees are usually exempt or allowed after the fact. We know the local rules and handle the permit paperwork for you.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="bg-forest-900 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading center eyebrow="Straight Answers" title="Questions Homeowners Ask Us Most" />

        <div className="mt-10 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-forest-950/60 shadow-xl shadow-black/20">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q}>
                <h3>
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-display font-bold text-white transition hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none sm:px-6"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-orange-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 leading-relaxed text-forest-100/75 sm:px-6">{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-center text-forest-100/75">
          Still have a question?{' '}
          <a href={SITE.phoneHref} className="inline-flex items-center gap-1 font-bold text-orange-400 hover:underline">
            <Phone className="h-4 w-4" aria-hidden="true" /> Talk to a dispatcher now
          </a>
        </p>
      </div>
    </section>
  )
}
