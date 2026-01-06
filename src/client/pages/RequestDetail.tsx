import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Home, Send, Maximize2, PanelRightOpen } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { ChatMessage } from '@/components/common/ChatMessage'
import { ChecklistCard } from '@/components/common/ChecklistCard'
import { DocumentSidebar } from '@/components/common/DocumentSidebar'
import { storageUtils } from '@/utils/storage'
import { getMockAIResponse, initializeMockChat } from '@/utils/mockAI'
import { getDocumentRequirementsFromTask } from '@/utils/documentUtils'
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

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
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-white px-8 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/client/dashboard" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <span>/</span>
              <span className="text-foreground">Request for {request.title}</span>
            </div>
            <div className="flex items-center gap-2">
              {shouldShowSidebar && (
                <button
                  onClick={() => {
                    setIsSidebarOpen(!isSidebarOpen)
                    if (isSidebarOpen) {
                      setSidebarManuallyClosed(true)
                    } else {
                      setSidebarManuallyClosed(false)
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                >
                  <PanelRightOpen className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
              <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Maximize2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-8 py-6 bg-background">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Checklist Card - Show after AI mentions checklist */}
          {messages.some((m) => m.role === 'AI' && m.message.toLowerCase().includes('checklist')) && (
            <div className="mb-4">
              <ChecklistCard
                task={checklistTask}
                onClick={() => {
                  // TODO: Navigate to task detail page
                  console.log('Navigate to task:', checklistTask.id)
                }}
              />
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

        {/* Input Area */}
        <div className="border-t bg-white px-8 py-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                placeholder="Type your CA request here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-[60px] max-h-[120px] pr-12 resize-none"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
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

