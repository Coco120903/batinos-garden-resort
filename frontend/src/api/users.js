import apiClient from './client'

export const getMe = async () => {
  const res = await apiClient.get('/users/me')
  return res.data
}

export const updateMe = async (payload) => {
  const res = await apiClient.put('/users/me', payload)
  return res.data
}

export const deleteAccount = async (confirmText) => {
  const res = await apiClient.delete('/users/me', { data: { confirmText } })
  return res.data
}

