import { useState, useCallback } from 'react'
import { PlacedPin, PinType } from '../types'

export function usePins() {
  const [pins, setPins] = useState<PlacedPin[]>([])
  const [selectedType, setSelectedType] = useState<PinType | null>(null)

  const addPin = useCallback((x: number, y: number) => {
    if (!selectedType) return
    setPins(prev => [...prev, {
      id: crypto.randomUUID(),
      type: selectedType,
      x,
      y,
    }])
  }, [selectedType])

  const removePin = useCallback((id: string) => {
    setPins(prev => prev.filter(p => p.id !== id))
  }, [])

  const clearPins = useCallback(() => setPins([]), [])

  return { pins, selectedType, setSelectedType, addPin, removePin, clearPins }
}
