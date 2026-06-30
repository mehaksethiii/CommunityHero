import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'
import { analyzeIssueImage } from '@/lib/gemini'
import type { AiAnalysis } from '@/types'

interface Props {
  onFilesChange: (files: File[]) => void
  onAiAnalysis: (analysis: AiAnalysis) => void
}

export default function MediaUploader({ onFilesChange, onAiAnalysis }: Props) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const [analyzing, setAnalyzing] = useState(false)

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const newPreviews = accepted.map((f) => ({ file: f, url: URL.createObjectURL(f) }))
      const all = [...previews, ...newPreviews]
      setPreviews(all)
      onFilesChange(all.map((p) => p.file))

      // Run AI analysis on first image
      const firstImage = accepted.find((f) => f.type.startsWith('image/'))
      if (firstImage) {
        setAnalyzing(true)
        try {
          // Use FileReader instead of ArrayBuffer to avoid stack overflow on large images
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
              const result = reader.result as string
              // Strip the data URL prefix: "data:image/jpeg;base64,"
              resolve(result.split(',')[1])
            }
            reader.onerror = reject
            reader.readAsDataURL(firstImage)
          })
          const analysis = await analyzeIssueImage(base64, firstImage.type)
          onAiAnalysis(analysis)
        } catch (err) {
          console.error('AI analysis failed:', err)
        } finally {
          setAnalyzing(false)
        }
      }
    },
    [previews, onFilesChange, onAiAnalysis]
  )

  const remove = (index: number) => {
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    onFilesChange(updated.map((p) => p.file))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 5,
  })

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive ? 'Drop files here' : 'Drag photos/videos or click to upload'}
        </p>
        <p className="text-xs text-gray-400 mt-1">Max 5 files</p>
      </div>

      {analyzing && (
        <div className="flex items-center gap-2 text-sm text-brand-600 bg-brand-50 rounded-lg px-4 py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          AI is analyzing your image...
        </div>
      )}

      {previews.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {previews.map((p, i) => (
            <div key={i} className="relative">
              {p.file.type.startsWith('image/') ? (
                <img src={p.url} className="w-20 h-20 object-cover rounded-lg" />
              ) : (
                <video src={p.url} className="w-20 h-20 object-cover rounded-lg" />
              )}
              <button
                onClick={() => remove(i)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
