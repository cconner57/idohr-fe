<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AdoptDetail from '@/components/adopt/adopt-view/AdoptDetail.vue'
import AdoptSummary from '@/components/adopt/adopt-view/AdoptSummary.vue'
import AdoptPageHeader from '@/components/adopt/AdoptPageHeader.vue'
import FilterPanel from '@/components/adopt/FilterPanel.vue'
import GeneralApplicationCTA from '@/components/adopt/GeneralApplicationCTA.vue'
import Spinner from '@/components/common/ui/Spinner.vue'
import type { IPet } from '@/models/common'
import { useAdoptionStore } from '@/stores/adoption'
import { usePetStore } from '@/stores/pets'
import { vibrate } from '@/utils/haptics'

const props = defineProps<{ id?: string }>()
const route = useRoute()
const router = useRouter()
const store = usePetStore()
const adoptionStore = useAdoptionStore()
const { currentPets, isFetching } = storeToRefs(store)

const id = computed(() => props.id ?? (route.params.id as string | undefined))
const detailPet = ref<IPet | null>(null)
const isFilterPanelOpen = ref(false)

const activeFilter = ref('All')
const advancedFilters = ref({
  age: [] as string[],
  size: [] as string[],
  sex: '',
  goodWith: [] as string[],
})

const applyAdvancedFilters = (newFilters: typeof advancedFilters.value) => {
  advancedFilters.value = newFilters
  isFilterPanelOpen.value = false
}

const clearFilters = () => {
  advancedFilters.value = {
    age: [],
    size: [],
    sex: '',
    goodWith: [],
  }
}

const resetAllFilters = () => {
  activeFilter.value = 'All'
  clearFilters()
  isFilterPanelOpen.value = false
}

onMounted(() => {
  if (!id.value) {
    store.fetchPetsList()
  }
})

const filteredPets = computed(() => {
  let result = currentPets.value

  if (activeFilter.value !== 'All') {
    result = result.filter(
      (p: IPet) => p.species.toLowerCase() === activeFilter.value.toLowerCase(),
    )
  }

  const { age, size, sex, goodWith } = advancedFilters.value

  if (age.length > 0) {
    result = result.filter((p: IPet) => p.physical.ageGroup && age.includes(p.physical.ageGroup))
  }

  if (size.length > 0) {
    result = result.filter((p: IPet) => p.physical.size && size.includes(p.physical.size))
  }

  if (sex) {
    result = result.filter((p: IPet) => p.sex && p.sex.toLowerCase() === sex)
  }

  if (goodWith.length > 0) {
    result = result.filter((p: IPet) => {
      return goodWith.every((trait) => {
        if (trait === 'kids') return p.behavior.isGoodWithKids
        if (trait === 'dogs') return p.behavior.isGoodWithDogs
        if (trait === 'cats') return p.behavior.isGoodWithCats
        return false
      })
    })
  }

  return result
})

const setFilter = (filter: string) => {
  if (!document.startViewTransition) {
    activeFilter.value = filter
    return
  }

  document.startViewTransition(async () => {
    activeFilter.value = filter
    await nextTick()
  })
}

const pet = computed(() => {
  if (detailPet.value) return detailPet.value

  const param = id.value
  if (!param) return undefined
  return currentPets.value.find((p: IPet) => p.id === param || p.slug === param)
})

watch(
  id,
  async (param) => {
    detailPet.value = null
    if (!param) return

    detailPet.value = await store.fetchPetDetail(param)
  },
  { immediate: true },
)

watch(id, () => {
  isFilterPanelOpen.value = false
})

watch(pet, (currentPet) => {
  if (currentPet) {
    isFilterPanelOpen.value = false
  }
})

const filterCount = computed(
  () => Object.values(advancedFilters.value).flat().filter(Boolean).length,
)

const handleGeneralApplication = (species: 'cat' | 'dog') => {
  vibrate(50)
  adoptionStore.resetForm()
  store.clearSelectedPet()
  store.selectPet({ id: 'unspecified', petName: 'Unspecified', species })
  router.push(`/pet-adoption/unspecified`)
}
</script>

<template>
  <div class="adopt">
    <div class="content-wrapper">
      <AdoptPageHeader
        :pet="!!pet"
        :activeFilter="activeFilter"
        :isFilterPanelOpen="isFilterPanelOpen"
        :filterCount="filterCount"
        @set-filter="setFilter"
        @toggle-filters="isFilterPanelOpen = !isFilterPanelOpen"
        @reset-filters="resetAllFilters"
      />

      <FilterPanel
        v-if="!pet"
        :isOpen="isFilterPanelOpen"
        :currentFilters="advancedFilters"
        @close="isFilterPanelOpen = false"
        @apply="applyAdvancedFilters"
        @clear="clearFilters"
      />

      <main>
        <div v-if="isFetching" class="loading-state">
          <Spinner />
        </div>
        <template v-else>
          <AdoptDetail v-if="pet" :pet="pet!" />
          <AdoptSummary v-else-if="filteredPets.length > 0" :pets="filteredPets" />
          <div v-else class="empty-state">
            <h2>No pets found</h2>
            <p>We couldn't find any friends matching that filter.</p>
            <button class="reset-btn" @click="resetAllFilters">View All Pets</button>
          </div>

          <GeneralApplicationCTA
            v-if="!pet"
            :activeFilter="activeFilter"
            @apply="handleGeneralApplication"
          />
        </template>
      </main>
    </div>
  </div>
</template>

<style scoped src="./Adopt.css"></style>
