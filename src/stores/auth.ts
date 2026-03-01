import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { API_ENDPOINTS } from '../constants/api'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  /*
    User State (Persisted)
    Ref: https://pinia.vuejs.org/core-concepts/state.html
  */
  const storedUser = localStorage.getItem('user')
  const user = ref<{
    ID: number
    Name: string
    Email: string
    Role: string
  } | null>(storedUser ? JSON.parse(storedUser) : null)

  const isAuthenticated = computed(() => !!user.value)

  const isCheckingAuth = ref(false)

  const checkAuth = async () => {
    isCheckingAuth.value = true
    try {
      const response = await fetch(API_ENDPOINTS.USERS_ME, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        if (data?.data) {
          user.value = data.data
          localStorage.setItem('user', JSON.stringify(data.data))
        }
      } else {
        user.value = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Check auth error:', error)
      user.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } finally {
      isCheckingAuth.value = false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token)
        }

        if (data.user) {
          user.value = data.user
          localStorage.setItem('user', JSON.stringify(data.user))
        } else {
          await checkAuth()
        }
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      user.value = null
      router.push('/login')
    }
  }

  const initialized = ref(false)
  const initialize = async () => {
    if (initialized.value) return

    // Skip API call for guests — prevents 401 noise on public pages
    if (!user.value) {
      initialized.value = true
      return
    }

    await checkAuth()
    initialized.value = true
  }

  return {
    user,
    isAuthenticated,
    isCheckingAuth,
    login,
    checkAuth,
    logout,
    initialize,
    initialized,
    updateProfile: async (data: { name: string; email: string; password?: string }) => {
      const res = await fetch(API_ENDPOINTS.USERS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update')
      const result = await res.json()
      if (result.user) {
        user.value = result.user
        localStorage.setItem('user', JSON.stringify(result.user))
      }
      return result
    },
  }
})
