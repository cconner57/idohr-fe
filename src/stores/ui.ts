import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isLoading = ref(false)
  const isRestored = ref(false)

  // Admin UI State
  const adminState = ref({
    isSidebarOpen: false, // Default closed on mobile
    activeView: 'dashboard', // Current admin view (manual routing)
    version: 1, // Schema version
  })

  // Persistence Logic
  const STORAGE_KEY = 'admin_ui_state'
  const CURRENT_VERSION = 1

  let saved = null
  try {
    saved = localStorage.getItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to access localStorage', e)
  }

  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.version === CURRENT_VERSION) {
        adminState.value = parsed
      } else {
        // Version mismatch: Clear specific key only
        console.warn(`Admin UI state version mismatch (found ${parsed.version}, expected ${CURRENT_VERSION}). Resetting.`)
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.error('Failed to parse admin UI state', e)
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      isRestored.value = true
    }
  } else {
    isRestored.value = true
  }

  // Watch for changes (auto-save)
  watch(
    adminState,
    (state) => {
      // Ensure current version is always saved
      const payload = { ...state, version: CURRENT_VERSION }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },
    { deep: true },
  )

  function startLoading() {
    isLoading.value = true
  }

  function stopLoading() {
    isLoading.value = false
  }

  // Toast State
  const toast = ref<{
    show: boolean
    message: string
    type: 'success' | 'error' | 'info'
  }>({
    show: false,
    message: '',
    type: 'success',
  })

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    toast.value = {
      show: true,
      message,
      type,
    }
  }

  function hideToast() {
    toast.value.show = false
  }

  return {
    isLoading,
    isRestored,
    adminState,
    toast,
    startLoading,
    stopLoading,
    showToast,
    hideToast,
  }
})
