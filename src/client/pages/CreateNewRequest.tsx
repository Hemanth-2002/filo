import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FrequentlyUsedRequest } from '@/components/common/FrequentlyUsedRequest'
import { storageUtils } from '@/utils/storage'
import type { Request } from '@/types'

const defaultFrequentlyUsedRequests = [
  'File GST Return',
  'File Income Tax',
  'TDS Return',
]

export function CreateNewRequest() {
  const navigate = useNavigate()
  const [requestDescription, setRequestDescription] = useState('')
  const [frequentlyUsedRequests, setFrequentlyUsedRequests] = useState(
    defaultFrequentlyUsedRequests
  )

  const handleRemoveRequest = (index: number) => {
    setFrequentlyUsedRequests((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSelectRequest = (request: string) => {
    // When user clicks on a frequently used request, it could auto-fill or navigate
    // For now, we'll just set it as the description
    setRequestDescription(request)
  }

  const handleSubmit = () => {
    if (!requestDescription.trim()) return

    // Generate request ID
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Extract title from description (first line or first 50 chars)
    const title = requestDescription.split('\n')[0].substring(0, 50) || 'New Request'

    // Create request object
    const newRequest: Request = {
      id: requestId,
      name: `Request ${new Date().getTime()}`,
      title: title,
      description: requestDescription.trim(),
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage
    storageUtils.saveRequest(newRequest)

    // Navigate to request detail page
    navigate(`/client/request/${requestId}`)
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/client/dashboard" className="flex items-center gap-2 hover:text-foreground transition-colors">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">New Request</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">What do you need help with?</h1>
      </div>

      {/* Request Input */}
      <div className="space-y-2">
        <Textarea
          placeholder="Describe your request..."
          value={requestDescription}
          onChange={(e) => setRequestDescription(e.target.value)}
          className="min-h-[200px] text-base"
        />
      </div>

      {/* Frequently Used Requests */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Frequently Used Requests</h2>
        <div className="space-y-2 max-w-2xl">
          {frequentlyUsedRequests.map((request, index) => (
            <FrequentlyUsedRequest
              key={index}
              label={request}
              onRemove={() => handleRemoveRequest(index)}
              onClick={() => handleSelectRequest(request)}
            />
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!requestDescription.trim()}
          size="lg"
        >
          Submit Request
        </Button>
      </div>
    </div>
  )
}

