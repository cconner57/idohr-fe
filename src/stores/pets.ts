import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'

import { API_ENDPOINTS } from '../constants/api'
import type { IPet } from '../models/common'

export const usePetStore = defineStore('pets', () => {
  const currentPets = ref<IPet[]>([])
  const adminPets = ref<IPet[]>([])
  const lastFetched = ref<number>(0)
  const lastAdminFetched = ref<number>(0)
  const lastAdminParams = ref<string>('')
  const isFetching = ref(false)

  const selectedPet = ref<{
    id?: string
    name?: string
    petName?: string
    species: 'cat' | 'dog'
  } | null>(null)

  const STORAGE_KEY = 'adoption_pet'
  const CACHE_DURATION = 5 * 60 * 1000

  const adoptedPets = ref<IPet[]>([])

  const error = ref<string | null>(null)

  const fetchPets = async (forceRefresh = false) => {
    const isFresh = Date.now() - lastFetched.value < CACHE_DURATION
    if (currentPets.value.length > 0 && isFresh && !forceRefresh) {
      return
    }

    isFetching.value = true
    error.value = null
    try {
      const response = await fetch(`${API_ENDPOINTS.PETS}?status=available&sort=age`)
      if (!response.ok) throw new Error('Failed to fetch pets')

      const data = await response.json()
      currentPets.value = Array.isArray(data) ? data : data.data || []
      lastFetched.value = Date.now()
    } catch (err: unknown) {
      console.error('Error fetching pets:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch pets'
    } finally {
      isFetching.value = false
    }
  }

  const fetchAdminPets = async (params: URLSearchParams, forceRefresh = false) => {
    const paramsString = params.toString()
    const isFresh = Date.now() - lastAdminFetched.value < CACHE_DURATION
    const isSameParams = lastAdminParams.value === paramsString

    if (adminPets.value.length > 0 && isFresh && isSameParams && !forceRefresh) {
      console.log('Using cached admin pets')
      return
    }

    isFetching.value = true
    try {
      const response = await fetch(`${API_ENDPOINTS.PETS}?${paramsString}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch admin pets')
      const data = await response.json()
      adminPets.value = Array.isArray(data) ? data : data.data || []
      lastAdminFetched.value = Date.now()
      lastAdminParams.value = paramsString
    } catch (err) {
      console.error('Error fetching admin pets:', err)
      throw err
    } finally {
      isFetching.value = false
    }
  }

  const fetchAdoptedPets = async () => {
    isFetching.value = true
    try {
      // Fetch specifically adopted pets, reasonable limit (e.g. 1000 to cover full year)
      const response = await fetch(`${API_ENDPOINTS.PETS}?status=adopted&limit=1000`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch adopted pets')
      const data = await response.json()
      adoptedPets.value = Array.isArray(data) ? data : data.data || []
    } catch (err) {
      console.error('Error fetching adopted pets:', err)
      throw err
    } finally {
      isFetching.value = false
    }
  }

  const updatePet = async (pet: IPet) => {
    // Optimistic update
    const updateInList = (list: Ref<IPet[]>) => {
      const idx = list.value.findIndex((p: IPet) => p.id === pet.id)
      if (idx !== -1) {
        list.value[idx] = { ...pet }
      }
    }

    updateInList(currentPets)
    updateInList(adminPets)
    updateInList(adoptedPets)

    // Sanitize payload: Remove read-only fields that the backend does not expect
    // Note: structuredClone fails with Vue proxy objects, so we use JSON.parse/stringify
    const payload: Partial<IPet> = JSON.parse(JSON.stringify(pet))
    delete payload.id
    delete payload.createdAt
    delete payload.updatedAt

    try {
      const response = await fetch(`${API_ENDPOINTS.PETS}/${pet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to update pet')

      // Update successful, maybe fetch fresh data or just leave optimistic?
      // Leaving optimistic is fine.
    } catch (err) {
      console.error('Error updating pet:', err)
      // Revert or fetch?
      await fetchPets(true) // Revert by fetching fresh
      throw err
    }
  }

  const initFromSession = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        selectedPet.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse selected pet from session storage', e)
        sessionStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  const selectPet = (pet: {
    id?: string
    name?: string
    petName?: string
    species: 'cat' | 'dog'
  }) => {
    selectedPet.value = pet
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPet.value))
  }

  const clearSelectedPet = () => {
    selectedPet.value = null
    sessionStorage.removeItem(STORAGE_KEY)
  }

  initFromSession()

  return {
    currentPets,
    adminPets,
    adoptedPets,
    selectedPet,
    isFetching,

    fetchPets,
    fetchAdminPets,
    fetchAdoptedPets,
    updatePet,
    selectPet,
    clearSelectedPet,
    initFromSession,
    error,
  }
})
