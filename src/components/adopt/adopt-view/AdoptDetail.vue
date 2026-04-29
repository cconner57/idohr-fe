<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import type { IPet } from '../../../models/common.ts'
import { useAdoptionStore } from '../../../stores/adoption'
import { usePetStore } from '../../../stores/pets'
import { calculateAge } from '../../../utils/date'
import { vibrate } from '../../../utils/haptics.ts'
import Button from '../../common/ui/Button.vue'
import Capsules from '../../common/ui/Capsules.vue'
import AdditionalInfo from '../additional-info/AdditionalInfo.vue'
import AdoptionProcess from '../adopt-process/AdoptionProcess.vue'
import AdoptDrawer from './AdoptDrawer.vue'
import RequestInfoDrawer from './RequestInfoDrawer.vue'

const props = defineProps<{
  pet: IPet
}>()

const router = useRouter()
const adoptionStore = useAdoptionStore()
const petStore = usePetStore()
const isDrawerOpen = ref(false)
const isInfoDrawerOpen = ref(false)
const isComingSoon = computed(() => {
  const normalizedStatus = props.pet.details?.status?.trim().toLowerCase() ?? ''
  return (
    normalizedStatus === 'intake' ||
    normalizedStatus === 'intake-processing' ||
    normalizedStatus === 'intake processing'
  )
})
const isStartAdoptionDisabled = computed(() => isComingSoon.value)
const fallbackBioStories = [
  (petName: string) =>
    `Hi, I'm ${petName}, and I'm still putting the finishing touches on my story. I've got tail wags, zoomies, and cozy nap-time highlights to share. Come back soon so I can tell you all about my favorite things and the kind of home I'm dreaming of.`,
  (petName: string) =>
    `Hey there, I'm ${petName}! I'm busy polishing up my autobiography between snack breaks and power naps. Check back soon, because I can't wait to share my funniest moments and what makes me happiest.`,
  (petName: string) =>
    `Paws up, I'm ${petName}, and my story is still in the editing phase. I'm choosing the very best tales from my adventures, silly quirks, and cuddle routines. Swing by again soon to read the full version straight from me.`,
  (petName: string) =>
    `Hello friend, I'm ${petName}, and my personal bio is almost ready for the spotlight. I'm gathering my best memories, favorite toys, and dream-home wishlist to share with you. Come back soon and I'll spill all the details.`,
  (petName: string) =>
    `It's me, ${petName}! I'm currently working with my imaginary editor to craft the perfect story. There will be heartwarming chapters, goofy bonus scenes, and lots of personality. Visit again soon to hear it all from me.`,
]
const selectedFallbackStory = ref('')
const formattedFallbackStory = computed(() => {
  const story = selectedFallbackStory.value
  const splitIndex = story.lastIndexOf('. ')

  if (splitIndex === -1) {
    return story
  }

  return `${story.slice(0, splitIndex + 1)}\n\n${story.slice(splitIndex + 2)}`
})

const pickFallbackStory = () => {
  const randomIndex = Math.floor(Math.random() * fallbackBioStories.length)
  selectedFallbackStory.value = fallbackBioStories[randomIndex](props.pet.name)
}

const handleStartAdoption = () => {
  if (isStartAdoptionDisabled.value) {
    return
  }

  vibrate(50)
  adoptionStore.resetForm()
  petStore.clearSelectedPet()
  petStore.selectPet({ id: props.pet.id, petName: props.pet.name, species: props.pet.species })
  router.push(`/pet-adoption/${props.pet.id}`)
}

const handleScheduleMeet = () => {
  if (isComingSoon.value) {
    return
  }

  isDrawerOpen.value = true
}

const handleRequestInformation = () => {
  isInfoDrawerOpen.value = true
}

const handleShare = () => {
  const shareData = {
    title: `Check out ${props.pet.name} for adoption!`,
    text: `I found ${props.pet.name} on IDOHR and thought you might be interested!`,
    url: globalThis.location.href,
  }
  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error))
  } else {
    alert('Sharing is not supported in this browser.')
  }
}

const imgError = ref(false)
const isImageLoaded = ref(false)

function onImgError() {
  imgError.value = true
}

function onImgLoad() {
  isImageLoaded.value = true
}

const r2BaseUrl = (import.meta.env.VITE_R2_PUBLIC_URL as string) ?? ''

const petPhotoUrl = computed(() => {
  const photos = props.pet.photos
  if (!photos || photos.length === 0) return ''
  const primary = photos.find((p) => p.isPrimary) ?? photos[0]
  return `${r2BaseUrl}/${primary.url.replace(/^pets\//, '')}`
})

watch(petPhotoUrl, () => {
  imgError.value = false
  isImageLoaded.value = false
})

watch(
  () => props.pet.id,
  () => {
    pickFallbackStory()
  },
  { immediate: true },
)
</script>

<template>
  <div class="adopt-detail">
    <div class="adopt-detail__main">
      <div class="adopt-detail__media">
        <div
          v-if="petPhotoUrl && !imgError && !isImageLoaded"
          class="img-placeholder"
          aria-hidden="true"
        ></div>
        <img
          v-if="petPhotoUrl && !imgError"
          :src="petPhotoUrl"
          :alt="pet.name"
          loading="lazy"
          :style="{ viewTransitionName: 'pet-' + pet.id }"
          :class="{ loaded: isImageLoaded }"
          @load="onImgLoad"
          @error="onImgError"
        />
        <div v-else class="img-fallback" aria-hidden="true"></div>
      </div>
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
              @click="handleStartAdoption"
              :disabled="isStartAdoptionDisabled"
              :fullWidth="true"
            />
            <Button title="Share" color="green" @click="handleShare" :fullWidth="true" />
            <Button
              title="Request Information"
              color="orange"
              @click="handleRequestInformation"
              :fullWidth="true"
            />
            <Button
              title="Schedule a Meet"
              color="purple"
              @click="handleScheduleMeet"
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
    </div>
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
  </div>

  <AdoptDrawer
    :pet="pet"
    :isDrawerOpen="isDrawerOpen"
    @update:isDrawerOpen="isDrawerOpen = $event"
  />
  <RequestInfoDrawer
    :pet="pet"
    :isDrawerOpen="isInfoDrawerOpen"
    @update:isDrawerOpen="isInfoDrawerOpen = $event"
  />
</template>

<style scoped lang="css">
.adopt-detail {
  width: 100%;

  .adopt-detail__main {
    display: flex;
    gap: 30px;
    width: 100%;

    .adopt-detail__media {
      position: relative;
      flex: 3;
      width: 0;
      min-width: 0;
      height: 600px;
    }

    .img-placeholder {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      background: linear-gradient(
        110deg,
        hsl(from var(--color-gray-50) h s 97%) 8%,
        hsl(from var(--color-gray-50) h s 92%) 18%,
        hsl(from var(--color-gray-50) h s 97%) 33%
      );
      background-size: 200% 100%;
      animation: shimmer 1.2s linear infinite;
      box-shadow: 0 4px 6px rgb(0 0 0 / 25%);
    }

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgb(0 0 0 / 25%);
      opacity: 0;
      transition: opacity 300ms ease-in-out;

      &.loaded {
        opacity: 1;
      }
    }

    & .img-fallback {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      background: url('/images/paw.svg') center/100px 100px no-repeat #add8e6;
      box-shadow: 0 4px 6px rgb(0 0 0 / 25%);
    }

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
    }

    @media (width <= 1024px) {
      flex-direction: column;

      .adopt-detail__media {
        width: 100%;
        height: 400px;
        flex: auto;
      }

      img,
      .img-placeholder,
      .img-fallback {
        width: 100%;
        height: 100%;
      }

      .adopt-detail__info {
        width: 100%;
        flex: auto;
      }
    }
  }

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

    & .adopt-detail__about__content {
      width: 50%;

      & .adopt-detail__about__fun {
        width: 100%;
      }

      & .adopt-detail__about__additional-info {
        margin-top: 2rem;
      }

      & .adopt-detail__about__additional-info ul {
        padding-left: 20px;
        list-style: disc;
      }

      & .adopt-detail__about__additional-info li {
        margin-bottom: 8px;
      }

      & .adopt-detail__about__fallback {
        white-space: pre-line;
      }
    }

    & .adopt-detail__about__process {
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

      & .adopt-detail__about__content,
      & .adopt-detail__about__process {
        width: 100%;
      }
    }
  }

  @media (width <= 430px) {
    padding: 0;
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
    }

    .adopt-detail__traits p {
      background-color: var(--color-primary-weak);
      padding: 4px 12px;
      border-radius: 16px;
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
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}
</style>
