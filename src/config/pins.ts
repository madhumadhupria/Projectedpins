import { PinConfig } from '../types'

export const CHECKMARK_ASSET = '/pins/checkmark.svg'

export const PIN_CONFIGS: PinConfig[] = [
  {
    type: 'default',
    label: 'Default pin',
    bodyAsset: '/pins/pin-default.svg',
    width: 36,
    height: 41,
  },
  {
    type: 'projected-1',
    label: 'Projected pin 1',
    bodyAsset: '/pins/pin-p1.svg',
    width: 36,
    height: 60,
  },
  {
    type: 'projected-2',
    label: 'Projected pin 2',
    bodyAsset: '/pins/pin-p2.svg',
    width: 36,
    height: 48,
  },
  {
    type: 'projected-3',
    label: 'Projected pin 3',
    bodyAsset: '/pins/pin-default.svg',
    shadowAsset: '/pins/pin-ellipse.svg',
    width: 36,
    height: 41,
  },
  {
    type: 'projected-4',
    label: 'Projected pin 4',
    bodyAsset: '/pins/pin-p4.svg',
    width: 36,
    height: 41,
  },
  {
    type: 'projected-5',
    label: 'Projected pin 5',
    bodyAsset: '/pins/pin-p5.svg',
    width: 36,
    height: 41,
  },
  {
    type: 'projected-6',
    label: 'Projected pin 6',
    bodyAsset: '/pins/pin-p6.svg',
    width: 36,
    height: 41,
  },
]
