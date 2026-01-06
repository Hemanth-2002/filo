import type { Request, ChatMessage } from '@/types'

const REQUESTS_KEY = 'ca_helper_requests'
const CHATS_KEY_PREFIX = 'ca_helper_chats_'

export const storageUtils = {
  // Request storage
  saveRequest: (request: Request): void => {
    const requests = storageUtils.getRequests()
    requests.push(request)
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  },

  getRequests: (): Request[] => {
    const data = localStorage.getItem(REQUESTS_KEY)
    return data ? JSON.parse(data) : []
  },

  getRequest: (id: string): Request | null => {
    const requests = storageUtils.getRequests()
    return requests.find((r) => r.id === id) || null
  },

  // Chat storage
  saveChatMessage: (requestId: string, message: ChatMessage): void => {
    const chats = storageUtils.getChatMessages(requestId)
    chats.push(message)
    localStorage.setItem(`${CHATS_KEY_PREFIX}${requestId}`, JSON.stringify(chats))
  },

  getChatMessages: (requestId: string): ChatMessage[] => {
    const data = localStorage.getItem(`${CHATS_KEY_PREFIX}${requestId}`)
    return data ? JSON.parse(data) : []
  },

  clearChatMessages: (requestId: string): void => {
    localStorage.removeItem(`${CHATS_KEY_PREFIX}${requestId}`)
  },
}

