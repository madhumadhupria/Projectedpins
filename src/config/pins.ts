import { PinConfig } from '../types'

// Checkmark icon is centered at SVG coords (26, 22) for ALL pin types.
// At scale S: left = (26 - 11.5/2) * S = 20.25*S,  top = (22 - 9.5/2) * S = 17.25*S
export const CHECKMARK_ASSET = '/pins/checkmark.svg'
export const BADGE_CX = 26    // badge circle center X in SVG units (constant)
export const BADGE_CY = 22    // badge circle center Y in SVG units (constant)

export const PIN_CONFIGS: PinConfig[] = [
  {
    type: 'default',
    label: 'Default pin',
    bodyAsset: '/pins/pin-default.svg',
    svgW: 52,
    svgH: 57.125,
    tipY: 45.5,        // bottom tip of teardrop path
  },
  {
    type: 'projected-1',
    label: 'Projected pin 1',
    bodyAsset: '/pins/pin-p1.svg',
    svgW: 52,
    svgH: 80,          // viewBox expanded from 68→80 to fit dot drop-shadow
    tipY: 52,          // center of the floating dot below the teardrop
  },
  {
    type: 'projected-2',
    label: 'Projected pin 2',
    bodyAsset: '/pins/pin-p2.svg',
    svgW: 52,
    svgH: 64.125,
    tipY: 52.5,        // bottom of the V-chevron shape
  },
  {
    type: 'projected-3',
    label: 'Projected pin 3',
    bodyAsset: '/pins/pin-default.svg',
    shadowAsset: '/pins/pin-ellipse.svg',
    svgW: 52,
    svgH: 57.125,
    tipY: 45.5,
  },
  {
    type: 'projected-4',
    label: 'Projected pin 4',
    bodyAsset: '/pins/pin-p4.svg',
    svgW: 52,
    svgH: 57.125,
    tipY: 45.5,
  },
  {
    type: 'projected-5',
    label: 'Projected pin 5',
    bodyAsset: '/pins/pin-p5.svg',
    svgW: 52,
    svgH: 57.125,
    tipY: 45.5,
  },
  {
    type: 'projected-6',
    label: 'Projected pin 6',
    bodyAsset: '/pins/pin-p6.svg',
    svgW: 52,
    svgH: 57.125,
    tipY: 45.5,
  },
]
