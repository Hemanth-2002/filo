import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FrequentlyUsedRequestProps {
  label: string
  onRemove?: () => void
  onClick?: () => void
}

export function FrequentlyUsedRequest({
  label,
  onRemove,
  onClick,
}: FrequentlyUsedRequestProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-2.5 px-2 py-3 bg-white w-full',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2.5 w-full">
        <span className="text-sm font-light text-[#71717A] flex-1">{label}</span>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="flex-shrink-0 p-0 hover:opacity-70 transition-opacity"
            aria-label={`Remove ${label}`}
          >
            <X className="w-4 h-4 text-[#71717A]" />
          </button>
        )}
      </div>
    </div>
  )
}

