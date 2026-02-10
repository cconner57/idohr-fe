import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

export function setupFetchInterceptor() {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async (...args) => {
    const response = await originalFetch(...args)

    if (response.status === 401) {
      const authStore = useAuthStore()
      const uiStore = useUIStore()

      // Determine URL
      let url = ''
      const resource = args[0]
      if (typeof resource === 'string') {
        url = resource
      } else if (resource instanceof URL) {
        url = resource.toString()
      } else if (resource instanceof Request) {
        url = resource.url
      }

      // Skip if login or logout request to prevent loops or false positives
      if (url.includes('/login') || url.includes('/logout')) {
        return response
      }

      if (authStore.isAuthenticated) {
        console.log('Session expired (401), logging out...')
        uiStore.showToast('Session expired. Please login again.', 'error')
        await authStore.logout()
      }
    }

    return response
  }
}
