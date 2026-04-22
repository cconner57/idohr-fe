import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { MOCK_NEWS } from '@/constants/mockNews'
import type { INewsItem } from '@/models/news'

export const useNewsStore = defineStore('news', () => {
  const items = ref<INewsItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const sortedItems = computed(() => {
    return [...items.value].sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
  })

  const fetchNews = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Hidden page uses mock data until adoption-os public news API is ready.
      items.value = MOCK_NEWS
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load news'
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    isLoading,
    error,
    sortedItems,
    fetchNews,
  }
})
