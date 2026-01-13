import apiClient from './client'

export const adminListMedia = async (params = {}) => {
  const res = await apiClient.get('/admin/media', { params })
  return res.data
}

export const adminCreateMedia = async ({ url, title, tags }) => {
  const res = await apiClient.post('/admin/media', { url, title, tags })
  return res.data
}

export const adminDeleteMedia = async (id) => {
  const res = await apiClient.delete(`/admin/media/${id}`)
  return res.data
}

