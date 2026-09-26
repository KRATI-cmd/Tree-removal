export const PREFILL_EVENT = 'quote:prefill'

// Lets any section (calculator, service cards, hero CTA) jump to the quick form with answers preselected.
export function openQuote(prefill = {}) {
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: prefill }))
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById('quote')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
