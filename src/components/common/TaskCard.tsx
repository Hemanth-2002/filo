import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
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
  const totalSteps = 5
  const completedSteps = Math.round((task.progress / 100) * totalSteps)

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow border border-[#E2E8F0] rounded-xl',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-[11px] p-[17px]">
        {/* Tags Row */}
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
          <h3 className="text-base font-semibold text-[#0A0A0A] py-[3px]">{task.title}</h3>
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
              {task.documentsCompleted} of {task.documentsTotal} documents
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
              <span className="text-sm font-normal text-[rgba(0,0,0,0.88)]">{task.progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

