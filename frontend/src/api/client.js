import axios from 'axios'

// Get API URL from environment variable or use proxy in development
const API_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized
      // - Do NOT hard-redirect when the 401 came from auth endpoints (login/register/etc),
      //   otherwise the login page "flashes" and reloads too fast to show the error.
      const requestUrl = error.config?.url || ''
      const currentPath = window.location.pathname
      const isAuthEndpoint =
        requestUrl.includes('/api/auth/login') ||
        requestUrl.includes('/api/auth/register') ||
        requestUrl.includes('/api/auth/forgot-password') ||
        requestUrl.includes('/api/auth/reset-password') ||
        requestUrl.includes('/api/auth/verify-email') ||
        requestUrl.includes('/api/auth/me')
      const isAuthPage =
        currentPath === '/login' ||
        currentPath === '/register' ||
        currentPath === '/forgot-password' ||
        currentPath === '/reset-password' ||
        currentPath.startsWith('/auth/')

      if (!isAuthEndpoint && !isAuthPage) {
        // Clear token and redirect to login for protected pages
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    if (error.response?.status === 503 && error.response?.data?.code === 'MAINTENANCE_MODE') {
      // Check if user is admin - admins should not be affected by maintenance
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      const isAdmin = user?.role === 'admin'
      
      // Check if we're on admin routes or login/auth pages - these should NEVER be blocked
      const currentPath = window.location.pathname
      const isAdminRoute = currentPath.startsWith('/admin')
      const isAuthPage = currentPath === '/login' || 
                        currentPath === '/register' || 
                        currentPath === '/forgot-password' ||
                        currentPath === '/reset-password' ||
                        currentPath.startsWith('/auth/')
      
      // Check if the API call is to an excluded endpoint (auth, admin, site settings)
      const requestUrl = error.config?.url || ''
      const isExcludedEndpoint = requestUrl.includes('/api/auth/') || 
                                 requestUrl.includes('/api/admin/') ||
                                 requestUrl.includes('/api/site')
      
      // During maintenance we "lock" the public site:
      // - Admin routes remain normal
      // - Login page remains accessible
      // - Any other page should send the user to /login AND show the maintenance modal
      if (!isAdmin && !isAdminRoute && !isExcludedEndpoint) {
        const message = error.response?.data?.message || 'System is temporarily unavailable. Please try again later.'
        sessionStorage.setItem('maintenanceMessage', message)
        sessionStorage.setItem('showMaintenanceModal', 'true')

        // If already on login, just show modal (no redirect needed)
        if (currentPath !== '/login' && currentPath !== '/auth/login') {
          window.location.href = '/login'
        }
      }
      // If admin/on admin routes/calling excluded endpoints, just reject normally (don't redirect)
    }
    return Promise.reject(error)
  }
)

export default apiClient
