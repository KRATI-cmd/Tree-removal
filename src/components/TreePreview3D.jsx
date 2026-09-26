import { useEffect, useRef } from 'react'
import { LoaderCircle, Move3d } from 'lucide-react'
import { useThreeScene } from '../lib/useThreeScene'

const loadPreview = () => import('../three/treePreview')

export default function TreePreview3D({ height, location, stump, heightLabel, locationLabel }) {
  const containerRef = useRef(null)
  const { sceneRef, status } = useThreeScene(containerRef, loadPreview)

  useEffect(() => {
    if (status === 'ready') sceneRef.current?.update({ height, location, stump })
  }, [status, height, location, stump, sceneRef])

  if (status === 'failed') return null

  return (
    <div
      role="img"
      aria-label={`3D preview: ${heightLabel} tree, ${locationLabel}${stump === 'yes' ? ', stump marked for grinding' : ''}`}
      className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_top,#1a521a,#082308_75%)]"
    >
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-opacity duration-700 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
      />
      {status !== 'ready' && (
        <div className="absolute inset-0 grid place-items-center">
          <LoaderCircle className="h-6 w-6 animate-spin text-forest-300" aria-hidden="true" />
        </div>
      )}
      <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-1.5 text-[11px] font-bold tracking-wide uppercase">
        <span className="rounded-md bg-black/40 px-2 py-1 text-white backdrop-blur">{heightLabel}</span>
        <span
          className={`rounded-md px-2 py-1 backdrop-blur ${location === 'fallen' || location === 'power' ? 'bg-orange-600/90 text-white' : 'bg-black/40 text-orange-300'}`}
        >
          {locationLabel}
        </span>
      </div>
      {status === 'ready' && (
        <p className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-1 text-[11px] font-semibold text-white/80 backdrop-blur">
          <Move3d className="h-3.5 w-3.5" aria-hidden="true" /> Drag to rotate
        </p>
      )}
    </div>
  )
}
