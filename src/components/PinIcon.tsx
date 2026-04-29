import { PinConfig } from '../types'
import { CHECKMARK_ASSET } from '../config/pins'
import './PinIcon.css'

interface PinIconProps {
  config: PinConfig
  scale?: number
  mini?: boolean
}

export function PinIcon({ config, scale = 1, mini = false }: PinIconProps) {
  const w = config.width * scale
  const h = config.height * scale
  // Shadow ellipse sits below the main body
  const shadowH = 6 * scale
  const shadowW = 26 * scale
  const totalH = h + (config.shadowAsset ? shadowH + 2 * scale : 0)

  if (mini) {
    // Compact preview for the panel — fixed 28px wide
    const miniScale = 28 / config.width
    return (
      <PinIcon config={config} scale={miniScale} />
    )
  }

  return (
    <div
      className="pin-icon"
      style={{ width: w, height: totalH, position: 'relative', flexShrink: 0 }}
    >
      <img
        src={config.bodyAsset}
        className="pin-icon__body"
        alt={config.label}
        style={{ position: 'absolute', top: 0, left: 0, width: w, height: h }}
        draggable={false}
      />
      <img
        src={CHECKMARK_ASSET}
        className="pin-icon__checkmark"
        alt=""
        style={{
          position: 'absolute',
          width: 11.5 * scale,
          height: 9.5 * scale,
          top: 10 * scale,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        draggable={false}
      />
      {config.shadowAsset && (
        <img
          src={config.shadowAsset}
          className="pin-icon__shadow"
          alt=""
          style={{
            position: 'absolute',
            width: shadowW,
            height: shadowH,
            bottom: 0,
            left: 5 * scale,
          }}
          draggable={false}
        />
      )}
    </div>
  )
}
