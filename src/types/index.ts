export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'action-needed'

export type TaskType = 'GST' | 'ITR' | 'TDS' | 'Other'

export interface Task {
  id: string
  title: string
  type: TaskType
  status: TaskStatus
  dueDate: string
  progress: number // 0-100
  documentsCompleted: number
  documentsTotal: number
}

export interface Request {
  id: string
  name: string
  title: string
  description: string
  createdAt: string
  tasks?: Task[]
}

export interface User {
  name: string
  email: string
  avatar?: string
  companyName: string
  gstin: string
}

export type ChatRole = 'user' | 'assistant'
export type ChatRoleUI = 'user' | 'AI'

// DB format for messages in conversations table
export interface ChatMessageDB {
  role: ChatRole
  content: string
}

// UI format for displaying messages
export interface ChatMessage {
  id: string
  role: ChatRoleUI
  message: string
  timestamp: string
}

export interface Conversation {
  id: string
  user_id: string
  messages: ChatMessageDB[]
  created_at: string
  updated_at: string
}

export interface DocumentRequirement {
  id: string
  name: string
  description?: string
  format?: string
  required: boolean
  uploaded: boolean
  file?: File
}
