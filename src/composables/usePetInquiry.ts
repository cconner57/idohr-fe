import { reactive, ref } from 'vue'

import { API_ENDPOINTS } from '@/constants/api'
import type { IPet } from '@/models/common'

type TInquirySource = 'schedule_meet' | 'request_info'

interface IInquiryFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export function usePetInquiry(pet: IPet, source: TInquirySource) {
  const formData = reactive<IInquiryFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const apiError = ref<string | null>(null)

  async function submitInquiry(extraFields: Record<string, unknown> = {}) {
    apiError.value = null
    isSubmitting.value = true

    try {
      const response = await fetch(API_ENDPOINTS.PET_INQUIRY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fax_number: '',
          source,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          petId: pet.id,
          petName: pet.name,
          ...extraFields,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        apiError.value =
          (errorData as Record<string, string>).error ||
          'Something went wrong. Please try again.'
        return false
      }

      isSubmitted.value = true
      return true
    } catch {
      apiError.value = 'Network error. Please try again later.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { formData, isSubmitting, isSubmitted, apiError, submitInquiry }
}
