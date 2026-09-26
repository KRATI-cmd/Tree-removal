import { SITE } from '../data/site'

export default function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label={`${SITE.fullName} home`}>
      <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="7" fill="#EA580C" />
        <path d="M16 5 8 17h4l-5 7h7v3h4v-3h7l-5-7h4z" fill="#082308" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-lg font-black tracking-tight text-white">IRONWOOD</span>
        <span className="block text-[10px] font-bold tracking-[0.18em] text-orange-400 uppercase">Tree &amp; Storm</span>
      </span>
    </a>
  )
}
