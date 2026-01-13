import apiClient from './client'

/**
 * Get all active services (public endpoint)
 */
export const getServices = async () => {
  const response = await apiClient.get('/services')
  return response.data.services
}

/**
 * Get a single service by ID (public endpoint)
 */
export const getServiceById = async (id) => {
  const response = await apiClient.get(`/services/${id}`)
  return response.data
}
