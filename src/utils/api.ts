const configuredPublicOrgId = import.meta.env.VITE_PUBLIC_ORG_ID?.trim() ?? ''

export const PUBLIC_ORG_ID = configuredPublicOrgId || 'idohr'

const INTERNAL_URL_BASE = 'https://idohr.local'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isAbsoluteUrl = (value: string) => {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)
}

export const withPublicOrgId = (endpoint: string, orgId = PUBLIC_ORG_ID) => {
  const url = new URL(endpoint, INTERNAL_URL_BASE)

  if (!url.searchParams.get('orgId')) {
    url.searchParams.set('orgId', orgId)
  }

  if (isAbsoluteUrl(endpoint)) {
    return url.toString()
  }

  return `${url.pathname}${url.search}${url.hash}`
}

export const parseApiErrorMessage = (payload: unknown, fallback: string) => {
  if (!isRecord(payload)) {
    return fallback
  }

  if (typeof payload.userMessage === 'string' && payload.userMessage.trim()) {
    return payload.userMessage
  }

  if (isRecord(payload.error)) {
    const nestedMessage = payload.error.message

    if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
      return nestedMessage
    }
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }

  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error
  }

  return fallback
}

export const getApiErrorMessage = async (response: Response, fallback: string) => {
  const payload = await response.json().catch(() => null)

  return parseApiErrorMessage(payload, fallback)
}
