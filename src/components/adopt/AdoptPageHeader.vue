<script setup lang="ts">
defineProps<{
  pet: boolean
  activeFilter: string
  isFilterPanelOpen: boolean
  filterCount: number
}>()

const emit = defineEmits<{
  'set-filter': [filter: string]
  'toggle-filters': []
  'reset-filters': []
}>()
</script>

<template>
  <div class="header" v-if="!pet">
    <h1>Find your new best friend</h1>
    <p>
      Search adoptable cats and dogs across Southern California. Every adoption helps us rescue
      another life.
    </p>
  </div>
  <div class="filters" v-if="!pet">
    <div class="species-group">
      <button
        class="reset-btn"
        :class="{ active: activeFilter === 'All' }"
        @click="emit('reset-filters')"
      >
        View All Pets
      </button>
      <button :class="{ active: activeFilter === 'Cat' }" @click="emit('set-filter', 'Cat')">
        Cats
      </button>
      <button :class="{ active: activeFilter === 'Dog' }" @click="emit('set-filter', 'Dog')">
        Dogs
      </button>
    </div>
    <div class="mobile-break"></div>
    <div class="divider"></div>
    <button
      class="filter-btn"
      :class="{ active: isFilterPanelOpen }"
      @click="emit('toggle-filters')"
    >
      Filters
      <span v-if="filterCount" class="badge">{{ filterCount }}</span>
    </button>
  </div>
</template>

<style scoped src="../../pages/Adopt.css"></style>
