import apiClient from './client'

/**
 * Create a new booking (requires auth + verified email)
 */
export const createBooking = async (bookingData) => {
  const response = await apiClient.post('/bookings', bookingData)
  return response.data
}

/**
 * Get user's own bookings (requires auth)
 */
export const getMyBookings = async () => {
  const response = await apiClient.get('/bookings/mine')
  return response.data
}

/**
 * Get a single booking by ID (requires auth)
 */
export const getBookingById = async (id) => {
  const response = await apiClient.get(`/bookings/${id}`)
  return response.data
}

/**
 * Cancel a booking (requires auth, user can only cancel their own)
 */
export const cancelBooking = async (id) => {
  const response = await apiClient.patch(`/bookings/${id}/cancel`)
  return response.data
}

// Admin-only endpoints (will be used in admin dashboard)
/**
 * Get all bookings (admin only)
 * @param {Object} params - Query parameters (status, serviceId, startDate, endDate, page, limit)
 */
export const getAllBookings = async (params = {}) => {
  const response = await apiClient.get('/bookings', { params })
  return response.data
}

/**
 * Admin: Approve booking
 */
export const approveBooking = async (id) => {
  const response = await apiClient.post(`/bookings/${id}/approve`)
  return response.data
}

/**
 * Admin: Reschedule booking
 */
export const rescheduleBooking = async (id, startAt, endAt, notes) => {
  const response = await apiClient.post(`/bookings/${id}/reschedule`, { startAt, endAt, notes })
  return response.data
}

/**
 * Admin: Cancel booking
 */
export const adminCancelBooking = async (id, reason) => {
  const response = await apiClient.post(`/bookings/${id}/cancel`, { reason })
  return response.data
}

/**
 * Admin: Complete booking
 */
export const completeBooking = async (id) => {
  const response = await apiClient.post(`/bookings/${id}/complete`)
  return response.data
}

/**
 * Update booking status (helper function that maps to correct endpoint)
 */
export const updateBookingStatus = async (id, status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return approveBooking(id)
    case 'cancelled':
      return adminCancelBooking(id, 'Cancelled by admin')
    case 'completed':
      return completeBooking(id)
    default:
      throw new Error(`Unknown status: ${status}`)
  }
}
