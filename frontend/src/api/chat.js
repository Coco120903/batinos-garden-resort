import apiClient from './client'

export const getMyChatThread = async () => {
  const res = await apiClient.get('/chat/me')
  return res.data
}

export const getMyChatMessages = async (limit = 100) => {
  const res = await apiClient.get('/chat/me/messages', { params: { limit } })
  return res.data
}

export const sendMyChatMessage = async (text) => {
  const res = await apiClient.post('/chat/me/messages', { text })
  return res.data
}

// Admin
export const adminListChatThreads = async (params = {}) => {
  const res = await apiClient.get('/admin/chat/threads', { params })
  return res.data
}

export const adminGetThreadMessages = async (threadId, limit = 200) => {
  const res = await apiClient.get(`/admin/chat/threads/${threadId}/messages`, { params: { limit } })
  return res.data
}

export const adminSendThreadMessage = async (threadId, text) => {
  const res = await apiClient.post(`/admin/chat/threads/${threadId}/messages`, { text })
  return res.data
}

export const adminSetThreadStatus = async (threadId, status) => {
  const res = await apiClient.post(`/admin/chat/threads/${threadId}/status`, { status })
  return res.data
}

