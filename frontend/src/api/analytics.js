import apiClient from './client'

/**
 * Get dashboard analytics (admin only)
 */
export const getDashboardStats = async (startDate, endDate) => {
  const params = {}
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate
  
  const response = await apiClient.get('/analytics/dashboard', { params })
  return response.data
}

/**
 * Get booking statistics for date range (admin only)
 */
export const getBookingStats = async (startDate, endDate) => {
  const response = await apiClient.get('/analytics/bookings', {
    params: { startDate, endDate }
  })
  return response.data
}
