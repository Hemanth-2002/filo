import type { Task, Request, User } from '@/types'

export const mockUser: User = {
  name: 'Shadcn',
  email: 'm@example.com',
  companyName: 'Sharma Enterprises',
  gstin: '27AABCS1234H1Z5',
}

export const mockRequests: Request[] = [
  { id: '1', name: 'Request 1' },
  { id: '2', name: 'Request 2' },
  { id: '3', name: 'Request 3' },
]

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'GSTR-3B April 2025',
    type: 'GST',
    status: 'action-needed',
    dueDate: 'May 20, 2025',
    progress: 40,
    documentsCompleted: 2,
    documentsTotal: 5,
  },
  {
    id: '2',
    title: 'ITR FY 2024-25',
    type: 'ITR',
    status: 'completed',
    dueDate: 'May 20, 2025',
    progress: 100,
    documentsCompleted: 5,
    documentsTotal: 5,
  },
  {
    id: '3',
    title: 'TDS Return Q4 2024',
    type: 'TDS',
    status: 'in-progress',
    dueDate: 'Jun 15, 2025',
    progress: 60,
    documentsCompleted: 3,
    documentsTotal: 5,
  },
]

