import apiClient from './client'

/**
 * Register a new user
 */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData)
  return response.data
}

/**
 * Login user
 */
export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials)
  // Store token and user data
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
}

/**
 * Get current user (requires auth)
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me')
  return response.data
}

/**
 * Verify email with token
 */
export const verifyEmail = async (token, email) => {
  const response = await apiClient.get('/auth/verify-email', {
    params: { token, email },
  })
  return response.data
}

/**
 * Logout (clear local storage)
 */
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

/**
 * Get stored user data
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * Request password reset
 */
export const forgotPassword = async (email) => {
  const response = await apiClient.post('/auth/forgot-password', { email })
  return response.data
}

/**
 * Reset password with token
 */
export const resetPassword = async ({ token, email, password }) => {
  const response = await apiClient.post('/auth/reset-password', { token, email, password })
  return response.data
}
