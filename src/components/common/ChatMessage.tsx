import { format } from 'date-fns'
import { Bot } from 'lucide-react'
import { RichTextRenderer } from './RichTextRenderer'
import { ChecklistCard } from './ChecklistCard'
import { cn } from '@/lib/utils'
import type { ChatMessage as ChatMessageType, Task, User } from '@/types'

interface ChatMessageProps {
  message: ChatMessageType
  checklistTask?: Task
  onChecklistClick?: () => void
  user?: User
}

export function ChatMessage({ message, checklistTask, onChecklistClick, user }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const timestamp = new Date(message.timestamp)
  const hasChecklist = !isUser && checklistTask && message.message.toLowerCase().includes('checklist')

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return 'U'
  }

  return (
    <div className={cn('flex w-full gap-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#030213] flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={cn('flex flex-col gap-1', isUser ? 'items-end max-w-[70%]' : 'items-start max-w-[70%]')}>
        {isUser ? (
          <div className="rounded-xl px-4 py-3 bg-[#1677FF] text-white">
            <p className="text-base font-normal leading-[1.5em] whitespace-pre-wrap text-right">{message.message}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-base font-normal leading-[1.5em] text-[#0A0A0A]">
              <RichTextRenderer content={message.message} />
            </div>
            {hasChecklist && checklistTask && (
              <div className="mt-4">
                <ChecklistCard task={checklistTask} onClick={onChecklistClick} />
              </div>
            )}
          </div>
        )}
        <p className="text-xs font-normal text-[#717182]">
          {format(timestamp, 'HH:mm')}
        </p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getUserInitials()
          )}
        </div>
      )}
    </div>
  )
}

