import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
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
    <div className="flex flex-col items-center gap-14 py-8 px-12 w-full max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 w-full">
        <Link
          to="/client/dashboard"
          className="flex items-center justify-center gap-1 hover:text-title transition-colors flex-shrink-0"
        >
          <Home className="w-4 h-4 text-title" />
          <span className="text-sm font-medium text-title">Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-title flex-shrink-0" />
        <div className="flex items-center justify-left gap-2.5 flex-1 min-w-0">
          <span className="text-sm font-medium text-title">New Request</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Input Section */}
        <div className="flex flex-col gap-5 w-full">
          <h1 className="text-2xl font-medium text-[#0A0A0A] leading-[1.33em]">
            What do you need help with?
          </h1>
          <div className="flex flex-col gap-2 w-full">
            <Textarea
              placeholder="Describe your request..."
              value={requestDescription}
              onChange={(e) => setRequestDescription(e.target.value)}
              className="h-[120px] text-base font-normal text-[#71717A] placeholder:text-[#71717A] border border-[#E4E4E7] rounded-md bg-[#FAFAFA] px-3 py-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 resize-none"
            />
          </div>
        </div>

        {/* Frequently Used Requests */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2.5 w-full">
            <h2 className="text-base font-normal text-[#404040]">Frequently Used Requests</h2>
          </div>
          <div className="flex flex-col w-full">
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
        <button
          onClick={handleSubmit}
          disabled={!requestDescription.trim()}
          className="flex items-center justify-center gap-2 h-8 px-[15px] w-[150px] rounded-md bg-[#1677FF] text-white text-sm font-normal shadow-[0px_2px_0px_0px_rgba(5,145,255,0.1)] hover:bg-[#1677FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

