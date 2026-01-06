import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Request } from '@/types'

interface RequestCardProps {
  request: Request
  onClick?: () => void
}

export function RequestCard({ request, onClick }: RequestCardProps) {
  const createdAt = new Date(request.createdAt)
  const isRecent = Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold mb-1 truncate">{request.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {request.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{format(createdAt, 'MMM d, yyyy')}</span>
              {isRecent && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                  New
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

