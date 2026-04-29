import { useState, useRef, useCallback, useEffect } from 'react'
import { usePins } from './hooks/usePins'
import { PdfViewer } from './components/PdfViewer'
import { PinOverlay } from './components/PinOverlay'
import { PinPanel } from './components/PinPanel'
import './App.css'

const MIN_ZOOM = 0.5
const MAX_ZOOM = 4
const ZOOM_STEP = 0.25

export default function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pinScale, setPinScale] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [dragging, setDragging] = useState(false)
  const { pins, selectedType, setSelectedType, addPin, removePin, clearPins } = usePins()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load bundled sample PDF on first mount
  useEffect(() => {
    fetch('/sample.pdf')
      .then(r => r.blob())
      .then(blob => setPdfFile(new File([blob], 'sample.pdf', { type: 'application/pdf' })))
      .catch(() => { /* silently fail – user can upload manually */ })
  }, [])

  const handleFile = (file: File) => {
    if (file.type === 'application/pdf') setPdfFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    setZoom(z => clampZoom(z - e.deltaY * 0.001))
  }

  return (
    <div className="app">
      {/* ── Toolbar ── */}
      <div className="app__toolbar">
        <span className="app__toolbar-title">Projected Pins</span>
        <div className="app__zoom-controls">
          <button
            className="app__zoom-btn"
            onClick={() => setZoom(z => clampZoom(z - ZOOM_STEP))}
            disabled={zoom <= MIN_ZOOM}
            title="Zoom out"
          >−</button>
          <button
            className="app__zoom-level"
            onClick={() => setZoom(1)}
            title="Reset zoom"
          >{Math.round(zoom * 100)}%</button>
          <button
            className="app__zoom-btn"
            onClick={() => setZoom(z => clampZoom(z + ZOOM_STEP))}
            disabled={zoom >= MAX_ZOOM}
            title="Zoom in"
          >+</button>
        </div>
        <label className="app__toolbar-upload" title="Open a different PDF">
          Open PDF
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </label>
      </div>

      {/* ── Main content ── */}
      <div
        className="app__body"
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onWheel={handleWheel}
      >
        <div className={`app__scroll-area${dragging ? ' app__scroll-area--dragging' : ''}`}>
          {pdfFile ? (
            <div className="app__pdf-wrapper">
              <PdfViewer file={pdfFile} zoom={zoom} />
              <PinOverlay
                pins={pins}
                selectedType={selectedType}
                pinScale={pinScale}
                onPlace={addPin}
                onRemove={removePin}
              />
            </div>
          ) : (
            <div className="app__upload">
              <div className="app__upload-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="6" width="32" height="40" rx="3" fill="#f5f5f5" stroke="#ccc" strokeWidth="1.5"/>
                  <rect x="14" y="16" width="20" height="2" rx="1" fill="#ccc"/>
                  <rect x="14" y="22" width="16" height="2" rx="1" fill="#ccc"/>
                  <rect x="14" y="28" width="12" height="2" rx="1" fill="#ccc"/>
                  <circle cx="36" cy="36" r="9" fill="#FAA21B"/>
                  <path d="M36 31v10M31 36h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="app__upload-title">Open a PDF document</p>
              <p className="app__upload-sub">Drag & drop or click to browse</p>
              <button className="app__upload-btn" onClick={() => fileInputRef.current?.click()}>
                Choose PDF
              </button>
            </div>
          )}
        </div>

        <PinPanel
          selectedType={selectedType}
          onSelectType={setSelectedType}
          scale={pinScale}
          onScaleChange={setPinScale}
          pinCount={pins.length}
          onClear={clearPins}
        />
      </div>
    </div>
  )
}
