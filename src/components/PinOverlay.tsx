import { useRef } from 'react'
import { PlacedPin, PinType } from '../types'
import { PIN_CONFIGS } from '../config/pins'
import { PinIcon } from './PinIcon'
import './PinOverlay.css'

interface PinOverlayProps {
  pins: PlacedPin[]
  selectedType: PinType | null
  pinScale: number
  onPlace: (x: number, y: number) => void
  onRemove: (id: string) => void
}

export function PinOverlay({ pins, selectedType, pinScale, onPlace, onRemove }: PinOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedType) return
    const el = overlayRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    onPlace(x, y)
  }

  return (
    <div
      ref={overlayRef}
      className={`pin-overlay${selectedType ? ' pin-overlay--placing' : ''}`}
      onClick={handleClick}
    >
      {pins.map(pin => {
        const cfg = PIN_CONFIGS.find(c => c.type === pin.type)!
        const shadowExtra = cfg.shadowAsset ? (6 + 2) * pinScale : 0
        const totalH = cfg.height * pinScale + shadowExtra

        return (
          <div
            key={pin.id}
            className="pin-overlay__pin"
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: `translate(-50%, -${cfg.height * pinScale}px)`,
            }}
            onClick={e => { e.stopPropagation(); onRemove(pin.id) }}
            title="Click to remove"
          >
            <PinIcon config={cfg} scale={pinScale} />
            {/* invisible hit area below pin tip so clicks near tip still land */}
            <div className="pin-overlay__pin-hitarea" style={{ height: totalH }} />
          </div>
        )
      })}
    </div>
  )
}
