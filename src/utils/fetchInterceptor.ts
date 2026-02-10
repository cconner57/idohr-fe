

export function setupFetchInterceptor() {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async (...args) => {
    const response = await originalFetch(...args)

    if (response.status === 401) {
      console.warn('API returned 401 Unauthorized. This is expected if the user is not logged in.')
    }

    return response
  }
}
