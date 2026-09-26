const MIN_VISIBLE_MS = 1100 // from navigation start, so the logo draw animation can finish
const MAX_WAIT_MS = 3000 // never hold the page (or an emergency caller) longer than this

// Fades out the inline #app-loader from index.html once fonts and the page have loaded.
export function hideLoader() {
  const el = document.getElementById('app-loader')
  if (!el) return

  const pageLoaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))
  const fontsReady = document.fonts?.ready ?? Promise.resolve()
  const minDelay = new Promise((resolve) => setTimeout(resolve, Math.max(0, MIN_VISIBLE_MS - performance.now())))
  const cap = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS))

  Promise.race([Promise.all([pageLoaded, fontsReady, minDelay]), cap]).then(() => {
    el.classList.add('is-done')
    setTimeout(() => el.remove(), 900)
  })
}
