import { useState } from 'react'
import { PinType } from '../types'
import { PIN_CONFIGS } from '../config/pins'
import { PinIcon } from './PinIcon'
import './PinPanel.css'

interface PinPanelProps {
  selectedType: PinType | null
  onSelectType: (type: PinType | null) => void
  scale: number
  onScaleChange: (scale: number) => void
  pinCount: number
  onClear: () => void
  onClose: () => void
}

export function PinPanel({
  selectedType,
  onSelectType,
  scale,
  onScaleChange,
  pinCount,
  onClear,
  onClose,
}: PinPanelProps) {
  const [minimized, setMinimized] = useState(false)

  const handleSelect = (type: PinType) => {
    onSelectType(selectedType === type ? null : type)
  }

  return (
    <div className={`pin-panel${minimized ? ' pin-panel--minimized' : ''}`}>
      {/* Header — always visible */}
      <div className="pin-panel__header">
        <span className="pin-panel__title">Pins</span>
        {!minimized && selectedType && (
          <span className="pin-panel__hint">Click document to place</span>
        )}
        <div className="pin-panel__header-actions">
          <button
            className="pin-panel__action-btn"
            onClick={() => setMinimized(m => !m)}
            title={minimized ? 'Expand' : 'Minimise'}
          >
            {minimized ? '▲' : '▼'}
          </button>
          <button
            className="pin-panel__action-btn pin-panel__action-btn--close"
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Collapsible body */}
      {!minimized && (
        <>
          <div className="pin-panel__list">
            {PIN_CONFIGS.map(cfg => {
              const miniScale = 28 / cfg.svgW
              const isSelected = selectedType === cfg.type
              return (
                <button
                  key={cfg.type}
                  className={`pin-panel__item${isSelected ? ' pin-panel__item--selected' : ''}`}
                  onClick={() => handleSelect(cfg.type)}
                  title={cfg.label}
                >
                  <div className="pin-panel__item-icon">
                    <PinIcon config={cfg} scale={miniScale} />
                  </div>
                  <span className="pin-panel__item-label">{cfg.label}</span>
                  {isSelected && <span className="pin-panel__item-badge">●</span>}
                </button>
              )
            })}
          </div>

          <div className="pin-panel__divider" />

          <div className="pin-panel__scale">
            <div className="pin-panel__scale-header">
              <span>Pin Scale</span>
              <span className="pin-panel__scale-value">{scale.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.1}
              value={scale}
              onChange={e => onScaleChange(Number(e.target.value))}
              className="pin-panel__slider"
            />
            <div className="pin-panel__scale-labels">
              <span>0.5×</span>
              <span>2.5×</span>
            </div>
          </div>

          <div className="pin-panel__divider" />

          <div className="pin-panel__footer">
            <span className="pin-panel__count">{pinCount} pin{pinCount !== 1 ? 's' : ''} placed</span>
            <button
              className="pin-panel__clear"
              onClick={onClear}
              disabled={pinCount === 0}
            >
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  )
}
