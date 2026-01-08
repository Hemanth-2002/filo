import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick?: () => void
  className?: string
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  className,
}: QuickActionCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow border border-[#E2E8F0] rounded-xl',
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-1 py-[18px] px-[17px]">
        <Icon className="w-6 h-6 text-[rgba(0,0,0,0.88)]" />
        <h3 className="text-base font-medium text-[rgba(0,0,0,0.88)]">{title}</h3>
        <p className="text-sm text-[rgba(0,0,0,0.65)]">{description}</p>
      </div>
    </Card>
  )
}

