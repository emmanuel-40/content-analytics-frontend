import { FileUp, UploadCloud } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { useUploadDocument } from '@/hooks/useDocuments'
import { ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'

export function UploadCard({ compact = false }: { compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [description, setDescription] = useState('')
  const upload = useUploadDocument()

  const pick = (file: File | undefined) => {
    if (!file) return
    upload.mutate(
      { file, description: description || undefined },
      {
        onSuccess: (document) => {
          toast.success(`Uploaded ${document.fileName}. Analysis started`)
          setDescription('')
        },
        onError: (error) =>
          toast.error(error instanceof ApiError ? error.message : 'Upload failed'),
      },
    )
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    pick(event.dataTransfer.files?.[0])
  }

  return (
    <div
      onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        'relative rounded-2xl border border-dashed p-7 text-center transition',
        dragging ? 'border-signal-400 bg-signal-400/5' : 'border-ink-600 bg-ink-900/40',
      )}
    >
      <input
        ref={input}
        type="file"
        accept=".pdf,.txt,.docx,.pptx"
        className="hidden"
        onChange={(event) => pick(event.target.files?.[0])}
      />
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-signal-400/10 text-signal-400">
        <UploadCloud className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-100">
        {compact ? 'Drop a document to analyse' : 'Upload a document'}
      </h3>
      <p className="mt-1 text-sm text-zinc-500">
        PDF, TXT, DOCX or PPTX · up to 50 MB · costs 1 credit
      </p>
      <Button
        type="button"
        className="mt-5"
        loading={upload.isPending}
        onClick={() => input.current?.click()}
      >
        <FileUp className="h-4 w-4" /> Choose file
      </Button>
      {!compact && (
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={1000}
          placeholder="Optional description…"
          className="field mx-auto mt-5 max-w-md text-center"
        />
      )}
      {upload.isPending && <p className="mt-3 text-xs text-zinc-500">Uploading…</p>}
    </div>
  )
}
