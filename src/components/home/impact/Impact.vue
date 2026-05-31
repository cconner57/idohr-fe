<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

import { usePetStore } from '@/stores/pets'

import Spinner from '../../common/ui/Spinner.vue'

const currentYear = new Date().getFullYear()
const previousYear = currentYear - 1

const petStore = usePetStore()
const { adoptedCounts, countsLoaded } = storeToRefs(petStore)

const countCurrent = computed(() => adoptedCounts.value[currentYear] ?? 0)
const countPrevious = computed(() => adoptedCounts.value[previousYear] ?? 0)
const isLoading = computed(() => !countsLoaded.value)

const getLabel = (count: number) => (count === 1 ? 'pet' : 'pets')

onMounted(() => {
  petStore.fetchAdoptedCounts()
})
</script>

<template>
  <section class="impact">
    <div class="impact-header">
      <h4><span class="impact-paw">🐾</span> Pets Found Forever Homes</h4>
      <p class="impact-subtitle">Every number is a life changed — and a family made whole.</p>
    </div>
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-year-label">{{ previousYear }}</div>
        <div v-if="isLoading" class="loader-container">
          <Spinner />
        </div>
        <template v-else>
          <div class="stat-count">{{ countPrevious }}</div>
          <div class="stat-desc">{{ getLabel(countPrevious) }} found forever homes</div>
        </template>
      </div>
      <div class="stat-card stat-card--current">
        <div class="stat-year-label">{{ currentYear }}</div>
        <div v-if="isLoading" class="loader-container">
          <Spinner />
        </div>
        <template v-else>
          <div class="stat-count">{{ countCurrent }}</div>
          <div class="stat-desc">{{ getLabel(countCurrent) }} found forever homes</div>
        </template>
        <div class="stat-badge">This Year</div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;
  width: 100%;
}

.impact {
  width: 100%;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  background: var(--text-inverse);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 48px 50px 56px;
  border-radius: var(--radius-lg);
  margin-top: -200px;
  box-shadow: 0 4px 6px rgb(0 0 0 / 25%);
}

.impact-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.impact-paw {
  font-size: 2rem;
  line-height: 1;
  margin-right: 0.25rem;
}

.impact-header h4 {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.impact-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  max-width: 480px;
  line-height: 1.5;
}

.stat-cards {
  display: flex;
  gap: 32px;
  justify-content: center;
  width: 100%;
}

.stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: var(--text-inverse);
  border-radius: var(--radius-lg);
  padding: 32px 48px 28px;
  box-shadow: 0 2px 16px rgb(0 0 0 / 8%);
  border: 1px solid var(--color-primary-border);
  flex: 1;
  max-width: 280px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-primary-border);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgb(0 0 0 / 12%);
  }
}

.stat-card--current {
  border-color: var(--color-primary);

  &::before {
    background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  }
}

.stat-year-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.stat-count {
  font-size: 4.5rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
  letter-spacing: -0.03em;
}

.stat-card--current .stat-count {
  color: var(--color-primary-dark);
}

.stat-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.4;
}

.stat-badge {
  margin-top: 12px;
  padding: 4px 14px;
  background: var(--color-primary-weak);
  color: var(--color-primary-dark);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 1px solid var(--color-primary-border);
}

@media (width <= 900px) {
  .impact {
    margin-top: -80px;
    padding: 40px 30px 48px;
    gap: 32px;
  }

  .impact-header h4 {
    font-size: 1.75rem;
  }

  .stat-count {
    font-size: 3.5rem;
  }
}

@media (width <= 600px) {
  .impact {
    margin-top: -30px;
    padding: 32px 24px 40px;
  }

  .stat-cards {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .stat-card {
    width: 100%;
    max-width: 340px;
    padding: 28px 32px 24px;
  }

  .stat-count {
    font-size: 3rem;
  }

  .impact-header h4 {
    font-size: 1.5rem;
  }
}
</style>
