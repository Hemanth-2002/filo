import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { Conversation } from '@/types'

interface ConversationCardProps {
  conversation: Conversation
  onClick?: () => void
}

export function ConversationCard({ conversation, onClick }: ConversationCardProps) {
  // Get the first user message as the title/preview
  const firstUserMessage = conversation.messages.find((msg) => msg.role === 'user')
  const preview = firstUserMessage?.content || 'New conversation'
  const messageCount = conversation.messages.length
  const lastMessage = conversation.messages[conversation.messages.length - 1]
  const lastMessageTime = conversation.updated_at

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow border border-[#E2E8F0] rounded-xl',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-[11px] p-[17px]">
        {/* Title and Preview */}
        <div className="flex flex-col gap-0">
          <h3 className="text-base font-semibold text-[#0A0A0A] py-[3px] line-clamp-2">
            {preview.length > 60 ? `${preview.substring(0, 60)}...` : preview}
          </h3>
          <div className="flex items-center justify-between py-[2px]">
            <span className="text-xs font-light text-[#71717A]">
              {messageCount} {messageCount === 1 ? 'message' : 'messages'}
            </span>
            <span className="text-xs font-normal text-[#71717A]">
              {lastMessageTime
                ? formatDistanceToNow(new Date(lastMessageTime), { addSuffix: true })
                : 'Just now'}
            </span>
          </div>
        </div>

        {/* Last Message Preview */}
        {lastMessage && (
          <div className="flex flex-col gap-2 border-t border-[#F1F5F9] pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[11.9px] font-normal text-[#71717A]">
                {lastMessage.role === 'user' ? 'You: ' : 'Assistant: '}
              </span>
              <span className="text-[11.9px] font-normal text-[#0A0A0A] line-clamp-1">
                {lastMessage.content.length > 80
                  ? `${lastMessage.content.substring(0, 80)}...`
                  : lastMessage.content}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

