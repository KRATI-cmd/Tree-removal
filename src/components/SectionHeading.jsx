// tone: 'green' for sections on forest green, 'orange' for sections on the orange brand band.
export default function SectionHeading({ eyebrow, title, intro, tone = 'green', center = false }) {
  const onOrange = tone === 'orange'
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className={`text-xs font-bold tracking-[0.2em] uppercase ${onOrange ? 'text-forest-950' : 'text-orange-400'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-display text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl">{title}</h2>
      {intro && (
        <p className={`mt-4 text-lg leading-relaxed ${onOrange ? 'text-white/90' : 'text-forest-100/80'}`}>{intro}</p>
      )}
    </div>
  )
}
