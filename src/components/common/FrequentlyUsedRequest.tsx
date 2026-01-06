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
        'flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-background hover:bg-accent transition-colors w-full',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-2 p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0"
          aria-label={`Remove ${label}`}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}

