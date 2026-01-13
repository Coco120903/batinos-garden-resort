import apiClient from './client'

export const getApprovedReviews = async (limit = 8) => {
  const res = await apiClient.get('/reviews', { params: { limit } })
  return res.data
}

export const submitReview = async ({ rating, comment }) => {
  const res = await apiClient.post('/reviews', { rating, comment })
  return res.data
}

// Admin
export const adminListReviews = async (status = 'pending') => {
  const res = await apiClient.get('/admin/reviews', { params: { status } })
  return res.data
}

export const adminApproveReview = async (id) => {
  const res = await apiClient.post(`/admin/reviews/${id}/approve`)
  return res.data
}

export const adminRejectReview = async (id) => {
  const res = await apiClient.delete(`/admin/reviews/${id}`)
  return res.data
}

