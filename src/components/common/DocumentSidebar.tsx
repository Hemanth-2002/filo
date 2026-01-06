import { useState, useRef } from 'react'
import { X, Upload, Check, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { DocumentRequirement, Task } from '@/types'

interface DocumentSidebarProps {
  task: Task
  documents: DocumentRequirement[]
  onClose: () => void
  onUpload: (documentId: string, file: File) => void
}

export function DocumentSidebar({
  task,
  documents,
  onClose,
  onUpload,
}: DocumentSidebarProps) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleFileSelect = (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(documentId, file)
    }
  }

  const handleUploadClick = (documentId: string) => {
    fileInputRefs.current[documentId]?.click()
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'action-needed':
        return 'bg-orange-100 text-orange-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: Task['type']) => {
    return 'bg-blue-100 text-blue-800'
  }

  const uploadedCount = documents.filter((d) => d.uploaded).length
  const totalDocuments = documents.length
  const progress = totalDocuments > 0 ? (uploadedCount / totalDocuments) * 100 : 0

  return (
    <div className="w-96 h-full bg-white border-l border-border flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={cn('px-2 py-1 rounded text-xs font-medium', getTypeColor(task.type))}>
              {task.type}
            </span>
            <span className={cn('px-2 py-1 rounded text-xs font-medium', getStatusColor(task.status))}>
              {task.status === 'action-needed'
                ? 'Action needed'
                : task.status === 'in-progress'
                ? 'In Progress'
                : 'Completed'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
        <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
      </div>

      {/* Progress */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            {uploadedCount} of {documents.length} documents
          </span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-sm font-semibold mb-4">
          Please upload the following documents for April 2025:
        </h3>
        <div className="space-y-4">
          {documents.map((document) => (
            <div key={document.id} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <input
                    type="checkbox"
                    checked={document.uploaded}
                    readOnly
                    className="mt-1 w-4 h-4 rounded border-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <label className="text-sm font-medium block">{document.name}</label>
                    {document.description && (
                      <p className="text-xs text-muted-foreground mt-1">{document.description}</p>
                    )}
                    {document.format && (
                      <p className="text-xs text-muted-foreground mt-1">Format: {document.format}</p>
                    )}
                    {document.uploaded && document.file && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="truncate">{document.file.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <input
                  ref={(el) => {
                    fileInputRefs.current[document.id] = el
                  }}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                  onChange={(e) => handleFileSelect(document.id, e)}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUploadClick(document.id)}
                  disabled={document.uploaded}
                  className="flex-shrink-0"
                >
                  {document.uploaded ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Uploaded
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

