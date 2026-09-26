const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT

// POSTs the lead as JSON to VITE_LEAD_ENDPOINT (CRM webhook, Zapier, form backend, etc.).
export async function submitLead(lead) {
  const payload = { ...lead, source: 'hero-quick-form', submittedAt: new Date().toISOString() }

  if (!ENDPOINT) {
    // No backend configured: simulate latency so the full flow can still be reviewed.
    await new Promise((resolve) => setTimeout(resolve, 900))
    console.info('[lead] VITE_LEAD_ENDPOINT not set — lead not sent:', payload)
    return
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Lead submission failed (${res.status})`)
}
