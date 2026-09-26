import { Phone } from 'lucide-react'
import { SITE } from '../data/site'

export default function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-800 bg-forest-950/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <a
        href={SITE.phoneHref}
        className="flex animate-glow items-center justify-center gap-3 rounded-xl bg-orange-600 px-4 py-3.5 text-white active:bg-orange-700"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        <span className="font-display text-base font-extrabold uppercase tracking-wide">Tap to Call Dispatch 24/7</span>
      </a>
    </div>
  )
}
