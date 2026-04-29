import { useEffect, useRef, useState, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import './PdfViewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface PdfViewerProps {
  file: File
  onSizeChange?: (width: number, height: number) => void
}

export function PdfViewer({ file, onSizeChange }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 })
  const [loading, setLoading] = useState(true)
  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null)
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null)

  const renderPage = useCallback(async (pageNum: number) => {
    const pdf = pdfRef.current
    const canvas = canvasRef.current
    if (!pdf || !canvas) return

    // Cancel any in-progress render
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel()
      renderTaskRef.current = null
    }

    const page = await pdf.getPage(pageNum)
    const ctx = canvas.getContext('2d')!
    const devicePixelRatio = window.devicePixelRatio || 1
    const containerWidth = canvas.parentElement?.clientWidth ?? 900

    const unscaled = page.getViewport({ scale: 1 })
    const scale = (containerWidth / unscaled.width) * devicePixelRatio
    const viewport = page.getViewport({ scale })

    canvas.width = viewport.width
    canvas.height = viewport.height
    canvas.style.width = `${viewport.width / devicePixelRatio}px`
    canvas.style.height = `${viewport.height / devicePixelRatio}px`

    onSizeChange?.(
      viewport.width / devicePixelRatio,
      viewport.height / devicePixelRatio,
    )

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

  useEffect(() => {
    let cancelled = false
    const loadPdf = async () => {
      const buffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
      if (cancelled) { pdf.destroy(); return }
      pdfRef.current = pdf
      setPageInfo({ current: 1, total: pdf.numPages })
      await renderPage(1)
    }
    loadPdf()
    return () => { cancelled = true }
  }, [file, renderPage])

  const goTo = async (n: number) => {
    const next = Math.max(1, Math.min(n, pageInfo.total))
    setPageInfo(p => ({ ...p, current: next }))
    await renderPage(next)
  }

  return (
    <div className="pdf-viewer">
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
