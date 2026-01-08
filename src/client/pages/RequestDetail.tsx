import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Send, ChevronRight } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { ChatMessage } from '@/components/common/ChatMessage'
import { DocumentSidebar } from '@/components/common/DocumentSidebar'
import { Sidebar } from '@/components/common/Sidebar'
import { storageUtils } from '@/utils/storage'
import { getMockAIResponse, initializeMockChat } from '@/utils/mockAI'
import { getDocumentRequirementsFromTask } from '@/utils/documentUtils'
import { mockUser } from '@/data/mockData'
import type { Request, ChatMessage as ChatMessageType, Task, DocumentRequirement } from '@/types'

export function RequestDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [request, setRequest] = useState<Request | null>(null)
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [sidebarManuallyClosed, setSidebarManuallyClosed] = useState(false)
  const [documents, setDocuments] = useState<DocumentRequirement[]>([])
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)
  const [requests, setRequests] = useState<Request[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load requests
    const loadedRequests = storageUtils.getRequests()
    const sortedRequests = loadedRequests.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setRequests(sortedRequests)
  }, [])

  useEffect(() => {
    if (!id) {
      navigate('/client/dashboard')
      return
    }

    // Load request
    const loadedRequest = storageUtils.getRequest(id)
    if (!loadedRequest) {
      navigate('/client/dashboard')
      return
    }
    setRequest(loadedRequest)

    // Initialize or load chat messages
    const existingMessages = storageUtils.getChatMessages(id)
    if (existingMessages.length === 0) {
      // Include user's initial message from request description
      const initialMessages = initializeMockChat(id, loadedRequest.description)
      setMessages(initialMessages)
      initialMessages.forEach((msg) => storageUtils.saveChatMessage(id, msg))
    } else {
      setMessages(existingMessages)
    }

    // Initialize documents
    const initialDocuments = getDocumentRequirementsFromTask(loadedRequest.title)
    setDocuments(initialDocuments)
  }, [id, navigate])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Open sidebar when AI mentions documents (only if not manually closed)
  useEffect(() => {
    const hasDocumentMention = messages.some(
      (m) =>
        m.role === 'AI' &&
        (m.message.toLowerCase().includes('upload') ||
          m.message.toLowerCase().includes('document') ||
          m.message.toLowerCase().includes('file'))
    )
    if (hasDocumentMention && !isSidebarOpen && !sidebarManuallyClosed) {
      setIsSidebarOpen(true)
    }
  }, [messages, isSidebarOpen, sidebarManuallyClosed])

  const handleDocumentUpload = (documentId: string, file: File) => {
    setDocuments((prev) => {
      const updated = prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, uploaded: true, file }
          : doc
      )
      // TODO: Save uploaded documents to storage
      return updated
    })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !id || isLoading) return

    const userMessage: ChatMessageType = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    // Add user message
    setMessages((prev) => [...prev, userMessage])
    storageUtils.saveChatMessage(id, userMessage)
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessageType = {
        id: `msg-${Date.now()}-ai`,
        role: 'AI',
        message: getMockAIResponse(id),
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiResponse])
      storageUtils.saveChatMessage(id, aiResponse)
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!request) {
    return <div>Loading...</div>
  }

  // Create a task for the checklist
  const checklistTask: Task = {
    id: `task-${request.id}`,
    title: request.title,
    type: 'GST',
    status: 'action-needed',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    progress: Math.round((documents.filter((d) => d.uploaded).length / documents.length) * 100),
    documentsCompleted: documents.filter((d) => d.uploaded).length,
    documentsTotal: documents.length,
  }

  const shouldShowSidebar = messages.some(
    (m) =>
      m.role === 'AI' &&
      (m.message.toLowerCase().includes('upload') ||
        m.message.toLowerCase().includes('document') ||
        m.message.toLowerCase().includes('file'))
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        user={mockUser}
        requests={requests}
        collapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="z-10 sticky top-0 h-16 border-b border-gray-200 bg-white px-12 flex items-center flex-shrink-0">
          <div className="flex items-center gap-1.5 w-full max-w-5xl mx-auto">
            <Link
              to="/client/dashboard"
              className="flex items-center justify-center gap-2.5 hover:text-foreground transition-colors flex-shrink-0"
            >
              <span className="text-sm font-normal text-[#71717A]">Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#71717A] flex-shrink-0" />
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="text-sm font-normal text-[#0A0A0A] truncate">Request for {request.title}</span>
            </div>
            
          </div>
        </header>

        {/* Chat Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto bg-background">
          <div className="flex flex-col justify-end min-h-full gap-9 px-12 py-8">
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-9">
              {messages.map((message) => {
                const hasChecklist = message.role === 'AI' && message.message.toLowerCase().includes('checklist')
                return (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    checklistTask={hasChecklist ? checklistTask : undefined}
                    onChecklistClick={() => {
                      setIsSidebarOpen(true)
                      setSidebarManuallyClosed(false)
                    }}
                    user={mockUser}
                  />
                )
              })}

              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-[#ECECF0] rounded-2xl px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#717182] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#717182] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-[#717182] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="z-10 sticky bottom-0 bg-white border-t border-gray-200 flex flex-col items-start py-3 px-12 flex-shrink-0">
          <div className="flex gap-3 h-16 items-end relative w-full max-w-5xl mx-auto">
            <div className="basis-0 bg-[#F3F3F5] border border-[rgba(0,0,0,0.1)] rounded-[14px] grow h-[52px] min-h-px min-w-px relative shrink-0">
              <Textarea
                placeholder="Type your CA request here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="h-full px-[16px] py-[12px] rounded-[14px] bg-transparent border-0 text-base font-normal text-[rgba(10,10,10,0.5)] placeholder:text-[rgba(10,10,10,0.5)] resize-none focus:outline-none focus:ring-0"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-[#030213] opacity-40 rounded-[14px] shrink-0 w-[48px] h-[48px] flex items-center justify-center hover:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Sidebar */}
      {shouldShowSidebar && isSidebarOpen && (
        <DocumentSidebar
          task={checklistTask}
          documents={documents}
          onClose={() => {
            setIsSidebarOpen(false)
            setSidebarManuallyClosed(true)
          }}
          onUpload={handleDocumentUpload}
        />
      )}
    </div>
  )
}

