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

      if (authStore.isAuthenticated && !authStore.isCheckingAuth) {
        console.log('Session expired (401), clearing auth...')

        // Clear auth state but don't force redirect unless we are in a protected route
        const currentPath = window.location.pathname
        const isProtectedRoute = currentPath.startsWith('/admin')

        if (isProtectedRoute) {
          uiStore.showToast('Session expired. Please login again.', 'error')
          await authStore.logout() // This redirects to /login
        } else {
          // Just clear local state silently for public pages
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          authStore.user = null
        }
      }
    }

    return response
  }
}
