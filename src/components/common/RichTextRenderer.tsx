import { cn } from '@/lib/utils'

interface RichTextRendererProps {
  content: string
  className?: string
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  const renderInlineFormatting = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0
    const boldRegex = /\*\*(.*?)\*\*/g
    let match
    let keyCounter = 0

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      // Add bold text
      parts.push(
        <strong key={`bold-${keyCounter++}`} className="font-semibold">
          {match[1]}
        </strong>
      )
      lastIndex = match.index + match[0].length
    }
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : [text]
  }

  const renderContent = () => {
    // Split by double newlines for paragraphs
    const sections = content.split(/\n\n+/)
    
    return sections.map((section, sectionIndex) => {
      const trimmed = section.trim()
      if (!trimmed) return null

      // Check if it's a numbered list
      if (/^\d+\.\s/.test(trimmed)) {
        const lines = trimmed.split('\n').filter(line => line.trim())
        return (
          <ol key={`section-${sectionIndex}`} className="list-decimal list-inside space-y-1 ml-4 mb-3">
            {lines.map((line, lineIndex) => {
              const cleanLine = line.replace(/^\d+\.\s/, '').trim()
              return (
                <li key={`line-${lineIndex}`} className="mb-1">
                  {renderInlineFormatting(cleanLine)}
                </li>
              )
            })}
          </ol>
        )
      }

      // Check if it's a bullet list
      if (/^[-•]\s/.test(trimmed)) {
        const lines = trimmed.split('\n').filter(line => line.trim())
        return (
          <ul key={`section-${sectionIndex}`} className="list-disc list-inside space-y-1 ml-4 mb-3">
            {lines.map((line, lineIndex) => {
              const cleanLine = line.replace(/^[-•]\s/, '').trim()
              return (
                <li key={`line-${lineIndex}`} className="mb-1">
                  {renderInlineFormatting(cleanLine)}
                </li>
              )
            })}
          </ul>
        )
      }

      // Regular paragraph
      return (
        <p key={`section-${sectionIndex}`} className="mb-3 text-base font-normal leading-[1.5em]">
          {renderInlineFormatting(trimmed)}
        </p>
      )
    })
  }

  return (
    <div className={cn('text-base font-normal leading-[1.5em]', className)}>
      {renderContent()}
    </div>
  )
}

