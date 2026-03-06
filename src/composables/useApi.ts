import { ref } from 'vue'

interface IApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  headers?: Record<string, string>
  requireAuth?: boolean
}

export function useApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function request<T>(endpoint: string, options: IApiOptions = {}): Promise<T | null> {
    const { method = 'GET', body, headers = {}, requireAuth = false } = options

    isLoading.value = true
    error.value = null

    const finalHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    }

    if (requireAuth) {
      const token = localStorage.getItem('token')
      if (token) finalHeaders.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        error.value =
          (errorData as Record<string, string>).error ||
          (errorData as Record<string, string>).message ||
          `Request failed (${response.status})`
        return null
      }

      return (await response.json()) as T
    } catch {
      error.value = 'Network error. Please try again later.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { request, isLoading, error }
}
