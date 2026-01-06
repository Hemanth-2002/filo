import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
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
      className={cn('cursor-pointer hover:shadow-md transition-shadow', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
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
        </div>

        <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">Due: {task.dueDate}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {task.documentsCompleted} of {task.documentsTotal} documents
            </span>
            <span className="font-medium">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

