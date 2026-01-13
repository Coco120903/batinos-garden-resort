import apiClient from './client'

export const getSiteSettings = async () => {
  const res = await apiClient.get('/site')
  return res.data
}

// Admin
export const adminGetSiteSettings = async () => {
  const res = await apiClient.get('/admin/site')
  return res.data
}

export const adminUpdateSiteSettings = async (payload) => {
  const res = await apiClient.put('/admin/site', payload)
  return res.data
}

