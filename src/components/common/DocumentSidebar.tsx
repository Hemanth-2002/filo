import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
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

  const getStatusConfig = (status: Task['status']) => {
    switch (status) {
      case 'action-needed':
        return {
          text: 'Action needed',
          bgColor: 'bg-[#FFFBE6]',
          textColor: 'text-[#D48806]',
        }
      case 'completed':
        return {
          text: 'Completed',
          bgColor: 'bg-[#F6FFED]',
          textColor: 'text-[#389E0D]',
        }
      case 'in-progress':
        return {
          text: 'In Progress',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
        }
      default:
        return {
          text: 'Pending',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
        }
    }
  }

  const statusConfig = getStatusConfig(task.status)
  const uploadedCount = documents.filter((d) => d.uploaded).length
  const totalDocuments = documents.length
  const progress = totalDocuments > 0 ? (uploadedCount / totalDocuments) * 100 : 0
  const totalSteps = 5
  const completedSteps = Math.round((progress / 100) * totalSteps)

  return (
    <div className="w-96 h-full bg-[rgba(244,244,245,0.8)] flex flex-col">
      <div className="flex flex-col gap-3 px-6 py-8">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-[#0A0A0A]">Action Needed</h3>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity flex-shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 text-[#404040]" />
          </button>
        </div>
        {/* Task Card */}
        <div className="flex flex-col gap-[11px] p-[17px] bg-white border border-[#E2E8F0] rounded-xl">
          {/* Tags */}
          <div className="flex items-center gap-2">
            <span className="px-[7px] py-0 h-[22px] rounded bg-[#E6F4FF] text-[#0958D9] text-xs font-normal flex items-center justify-center">
              {task.type}
            </span>
            <span
              className={cn(
                'px-[7px] py-0 h-[22px] rounded text-xs font-normal flex items-center justify-center',
                statusConfig.bgColor,
                statusConfig.textColor
              )}
            >
              {statusConfig.text}
            </span>
          </div>

          {/* Title and Due Date */}
          <div className="flex flex-col gap-0">
            <h2 className="text-base font-semibold text-[#0A0A0A] py-[3px]">{task.title}</h2>
            <div className="flex items-center py-[2px]">
              <span className="text-xs font-light text-[#71717A]">Due: </span>
              <span className="text-xs font-normal text-[#71717A]">{task.dueDate}</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="flex flex-col gap-2 border-t border-[#F1F5F9] pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11.9px] font-normal text-[#71717A]">Progress</span>
              <span className="text-[11.9px] font-medium text-[#0A0A0A]">
                {uploadedCount} of {totalDocuments} documents
              </span>
            </div>
            <div className="flex items-center gap-1">
              {/* Progress Steps */}
              <div className="flex items-center gap-1 flex-1">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-2 flex-1 rounded',
                      index < completedSteps
                        ? 'bg-[#52C41A]'
                        : 'bg-[rgba(0,0,0,0.06)]'
                    )}
                  />
                ))}
              </div>
              {/* Percentage */}
              <div className="pl-2">
                <span className="text-sm font-normal text-[rgba(0,0,0,0.88)]">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-medium text-[#0A0A0A]">Documents to Upload</h3>
          <div className="flex flex-col gap-[1px] p-4 bg-white border border-[#E2E8F0] rounded-xl">
            {/* Header */}
            <div className="flex flex-col gap-0.5 px-4 py-3 border-b border-[#F1F5F9]">
              <p className="text-base font-medium text-[#0F172A]">
                Please upload the following documents for April 2025:
              </p>
            </div>

            {/* Documents List */}
            <div className="flex flex-col gap-[1px]">
              {documents.map((document, index) => (
                <div
                  key={document.id}
                  className={cn(
                    'flex flex-col gap-2.5 px-4 py-3',
                    index < documents.length - 1 && 'border-b border-[#F1F5F9]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={document.uploaded}
                      readOnly
                      className="w-4 h-4 rounded border-[#D9D9D9]"
                    />
                    <label className="text-sm font-normal text-[rgba(0,0,0,0.88)] flex-1">
                      {document.name}
                    </label>
                    <input
                      ref={(el) => {
                        fileInputRefs.current[document.id] = el
                      }}
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                      onChange={(e) => handleFileSelect(document.id, e)}
                      className="hidden"
                    />
                    <button
                      onClick={() => handleUploadClick(document.id)}
                      disabled={document.uploaded}
                      className="flex items-center justify-center gap-2 h-8 px-[15px] rounded-md bg-[#1677FF] text-white text-sm font-normal shadow-[0px_2px_0px_0px_rgba(5,145,255,0.1)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

