import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface ChecklistCardProps {
  task: Task
  onClick?: () => void
}

export function ChecklistCard({ task, onClick }: ChecklistCardProps) {
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

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex flex-wrap gap-2">
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
            <h3 className="text-base font-semibold ml-2">{task.title}</h3>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  )
}

