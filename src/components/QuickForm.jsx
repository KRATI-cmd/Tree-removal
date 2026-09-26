import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  House,
  LoaderCircle,
  Lock,
  Phone,
  Scissors,
  Siren,
  TriangleAlert,
  Wind,
  Zap,
} from 'lucide-react'
import { SITE } from '../data/site'
import { PREFILL_EVENT } from '../lib/quote'
import { submitLead } from '../lib/leads'
import { formatPhone, phoneError, zipError } from '../lib/validation'

const HAZARDS = [
  { id: 'structure', label: 'Tree on House / Car', icon: House, urgent: true },
  { id: 'leaning', label: 'Leaning or Cracked Tree', icon: TriangleAlert, urgent: true },
  { id: 'branches', label: 'Fallen Branches', icon: Wind },
  { id: 'routine', label: 'Routine Trimming', icon: Scissors },
]

const STEP_NAMES = ['Urgency', 'Hazard', 'Contact']

function ChoiceCard({ selected, onClick, icon: Icon, title, subtitle, urgent = false }) {
  const tone = urgent
    ? selected
      ? 'border-orange-500 bg-orange-500/15'
      : 'border-white/10 bg-white/[0.03] hover:border-orange-400/70 hover:bg-orange-500/10'
    : selected
      ? 'border-forest-300 bg-forest-300/10'
      : 'border-white/10 bg-white/[0.03] hover:border-forest-300/60 hover:bg-forest-300/5'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex flex-col items-start gap-2 rounded-xl border-2 p-3.5 text-left transition focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950 focus-visible:outline-none sm:p-4 ${tone}`}
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-lg ${urgent ? 'bg-orange-500/20 text-orange-400' : 'bg-forest-300/15 text-forest-200'}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-[15px] leading-tight font-bold text-white">{title}</span>
      {subtitle && <span className="text-xs text-forest-100/60">{subtitle}</span>}
      {selected && (
        <Check
          className={`absolute top-3 right-3 h-4 w-4 ${urgent ? 'text-orange-400' : 'text-forest-200'}`}
          aria-hidden="true"
        />
      )}
    </button>
  )
}

function Field({ id, label, error, valid, inputRef, className = '', ...inputProps }) {
  const border = error
    ? 'border-red-400 focus:ring-red-500/25'
    : valid
      ? 'border-forest-300 focus:ring-forest-300/20'
      : 'border-white/15 focus:border-orange-500 focus:ring-orange-500/25'

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest-100/80">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`block w-full rounded-lg border-2 bg-forest-900 py-3 pr-10 pl-3.5 text-base font-medium text-white transition outline-none placeholder:font-normal placeholder:text-forest-100/35 focus:ring-4 ${border}`}
          {...inputProps}
        />
        {valid && (
          <Check
            className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-forest-300"
            aria-hidden="true"
          />
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm font-semibold text-forest-100/60 hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
    </button>
  )
}

function Success({ isEmergency, phone, onReset }) {
  return (
    <div className="animate-step-in py-2 text-center" role="status">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest-300/15 text-forest-200">
        <Check className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-2xl font-extrabold text-white">
        {isEmergency ? 'Dispatch alerted.' : 'Request received.'}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-forest-100/75">
        {isEmergency
          ? `A crew coordinator will call ${phone} within 5 minutes. Keep everyone clear of the tree and any downed lines.`
          : `A certified arborist will call ${phone} within one business day to book your free on-site inspection.`}
      </p>
      {isEmergency && (
        <a
          href={SITE.phoneHref}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700"
        >
          <Phone className="h-4 w-4" aria-hidden="true" /> Can’t wait? Call {SITE.phoneVanity}
        </a>
      )}
      <div>
        <button type="button" onClick={onReset} className="mt-4 text-sm font-semibold text-forest-100/60 underline hover:text-white">
          Submit another request
        </button>
      </div>
    </div>
  )
}

export default function QuickForm() {
  const [step, setStep] = useState(1)
  const [emergency, setEmergency] = useState(null) // 'yes' | 'no'
  const [hazard, setHazard] = useState(null)
  const [phone, setPhone] = useState('')
  const [zip, setZip] = useState('')
  const [touched, setTouched] = useState({ phone: false, zip: false })
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const phoneRef = useRef(null)
  const zipRef = useRef(null)
  const didMount = useRef(false)

  const isEmergency = emergency === 'yes'
  const phoneErr = phoneError(phone)
  const zipErr = zipError(zip)
  const hazardLabel = HAZARDS.find((h) => h.id === hazard)?.label

  useEffect(() => {
    const onPrefill = (e) => {
      const { emergency: em, hazard: hz } = e.detail ?? {}
      setStatus('idle')
      if (em) setEmergency(em)
      if (hz) setHazard(hz)
      setStep(em && hz ? 3 : em ? 2 : 1)
    }
    window.addEventListener(PREFILL_EVENT, onPrefill)
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill)
  }, [])

  // Move focus to the phone field once the user reaches the last step (not on first render).
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    if (step === 3) phoneRef.current?.focus({ preventScroll: true })
  }, [step])

  function chooseEmergency(value) {
    setEmergency(value)
    setStep(2)
  }

  function chooseHazard(id) {
    setHazard(id)
    setStep(3)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ phone: true, zip: true })
    if (phoneErr) return phoneRef.current?.focus()
    if (zipErr) return zipRef.current?.focus()

    setStatus('submitting')
    try {
      await submitLead({ emergency: isEmergency, hazard, phone, zip })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  function reset() {
    setStep(1)
    setEmergency(null)
    setHazard(null)
    setPhone('')
    setZip('')
    setTouched({ phone: false, zip: false })
    setStatus('idle')
  }

  return (
    <div
      id="quote"
      className={`relative rounded-2xl bg-forest-950/85 text-white shadow-2xl shadow-black/50 backdrop-blur-md transition-shadow ${isEmergency ? 'ring-4 ring-orange-500/80' : 'ring-1 ring-orange-400/30'}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
        <div>
          <p className="font-display text-lg font-extrabold">Rapid Response Request</p>
          <p className="text-xs text-forest-100/60">Takes 20 seconds · No obligation</p>
        </div>
        {isEmergency && status !== 'done' && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-2.5 py-1 text-[11px] font-bold tracking-wider text-orange-300 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" aria-hidden="true" /> Priority
          </span>
        )}
      </div>

      {status !== 'done' && (
        <div className="px-5 pt-4 sm:px-6">
          <div className="flex gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${n <= step ? 'bg-orange-500' : 'bg-white/10'}`}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] font-bold tracking-wider text-forest-100/60 uppercase">
            Step {step} of 3 · {STEP_NAMES[step - 1]}
          </p>
        </div>
      )}

      <div className="px-5 pt-4 pb-5 sm:px-6 sm:pb-6">
        {status === 'done' ? (
          <Success isEmergency={isEmergency} phone={phone} onReset={reset} />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div key={step} className="animate-step-in">
              {step === 1 && (
                <fieldset>
                  <legend className="font-display text-xl font-extrabold">Is this an emergency?</legend>
                  <p className="mt-1 text-sm text-forest-100/65">
                    A tree on a structure, blocking an exit, or about to fall.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <ChoiceCard
                      urgent
                      icon={Siren}
                      title="Yes, urgent"
                      subtitle="Priority crew dispatch"
                      selected={emergency === 'yes'}
                      onClick={() => chooseEmergency('yes')}
                    />
                    <ChoiceCard
                      icon={CalendarCheck}
                      title="No, routine"
                      subtitle="Free quote in 24 hrs"
                      selected={emergency === 'no'}
                      onClick={() => chooseEmergency('no')}
                    />
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset>
                  <div className="flex items-center justify-between">
                    <legend className="font-display text-xl font-extrabold">What’s the hazard?</legend>
                    <BackButton onClick={() => setStep(1)} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {HAZARDS.map((h) => (
                      <ChoiceCard
                        key={h.id}
                        urgent={h.urgent}
                        icon={h.icon}
                        title={h.label}
                        selected={hazard === h.id}
                        onClick={() => chooseHazard(h.id)}
                      />
                    ))}
                  </div>
                  {isEmergency && (
                    <p className="mt-4 flex gap-2 rounded-lg bg-red-500/10 p-3 text-xs leading-relaxed font-medium text-red-200">
                      <Zap className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                      Lines down or anyone hurt? Stay 35 ft back and call 911 and your utility first — then us.
                    </p>
                  )}
                </fieldset>
              )}

              {step === 3 && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl font-extrabold">
                      {isEmergency ? 'Where should we send the crew?' : 'Where should we call you?'}
                    </p>
                    <BackButton onClick={() => setStep(2)} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className={`rounded-full px-3 py-1 ${isEmergency ? 'bg-orange-500/20 text-orange-200' : 'bg-forest-300/15 text-forest-100'}`}
                      aria-label="Change urgency"
                    >
                      {isEmergency ? '🚨 Emergency' : 'Routine'} · edit
                    </button>
                    {hazardLabel && (
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="rounded-full bg-white/10 px-3 py-1 text-forest-100"
                        aria-label="Change hazard type"
                      >
                        {hazardLabel} · edit
                      </button>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-[1fr_7.5rem] gap-3">
                    <Field
                      id="qf-phone"
                      label="Mobile phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="(555) 555-0142"
                      inputRef={phoneRef}
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                      error={touched.phone ? phoneErr : null}
                      valid={!phoneErr}
                    />
                    <Field
                      id="qf-zip"
                      label="ZIP code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="12345"
                      inputRef={zipRef}
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      onBlur={() => setTouched((t) => ({ ...t, zip: true }))}
                      error={touched.zip ? zipErr : null}
                      valid={!zipErr}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-200" role="alert">
                      We couldn’t send your request. Please call dispatch directly at{' '}
                      <a href={SITE.phoneHref} className="font-bold underline">
                        {SITE.phoneVanity}
                      </a>
                      .
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 font-display text-base font-extrabold tracking-wide text-white uppercase shadow-lg transition active:scale-[0.99] disabled:opacity-70 ${isEmergency ? 'bg-orange-600 shadow-orange-600/30 hover:bg-orange-500' : 'bg-orange-500 text-forest-950 shadow-orange-500/20 hover:bg-orange-400'}`}
                  >
                    {status === 'submitting' ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> Sending…
                      </>
                    ) : isEmergency ? (
                      '🚨 Dispatch My Crew'
                    ) : (
                      'Get My Free Quote'
                    )}
                  </button>

                  <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-forest-100/50">
                    <Lock className="mt-px h-3 w-3 shrink-0" aria-hidden="true" />
                    By submitting you agree to be contacted about this request by phone or text. We never sell your
                    information.
                  </p>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
