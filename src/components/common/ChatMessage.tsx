import { format } from 'date-fns'
import { RichTextRenderer } from './RichTextRenderer'
import { cn } from '@/lib/utils'
import type { ChatMessage as ChatMessageType } from '@/types'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const timestamp = new Date(message.timestamp)

  return (
    <div className={cn('flex w-full mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[70%]', isUser ? 'order-2' : 'order-1')}>
        <div
          className={cn(
            'rounded-lg px-4 py-3',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
          ) : (
            <RichTextRenderer content={message.message} />
          )}
        </div>
        <p className={cn('text-xs text-muted-foreground mt-1', isUser ? 'text-right' : 'text-left')}>
          {format(timestamp, 'HH:mm')}
        </p>
      </div>
    </div>
  )
}

