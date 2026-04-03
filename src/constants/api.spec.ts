import { describe, expect, it } from 'vitest'

import { normalizeApiBaseUrl } from './api'

describe('normalizeApiBaseUrl', () => {
  it('returns an empty string when the value is missing', () => {
    expect(normalizeApiBaseUrl(undefined)).toBe('')
  })

  it('removes a trailing hostname dot', () => {
    expect(normalizeApiBaseUrl('https://api.adoption-os.com.')).toBe('https://api.adoption-os.com')
  })

  it('removes trailing slashes and surrounding whitespace', () => {
    expect(normalizeApiBaseUrl('  https://api.adoption-os.com///  ')).toBe(
      'https://api.adoption-os.com',
    )
  })

  it('removes a trailing hostname dot before a trailing slash', () => {
    expect(normalizeApiBaseUrl('https://api.adoption-os.com./')).toBe('https://api.adoption-os.com')
  })
})
