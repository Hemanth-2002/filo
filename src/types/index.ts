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

export type ChatRole = 'user' | 'AI'

export interface ChatMessage {
  id: string
  role: ChatRole
  message: string
  timestamp: string
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
