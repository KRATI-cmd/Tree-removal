export const digitsOnly = (value) => value.replace(/\D/g, '')

// Formats as (555) 555-0142 while typing; drops a leading US country code.
export function formatPhone(value) {
  let d = digitsOnly(value)
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1)
  d = d.slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export function phoneError(value) {
  const d = digitsOnly(value)
  if (!d) return 'Enter a phone number so dispatch can call you back.'
  if (d.length < 10) return 'Phone number needs 10 digits.'
  if (/^[01]/.test(d)) return 'Area codes can’t start with 0 or 1.'
  return null
}

export function zipError(value) {
  if (!value) return 'Enter your ZIP code.'
  if (!/^\d{5}$/.test(value)) return 'ZIP needs 5 digits.'
  return null
}
