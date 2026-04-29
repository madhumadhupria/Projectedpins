import { PinConfig } from '../types'
import { CHECKMARK_ASSET, BADGE_CX, BADGE_CY } from '../config/pins'
import './PinIcon.css'

interface PinIconProps {
  config: PinConfig
  scale?: number  // 1 = natural SVG size (52px wide, drop-shadow included)
}

export function PinIcon({ config, scale = 1 }: PinIconProps) {
  const w = config.svgW * scale
  const h = config.svgH * scale

  // Checkmark center in SVG coords is (BADGE_CX, BADGE_CY).
  // Checkmark icon is 11.5×9.5 SVG units.
  const ckW = 11.5 * scale
  const ckH = 9.5 * scale
  const ckLeft = (BADGE_CX - 11.5 / 2) * scale   // 20.25 * scale
  const ckTop  = (BADGE_CY - 9.5  / 2) * scale   // 17.25 * scale

  // Shadow ellipse (Projected pin 3): viewBox 0 0 38 18
  // It sits so its center aligns with the pin tip (26, 45.5 in main SVG).
  // Rendered as 38*scale × 18*scale, offset so center-x = 26*scale, center-y = 45.5*scale
  const ellW = 38 * scale
  const ellH = 18 * scale
  const ellLeft = (BADGE_CX - 38 / 2) * scale     // (26 - 19) * scale = 7 * scale
  const ellTop  = (config.tipY - 18 / 2) * scale  // (45.5 - 9) * scale = 36.5 * scale

  return (
    <div className="pin-icon" style={{ width: w, height: h + (config.shadowAsset ? ellH / 2 : 0) }}>
      {/* Main pin body — rendered at natural SVG aspect ratio */}
      <img
        src={config.bodyAsset}
        className="pin-icon__body"
        alt={config.label}
        width={w}
        height={h}
        draggable={false}
      />

      {/* Checkmark, precisely positioned over badge circle */}
      <img
        src={CHECKMARK_ASSET}
        className="pin-icon__checkmark"
        alt=""
        width={ckW}
        height={ckH}
        style={{ left: ckLeft, top: ckTop }}
        draggable={false}
      />

      {/* Shadow ellipse for Projected pin 3 */}
      {config.shadowAsset && (
        <img
          src={config.shadowAsset}
          className="pin-icon__shadow"
          alt=""
          width={ellW}
          height={ellH}
          style={{ left: ellLeft, top: ellTop }}
          draggable={false}
        />
      )}
    </div>
  )
}
