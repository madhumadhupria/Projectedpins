export type PinType =
  | 'default'
  | 'projected-1'
  | 'projected-2'
  | 'projected-3'
  | 'projected-4'
  | 'projected-5'
  | 'projected-6'

export interface PlacedPin {
  id: string
  type: PinType
  x: number  // percentage 0–100 relative to overlay container
  y: number  // percentage 0–100 relative to overlay container
}

export interface PinConfig {
  type: PinType
  label: string
  bodyAsset: string
  shadowAsset?: string
  svgW: number    // viewBox width  (all pins = 52)
  svgH: number    // viewBox height (varies by pin)
  tipY: number    // Y of pin anchor in SVG coords (the "point" that touches the document)
}
