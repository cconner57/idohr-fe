<script setup lang="ts">
import type { IPet } from '../../../models/common.ts'
import AdoptionProcess from '../adopt-process/AdoptionProcess.vue'

defineProps<{
  pet: IPet
  formattedFallbackStory: string
}>()
</script>

<template>
  <div class="adopt-detail__about">
    <div class="adopt-detail__about__content">
      <div class="adopt-detail__about__fun">
        <h2>From {{ pet.name }}</h2>
        <p v-if="pet.descriptions?.primary">{{ pet.descriptions?.primary }}</p>
        <p v-else class="adopt-detail__about__fallback">{{ formattedFallbackStory }}</p>
      </div>
      <div
        class="adopt-detail__about__additional-info"
        v-if="pet.profileSettings.showAdditionalInformation"
      >
        <h2>Additional Information</h2>
        <ul>
          <li v-for="(info, index) in pet.descriptions?.additionalInformation" :key="index">
            {{ info }}
          </li>
        </ul>
      </div>
    </div>
    <div class="adopt-detail__about__process">
      <AdoptionProcess :pet="pet" />
    </div>
  </div>
</template>

<style scoped lang="css">
.adopt-detail__about {
  display: flex;
  gap: 24px;
  margin-top: 20px;
  background-color: var(--text-inverse);
  padding: 32px;
  border-radius: 16px;
  color: var(--text-primary);
  box-shadow: 0 4px 6px rgb(0 0 0 / 25%);
  width: 100%;

  .adopt-detail__about__content {
    width: 50%;

    .adopt-detail__about__fun {
      width: 100%;
    }

    .adopt-detail__about__additional-info {
      margin-top: 2rem;

      ul {
        padding-left: 20px;
        list-style: disc;
      }

      li {
        margin-bottom: 8px;
      }
    }

    .adopt-detail__about__fallback {
      white-space: pre-line;
    }
  }

  .adopt-detail__about__process {
    width: 50%;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }

  p {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  @media (width <= 768px) {
    flex-direction: column;

    .adopt-detail__about__content,
    .adopt-detail__about__process {
      width: 100%;
    }
  }
}
</style>
