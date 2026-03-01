import { useAuthStore } from '@/stores/auth'

export function setupFetchInterceptor() {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async (...args) => {
    const response = await originalFetch(...args)

    if (response.status === 401) {
      const authStore = useAuthStore()

      // Determine URL to avoid intercepting login/logout requests
      let url = ''
      const resource = args[0]
      if (typeof resource === 'string') {
        url = resource
      } else if (resource instanceof URL) {
        url = resource.toString()
      } else if (resource instanceof Request) {
        url = resource.url
      }

      // Skip login/logout to prevent loops
      if (url.includes('/login') || url.includes('/logout')) {
        return response
      }

      if (authStore.isAuthenticated) {
        // Session expired server-side: clear local state silently
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        authStore.user = null
      }
    }

    return response
  }
}
