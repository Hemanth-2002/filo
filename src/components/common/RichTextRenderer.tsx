import { cn } from '@/lib/utils'

interface RichTextRendererProps {
  content: string
  className?: string
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  const renderInlineFormatting = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0
    let keyCounter = 0

    // Process all inline formatting patterns
    const patterns: Array<{
      regex: RegExp
      render: (match: RegExpMatchArray) => JSX.Element
    }> = [
      // Bold **text**
      {
        regex: /\*\*(.*?)\*\*/g,
        render: (match) => (
          <strong key={`bold-${keyCounter++}`} className="font-semibold">
            {match[1]}
          </strong>
        ),
      },
      // Italic _text_ (only underscore, not single asterisk to avoid conflict with bold)
      {
        regex: /_(.*?)_/g,
        render: (match) => (
          <em key={`italic-${keyCounter++}`} className="italic">
            {match[1]}
          </em>
        ),
      },
      // Inline code `code`
      {
        regex: /`([^`]+)`/g,
        render: (match) => (
          <code
            key={`code-${keyCounter++}`}
            className="bg-[#F4F4F5] text-[#0A0A0A] px-1.5 py-0.5 rounded text-sm font-mono"
          >
            {match[1]}
          </code>
        ),
      },
      // Links [text](url)
      {
        regex: /\[([^\]]+)\]\(([^)]+)\)/g,
        render: (match) => (
          <a
            key={`link-${keyCounter++}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1677FF] hover:underline"
          >
            {match[1]}
          </a>
        ),
      },
    ]

    // Find all matches and sort by position
    const allMatches: Array<{
      index: number
      length: number
      render: () => JSX.Element
    }> = []

    patterns.forEach((pattern) => {
      // Create a new regex for each pattern to avoid state issues
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags)
      const matches: Array<{
        fullMatch: string
        groups: string[]
        index: number
      }> = []
      let match
      
      // Collect all matches first
      while ((match = regex.exec(text)) !== null) {
        // Extract all capture groups - match[0] is the full match, match[1+] are groups
        const groups = Array.from(match)
        matches.push({
          fullMatch: match[0],
          groups: groups,
          index: match.index!,
        })
      }
      
      // Store matches with their render functions
      matches.forEach((matchData) => {
        // Create a match-like object for the render function
        // The array should have match[0] = full match, match[1+] = capture groups
        const matchArray: RegExpMatchArray = Object.assign([...matchData.groups], {
          index: matchData.index,
          input: text,
          groups: undefined,
        }) as RegExpMatchArray
        
        allMatches.push({
          index: matchData.index,
          length: matchData.fullMatch.length,
          render: () => pattern.render(matchArray),
        })
      })
    })

    // Sort matches by index
    allMatches.sort((a, b) => a.index - b.index)

    // Remove overlapping matches (keep the first one)
    const filteredMatches: typeof allMatches = []
    for (let i = 0; i < allMatches.length; i++) {
      const current = allMatches[i]
      const overlaps = filteredMatches.some(
        (existing) =>
          (current.index >= existing.index &&
            current.index < existing.index + existing.length) ||
          (existing.index >= current.index &&
            existing.index < current.index + current.length)
      )
      if (!overlaps) {
        filteredMatches.push(current)
      }
    }

    // Build parts array
    filteredMatches.forEach((match) => {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      parts.push(match.render())
      lastIndex = match.index + match.length
    })

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : [text]
  }

  const renderContent = () => {
    // Handle code blocks first (```code```)
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
    const codeBlocks: Array<{ fullMatch: string; lang: string; code: string; placeholder: string }> = []
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
      codeBlocks.push({
        fullMatch: match[0],
        lang: match[1] || '',
        code: match[2].trim(),
        placeholder,
      })
    }

    // Replace code blocks with placeholders (from end to start to preserve indices)
    let processedContent = content
    for (let i = codeBlocks.length - 1; i >= 0; i--) {
      processedContent = processedContent.replace(codeBlocks[i].fullMatch, codeBlocks[i].placeholder)
    }

    // Split by double newlines for paragraphs
    const sections = processedContent.split(/\n\n+/)

    return sections.map((section, sectionIndex) => {
      const trimmed = section.trim()
      if (!trimmed) return null

      // Check if it's a code block placeholder
      const codeBlock = codeBlocks.find((block) => trimmed.includes(block.placeholder))
      if (codeBlock) {
        return (
          <pre
            key={`codeblock-${sectionIndex}`}
            className="bg-[#F4F4F5] rounded-md p-4 overflow-x-auto mb-3 border border-[#E4E4E7]"
          >
            <code className="text-sm font-mono text-[#0A0A0A] whitespace-pre">
              {codeBlock.code}
            </code>
          </pre>
        )
      }

      // Check for headers (# Header)
      if (/^#{1,6}\s/.test(trimmed)) {
        const headerMatch = trimmed.match(/^(#{1,6})\s(.+)$/)
        if (headerMatch) {
          const level = headerMatch[1].length
          const text = headerMatch[2]
          const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements
          const sizeClasses = {
            1: 'text-2xl font-bold mb-2 mt-4',
            2: 'text-xl font-semibold mb-2 mt-3',
            3: 'text-lg font-semibold mb-2 mt-3',
            4: 'text-base font-semibold mb-1 mt-2',
            5: 'text-sm font-semibold mb-1 mt-2',
            6: 'text-sm font-semibold mb-1 mt-2',
          }
          return (
            <HeadingTag
              key={`header-${sectionIndex}`}
              className={sizeClasses[level as keyof typeof sizeClasses]}
            >
              {renderInlineFormatting(text)}
            </HeadingTag>
          )
        }
      }

      // Check if it's a numbered list
      if (/^\d+\.\s/.test(trimmed)) {
        const lines = trimmed.split('\n').filter((line) => line.trim())
        return (
          <ol
            key={`section-${sectionIndex}`}
            className="list-decimal list-inside space-y-1 ml-4 mb-3"
          >
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
      if (/^[-•*]\s/.test(trimmed)) {
        const lines = trimmed.split('\n').filter((line) => line.trim())
        return (
          <ul
            key={`section-${sectionIndex}`}
            className="list-disc list-inside space-y-1 ml-4 mb-3"
          >
            {lines.map((line, lineIndex) => {
              const cleanLine = line.replace(/^[-•*]\s/, '').trim()
              return (
                <li key={`line-${lineIndex}`} className="mb-1">
                  {renderInlineFormatting(cleanLine)}
                </li>
              )
            })}
          </ul>
        )
      }

      // Check for horizontal rule
      if (/^[-*_]{3,}$/.test(trimmed)) {
        return (
          <hr
            key={`hr-${sectionIndex}`}
            className="my-4 border-t border-[#E4E4E7]"
          />
        )
      }

      // Check if it's a table
      const lines = trimmed.split('\n').filter((line) => line.trim())
      if (lines.length >= 2 && lines[0].includes('|') && lines[1].includes('|')) {
        // Check if second line is a separator (contains --- or ===)
        const isSeparator = /^[\s|:-\s]+$/.test(lines[1])
        if (isSeparator) {
          const headerRow = lines[0]
          const dataRows = lines.slice(2)

          const parseRow = (row: string) => {
            return row
              .split('|')
              .map((cell) => cell.trim())
              .filter((cell) => cell.length > 0)
          }

          const headers = parseRow(headerRow)

          return (
            <div
              key={`table-${sectionIndex}`}
              className="overflow-x-auto mb-3 border border-[#E4E4E7] rounded-md"
            >
              <table className="min-w-full divide-y divide-[#E4E4E7]">
                <thead className="bg-[#F4F4F5]">
                  <tr>
                    {headers.map((header, idx) => (
                      <th
                        key={`header-${idx}`}
                        className="px-4 py-2 text-left text-sm font-semibold text-[#0A0A0A]"
                      >
                        {renderInlineFormatting(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E4E4E7]">
                  {dataRows.map((row, rowIdx) => {
                    const cells = parseRow(row)
                    return (
                      <tr key={`row-${rowIdx}`}>
                        {cells.map((cell, cellIdx) => (
                          <td
                            key={`cell-${rowIdx}-${cellIdx}`}
                            className="px-4 py-2 text-sm text-[#0A0A0A]"
                          >
                            {renderInlineFormatting(cell)}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        }
      }

      // Regular paragraph
      return (
        <p
          key={`section-${sectionIndex}`}
          className="mb-3 text-base font-normal leading-[1.5em]"
        >
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

