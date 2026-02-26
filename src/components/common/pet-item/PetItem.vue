<script setup lang="ts">
import { computed, type PropType,ref } from 'vue'
import { useRouter } from 'vue-router'

import { useMetrics } from '../../../composables/useMetrics'
import { goToAdopt } from '../../../utils/navigate.ts'
import Button from '../ui/Button.vue'
import Capsules from '../ui/Capsules.vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  capsules: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [],
  },
  photo: {
    type: String as PropType<string | null>,
    required: false,
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    required: false,
    default: 'medium',
  },
  priority: {
    type: Boolean,
    default: false,
  },
  isSponsored: {
    type: Boolean,
    default: false,
  },
})
const router = useRouter()

const r2BaseUrl = computed(() => import.meta.env.VITE_R2_PUBLIC_URL as string ?? '')
const photoSrc = computed(() => {
  if (!props.photo) return ''
  const r2Key = props.photo.replace(/^pets\//, '')
  return `${r2BaseUrl.value}/${r2Key}`
})

const imgError = ref(false)

function onImgError() {
  imgError.value = true
}

const { submitMetric } = useMetrics()

function handleAdopt() {
  submitMetric('spotlight_click', { petId: props.id, petName: props.name })
  goToAdopt(router, props.id.toLowerCase())
}
</script>

<template>
  <div class="pet-item" :style="{ viewTransitionName: `pet-card-${props.id}` }">
    <div class="img-wrapper">
      <img
        v-if="!imgError && photoSrc"
        :src="photoSrc"
        :alt="props.name"
        height="250"
        width="240"
        :style="{ viewTransitionName: 'pet-' + props.id }"
        :fetchpriority="priority ? 'high' : 'auto'"
        @error="onImgError"
        @click="handleAdopt"
      />
      <div v-else class="img-fallback" aria-hidden="true" @click="handleAdopt"></div>
      <div v-if="props.isSponsored" class="sponsored-badge" aria-label="Adoption fee sponsored">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Sponsored
      </div>
    </div>
    <div class="info-section">
      <h3>{{ props.name }}</h3>
      <div v-if="props.capsules.length > 0" class="capsules">
        <template v-for="capText in props.capsules" :key="capText">
          <Capsules v-if="capText && capText !== 'Invalid Date'">{{ capText }}</Capsules>
        </template>
      </div>
      <p v-if="props.description">{{ props.description }}</p>
      <div class="adopt-button">
        <Button title="Adopt Me" color="blue" @click="handleAdopt" :fullWidth="true" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.pet-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 280px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--text-inverse);
  color: var(--text-primary);
  box-shadow: 0 4px 6px rgb(0 0 0 / 25%);
  height: 400px;

  .img-wrapper {
    position: relative;
    width: 100%;
    height: 180px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      background-color: #f9fafb;
      cursor: pointer;
      display: block;
    }

    .img-fallback {
      width: 100%;
      height: 100%;
      background-color: #f9fafb;
      position: relative;
      cursor: pointer;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-color: #fff;
        mask: url('/images/paw.svg') no-repeat;
        mask-position: 90px 60px;
        mask-size: 100px 100px;
      }
    }

    .sponsored-badge {
      position: absolute;
      top: 0.625rem;
      left: 0.625rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      background-color: hsl(43 96% 50%);
      color: hsl(43 96% 15%);
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 0.25rem 0.5rem;
      border-radius: 999px;
      box-shadow: 0 2px 6px rgb(0 0 0 / 25%);
      pointer-events: none;
    }
  }

  .info-section {
    display: flex;
    flex-direction: column;
    padding: 0 20px 16px;
    flex: 1;
    overflow: hidden;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.6;
    padding: 4px 0;
    flex-shrink: 0;
    text-wrap: balance;
  }

  .capsules {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
    overflow: hidden;
    margin-bottom: 16px;
  }

  p {
    font-size: 0.925rem;
    flex-grow: 0;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
    padding-bottom: 2px;
  }

  @media (width <= 768px) {
    p {
      -webkit-line-clamp: 4;
      line-clamp: 4;
    }
  }

  .adopt-button {
    margin-top: auto;
  }

  @media (width >= 321px) and (width <= 430px) {
    & .img-fallback {
      background-color: #add8e6;
    }

    & .img-fallback::after {
      mask-position: center center;
    }

    & .info-section {
      & .capsules {
        margin-bottom: 8px;
        gap: 6px;
      }
    }
  }

  @media (width >= 1025px) and (width <= 1440px) {
    width: 240px;
    height: 360px;

    & .img-fallback {
      background-color: #add8e6;
    }

    & .img-fallback::after {
      mask-position: center center;
    }

    & .info-section {
      & .capsules {
        margin-bottom: 12px;
        gap: 2px;
      }
    }
  }

  @media (width >= 1441px) {
    width: 260px;
    height: 380px;

    & .img-fallback {
      background-color: #add8e6;
    }

    & .img-fallback::after {
      mask-position: center center;
    }
  }
}
</style>
