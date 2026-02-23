<script setup lang="ts">
import { onMounted,ref } from 'vue'

import Candid from '../../common/candid-award/Candid.vue'
import { Spinner } from '../../common/ui'

const currentYear = new Date().getFullYear()
const previousYear = currentYear - 1

const countCurrent = ref(0)
const countPrevious = ref(0)
const isLoadingCurrent = ref(true)
const isLoadingPrevious = ref(true)

import { API_ENDPOINTS } from '../../../constants/api'

const fetchCount = async (year: number) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ADOPTED_PETS_COUNT}?year=${year}`)
    const json = await response.json()

    if (json.data && typeof json.data.count === 'number') {
      return json.data.count
    }

    return json.count || 0
  } catch (error) {
    console.error(`Error fetching count for ${year}:`, error)
    return 0
  }
}

const getLabel = (count: number) => (count === 1 ? 'pet' : 'pets')

onMounted(() => {
  fetchCount(previousYear).then((prev) => {
    countPrevious.value = prev
    isLoadingPrevious.value = false
  })

  fetchCount(currentYear).then((curr) => {
    countCurrent.value = curr
    isLoadingCurrent.value = false
  })
})
</script>

<template>
  <section class="impact">
    <h4>Our Impact</h4>
    <div class="content">
      <div class="awards">
        <Candid type="Gold" year="2024" />
        <Candid type="Gold" year="2023" />
        <Candid type="Silver" year="2022" />
      </div>
      <div class="divider"></div>
      <div class="stats">
        <span>
          <div v-if="isLoadingPrevious" class="loader-container">
            <Spinner />
          </div>
          <template v-else>
            <h5>{{ countPrevious }}</h5>
            <p>{{ getLabel(countPrevious) }} rescued in {{ previousYear }}</p>
          </template>
        </span>
        <span>
          <div v-if="isLoadingCurrent" class="loader-container">
            <Spinner />
          </div>
          <template v-else>
            <h5>{{ countCurrent }}</h5>
            <p>{{ getLabel(countCurrent) }} rescued in {{ currentYear }}</p>
          </template>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.impact {
  width: 100%;
  background-color: var(--text-inverse);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 50px 40px;
  border-radius: 12px;
  margin-top: -200px;
  box-shadow: 0 4px 6px rgb(0 0 0 / 25%);
  container-type: inline-size;
  container-name: impact;

  & h4 {
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 24px;
  }

  & .content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: var(--text-primary);
    gap: 40px;
  }

  & .awards {
    display: flex;
    gap: 40px;
    justify-content: center;
  }

  .divider {
    border-left: 2px solid var(--border-color);
    height: 120px;
    margin: 0 20px;
  }

  .stats {
    display: flex;
    gap: 40px;
    justify-content: center;
    width: 100%;
    max-width: 450px;
    min-height: 100px;

    & span {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      text-align: center;
      flex: 1;
      min-width: 120px;
      position: relative;

      & h5 {
        font-size: 3rem;
        color: var(--text-primary);
      }

      & p {
        font-size: 1.1rem;
        color: var(--text-primary);
        max-width: 150px;
      }
    }
  }

  @media (width <= 900px) {
    margin-top: -80px;
    padding: 30px;
    height: auto;

    & h4 {
      margin-left: 0;
      text-align: left;
      width: 100%;
      margin-bottom: 20px;
    }

    & .content {
      flex-direction: column;
      gap: 40px;
      align-items: center;
    }

    .divider {
      width: 100%;
      height: 2px;
      border-left: none;
      border-top: 2px solid var(--border-color);
      margin: 0;
    }

    & .awards {
      width: 100%;
      gap: 40px;
      margin-top: 0;
      justify-content: center;
      min-width: 0;
      flex-wrap: wrap;
    }

    .stats {
      width: 100%;
      gap: 30px;
      justify-content: center;
      min-width: 0;

      & span {
        align-items: center;
        text-align: center;
      }
    }
  }

  @media (width <= 480px) {
    margin-top: -30px;
    padding: 24px;

    .stats {
      flex-direction: column;
      gap: 30px;
      align-items: center;
    }
  }
}
</style>
