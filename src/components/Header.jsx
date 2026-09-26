import { useEffect, useState } from 'react'
import { Menu, Phone, X } from 'lucide-react'
import { SITE } from '../data/site'
import Logo from './Logo'

const NAV = [
  { label: 'Emergency Service', href: '#emergency' },
  { label: 'Services', href: '#services' },
  { label: 'Equipment & Safety', href: '#equipment' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Reviews', href: '#reviews' },
]

function AlertBar() {
  return (
    <div className="bg-linear-to-r from-orange-700 via-orange-600 to-orange-500 text-white">
      <a
        href={SITE.phoneHref}
        className="group mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-4 py-2 text-[13px] font-semibold sm:text-sm"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
        </span>
        <span>
          🚨 24/7 <span className="hidden sm:inline">Emergency</span> Storm Damage Line:
        </span>
        <span className="font-display font-extrabold tracking-wide underline-offset-4 group-hover:underline">
          {SITE.phoneVanity}
        </span>
      </a>
    </div>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50">
      <AlertBar />
      <div
        className={`border-b bg-forest-950/95 backdrop-blur transition-shadow duration-300 ${scrolled ? 'border-white/10 shadow-lg shadow-black/30' : 'border-transparent'}`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Primary">
          <Logo />
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-forest-100 transition hover:bg-white/5 hover:text-orange-400"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className="hidden items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-600/30 transition hover:bg-orange-500 sm:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call 24/7 Dispatch
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 place-items-center rounded-lg text-white hover:bg-white/10 lg:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {open && (
          <div id="mobile-nav" className="border-t border-white/10 bg-forest-950 lg:hidden">
            <ul className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 font-semibold text-white hover:bg-white/5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href={SITE.phoneHref}
                  className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-3.5 font-bold text-white"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" /> Call 24/7 Dispatch
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}
