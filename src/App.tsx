import { useState, useRef, useCallback } from 'react'
import { usePins } from './hooks/usePins'
import { PdfViewer } from './components/PdfViewer'
import { PinOverlay } from './components/PinOverlay'
import { PinPanel } from './components/PinPanel'
import './App.css'

export default function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pinScale, setPinScale] = useState(1)
  const [dragging, setDragging] = useState(false)
  const { pins, selectedType, setSelectedType, addPin, removePin, clearPins } = usePins()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (file.type === 'application/pdf') setPdfFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  return (
    <div className="app">
      <div
        className="app__viewer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {pdfFile ? (
          <div className="app__pdf-wrapper">
            <PdfViewer file={pdfFile} />
            <PinOverlay
              pins={pins}
              selectedType={selectedType}
              pinScale={pinScale}
              onPlace={addPin}
              onRemove={removePin}
            />
          </div>
        ) : (
          <div className={`app__upload${dragging ? ' app__upload--active' : ''}`}>
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
            <button
              className="app__upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose PDF
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
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
  )
}
