<script setup lang="ts">
import type { IPet } from '../../../models/common.ts'
import { calculateAge } from '../../../utils/date'
import Button from '../../common/ui/Button.vue'
import Capsules from '../../common/ui/Capsules.vue'
import AdditionalInfo from '../additional-info/AdditionalInfo.vue'

defineProps<{
  pet: IPet
  isComingSoon: boolean
  isStartAdoptionDisabled: boolean
}>()

const emit = defineEmits<{
  'start-adoption': []
  'share': []
  'request-info': []
  'schedule-meet': []
}>()
</script>

<template>
  <div class="adopt-detail__info">
    <div class="adopt-detail__info__main">
      <h1 class="text-balance">{{ pet.name }}</h1>
      <div class="adopt-detail__traits">
        <Capsules v-if="pet?.species" :label="pet?.species" />
        <Capsules v-if="pet?.sex" :label="pet?.sex" />
        <Capsules
          v-if="pet?.physical?.dateOfBirth"
          :label="calculateAge(pet?.physical?.dateOfBirth)"
        />
      </div>
      <p>{{ pet?.descriptions?.fun }}</p>
      <div class="adopt-detail__actions">
        <Button
          title="Start Adoption"
          color="blue"
          @click="emit('start-adoption')"
          :disabled="isStartAdoptionDisabled"
          :fullWidth="true"
        />
        <Button title="Share" color="green" @click="emit('share')" :fullWidth="true" />
        <Button
          title="Request Information"
          color="orange"
          @click="emit('request-info')"
          :fullWidth="true"
        />
        <Button
          title="Schedule a Meet"
          color="purple"
          @click="emit('schedule-meet')"
          :disabled="isComingSoon"
          :fullWidth="true"
        />
      </div>
      <output v-if="isComingSoon" class="coming-soon-banner">
        This pet is coming soon. You can request information now, and scheduling opens once the
        pet is available.
      </output>
    </div>
    <AdditionalInfo :pet="pet" />
    <output v-if="pet.sponsored?.isSponsored" class="sponsored-banner">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
      <span>
        <strong>Adoption Fee Sponsored</strong>
        <span class="sponsored-sub"
          >A generous supporter has covered this pet's adoption fee.</span
        >
      </span>
    </output>
  </div>
</template>

<style scoped lang="css">
.adopt-detail__info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: var(--text-inverse);
  color: var(--text-primary);
  padding: 32px;
  border-radius: 16px;
  flex: 2;
  width: 0;
  min-width: 0;
  height: auto;
  min-height: 600px;
  box-shadow: 0 4px 6px rgb(0 0 0 / 25%);

  @media (width <= 1024px) {
    width: 100%;
    min-height: auto;
    flex: auto;
  }
}

.adopt-detail__info__main {
  h1 {
    font-size: 2.5rem;
  }

  @media (width >= 321px) and (width <= 430px) {
    h1 {
      font-size: 1.5rem;
    }
  }

  .adopt-detail__traits {
    display: flex;
    flex-flow: row wrap;
    gap: 10px;
    margin-bottom: 1rem;
  }

  .adopt-detail__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 1rem;

    @media (width <= 440px) {
      display: flex;
      flex-direction: column;
    }
  }
}

.sponsored-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background-color: hsl(43deg 96% 95%);
  border: 1px solid hsl(43deg 96% 70%);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: hsl(43deg 60% 25%);

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: hsl(43deg 96% 45%);
  }

  span {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  strong {
    font-size: 0.9rem;
    font-weight: 700;
  }

  .sponsored-sub {
    font-size: 0.8rem;
    opacity: 0.85;
  }
}

.coming-soon-banner {
  display: block;
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background-color: hsl(180deg 65% 93%);
  border: 1px solid hsl(180deg 55% 74%);
  color: hsl(180deg 60% 17%);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
}
</style>
