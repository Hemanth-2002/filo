import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface ChecklistCardProps {
  task: Task
  onClick?: () => void
}

export function ChecklistCard({ task, onClick }: ChecklistCardProps) {
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

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px]',
        onClick && 'cursor-pointer hover:opacity-90 transition-opacity'
      )}
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-[10px] bg-[rgba(3,2,19,0.1)] flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-[#0A0A0A]" />
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <h3 className="text-base font-semibold text-[#0A0A0A]">{task.title} - Checklist</h3>
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
      </div>
    </div>
  )
}

