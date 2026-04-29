import { useEffect, useRef, useState, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import './PdfViewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface PdfViewerProps {
  file: File
  zoom: number
  onSizeChange?: (width: number, height: number) => void
}

export function PdfViewer({ file, zoom, onSizeChange }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 })
  const [loading, setLoading] = useState(true)
  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null)
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null)

  const renderPage = useCallback(async (pageNum: number, zoomLevel: number) => {
    const pdf = pdfRef.current
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!pdf || !canvas || !container) return

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel()
      renderTaskRef.current = null
    }

    const page = await pdf.getPage(pageNum)
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const unscaled = page.getViewport({ scale: 1 })

    // Fit the whole page into the visible scroll-area at zoom=1
    const PAD = 64 // 32px padding × 2 sides
    const scrollEl = container.closest('.app__scroll-area') as HTMLElement | null
    const availW = (scrollEl?.clientWidth  ?? window.innerWidth)  - PAD
    const availH = (scrollEl?.clientHeight ?? window.innerHeight - 44) - PAD
    const fitScale = Math.min(availW / unscaled.width, availH / unscaled.height)

    const renderScale = fitScale * zoomLevel * dpr
    const viewport = page.getViewport({ scale: renderScale })
    canvas.width  = viewport.width
    canvas.height = viewport.height

    const cssW = unscaled.width  * fitScale * zoomLevel
    const cssH = unscaled.height * fitScale * zoomLevel
    canvas.style.width = `${cssW}px`
    canvas.style.height = `${cssH}px`

    onSizeChange?.(cssW, cssH)

    setLoading(true)
    const task = page.render({ canvasContext: ctx, viewport })
    renderTaskRef.current = task
    try {
      await task.promise
    } catch (e: unknown) {
      if ((e as Error)?.name !== 'RenderingCancelledException') throw e
    }
    setLoading(false)
  }, [onSizeChange])

  // Load PDF when file changes
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const buf = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise
      if (cancelled) { pdf.destroy(); return }
      pdfRef.current = pdf
      setPageInfo({ current: 1, total: pdf.numPages })
      await renderPage(1, zoom)
    }
    load()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  // Re-render when zoom changes
  useEffect(() => {
    if (!pdfRef.current) return
    renderPage(pageInfo.current, zoom)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])

  const goTo = async (n: number) => {
    const next = Math.max(1, Math.min(n, pageInfo.total))
    setPageInfo(p => ({ ...p, current: next }))
    await renderPage(next, zoom)
  }

  return (
    <div ref={containerRef} className="pdf-viewer">
      {loading && <div className="pdf-viewer__loading">Loading…</div>}
      <canvas ref={canvasRef} className="pdf-viewer__canvas" />
      {pageInfo.total > 1 && (
        <div className="pdf-viewer__nav">
          <button onClick={() => goTo(pageInfo.current - 1)} disabled={pageInfo.current <= 1}>‹</button>
          <span>{pageInfo.current} / {pageInfo.total}</span>
          <button onClick={() => goTo(pageInfo.current + 1)} disabled={pageInfo.current >= pageInfo.total}>›</button>
        </div>
      )}
    </div>
  )
}
