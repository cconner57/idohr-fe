<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

import FormSubmitted from '@/components/common/form-submitted/FormSubmitted.vue'
import Button from '@/components/common/ui/Button.vue'
import AdoptionSteps from '@/components/pet-adoption/adoption-steps/AdoptionSteps.vue'
import CatAdoptionInfoSection from '@/components/pet-adoption/cat-adoption/CatAdoptionInfoSection.vue'
import CurrentPetsSection from '@/components/pet-adoption/cat-adoption/CurrentPetsSection.vue'
import GeneralSection from '@/components/pet-adoption/cat-adoption/GeneralSection.vue'
import HomeSection from '@/components/pet-adoption/cat-adoption/HomeSection.vue'
import NewCatSection from '@/components/pet-adoption/cat-adoption/NewCatSection.vue'
import OtherSection from '@/components/pet-adoption/cat-adoption/OtherSection.vue'
import PastPetsSection from '@/components/pet-adoption/cat-adoption/PastPetsSection.vue'
import SummarySection from '@/components/pet-adoption/cat-adoption/SummarySection.vue'
import ApplicationHeader from '@/components/volunteer/application-header/ApplicationHeader.vue'
import { useMetrics } from '@/composables/useMetrics'
import { useAdoptionStore } from '@/stores/adoption'
import { usePetStore } from '@/stores/pets'
import { vibrate } from '@/utils/haptics'

const router = useRouter()
const adoptionStore = useAdoptionStore()
const petStore = usePetStore()

const {
  formState,
  step,
  isSubmitting,
  isSubmitted,
  hasAttemptedSubmit,
  validationErrors,
  submissionError,
} = storeToRefs(adoptionStore)
const { selectedPet } = storeToRefs(petStore)

const { prevStep, resetForm } = adoptionStore

const { submitMetric } = useMetrics()

const species = computed(() => selectedPet.value?.species ?? 'cat')
const animalLabel = computed(() => (species.value === 'dog' ? 'dog' : 'cat'))
const isCatFlow = computed(() => species.value === 'cat')
const isCatIntroStep = computed(() => isCatFlow.value && step.value === 0)
const visibleStep = computed(() => (isCatFlow.value ? Math.max(step.value - 1, 0) : step.value))
const adoptionSteps = computed(() => {
  if (species.value === 'dog') {
    return ['General', 'Home', 'New Dog', 'Past Pets', 'Other', 'Summary']
  }

  return ['General', 'Home', 'New Cat', 'Current Pets', 'Past Pets', 'Other', 'Summary']
})
const finalStep = computed(() => (isCatFlow.value ? 7 : 6))
const headerText = computed(() => {
  if (species.value === 'cat') {
    if (!isCatIntroStep.value) {
      return undefined
    }

    return 'This application is intended as a means to match the right cat with the right home. The more detail you provide, the better. Most adoptable pets are spayed/neutered, vaccinated, and microchipped. For younger kittens, we offer a foster-to-adopt program where you take them home now and return for scheduled vet care until they are ready for official adoption. Typical adoption fees are $300 for kittens and $250 for adults. Adoption fees are tax-deductible donations, not purchase prices. Thank you for considering adoption!'
  }

  return 'This application is intended as a means to match the right dog with the right home. The more detail you provide, the better. Most adoptable pets are spayed/neutered, vaccinated, and microchipped. Typical adoption fees are $450 for puppies, $400 for adults, and $350 for seniors. Adoption fees are tax-deductible donations, not purchase prices. Thank you for considering adoption!'
})

onMounted(() => {
  if (selectedPet.value) {
    submitMetric('pet_view', {
      petId: selectedPet.value.id,
      petName: selectedPet.value.petName,
      species: selectedPet.value.species,
    })
    submitMetric('form_start', { form: 'adoption', petId: selectedPet.value.id })
  }
})

const touched = reactive<Record<string, boolean>>({})

const handleBlur = (field: string) => {
  touched[field] = true
}

const handleSubmit = async () => {
  if (!adoptionStore.isStepValid) {
    hasAttemptedSubmit.value = true
    globalThis.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    return
  }

  if (step.value < finalStep.value) {
    adoptionStore.nextStep()
    globalThis.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    submitMetric('form_submit', { form: 'adoption', petId: selectedPet.value?.id })
    console.log('Submitting form...')
    vibrate(50)
    const isSubmissionSuccessful = await adoptionStore.submitApplication()
    if (isSubmissionSuccessful) {
      petStore.clearSelectedPet()
    }
    globalThis.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleReset = async () => {
  await router.push('/')
  resetForm()
}
</script>

<template>
  <section class="page-shell">
    <section v-if="!isSubmitted" class="form-card" aria-labelledby="form-title">
      <ApplicationHeader
        :header-title="selectedPet?.species === 'cat' ? 'Cat' : 'Dog'"
        :header-text="headerText"
      />
      <AdoptionSteps v-if="!isCatIntroStep" :currentStep="visibleStep" :steps="adoptionSteps" />
      <div v-show="!isCatIntroStep" class="cat-name-display">
        <h2>Adopting Pet:</h2>
        <p>{{ selectedPet?.petName }}</p>
      </div>
      <CatAdoptionInfoSection v-show="isCatIntroStep" />
      <GeneralSection
        v-show="(!isCatFlow && step === 0) || (isCatFlow && step === 1)"
        v-model="formState"
        :touched="touched"
        :handleBlur="handleBlur"
        :hasAttemptedSubmit="hasAttemptedSubmit"
      />
      <HomeSection
        v-show="(!isCatFlow && step === 1) || (isCatFlow && step === 2)"
        v-model="formState"
        :touched="touched"
        :handleBlur="handleBlur"
        :hasAttemptedSubmit="hasAttemptedSubmit"
        :animalLabel="animalLabel"
      />
      <NewCatSection
        v-show="(!isCatFlow && step === 2) || (isCatFlow && step === 3)"
        v-model="formState"
        :touched="touched"
        :handleBlur="handleBlur"
        :hasAttemptedSubmit="hasAttemptedSubmit"
        :animalLabel="animalLabel"
      />
      <CurrentPetsSection
        v-show="(!isCatFlow && step === 3) || (isCatFlow && step === 4)"
        v-model="formState"
        :touched="touched"
        :handleBlur="handleBlur"
        :hasAttemptedSubmit="hasAttemptedSubmit"
      />
      <PastPetsSection
        v-show="(!isCatFlow && step === 4) || (isCatFlow && step === 5)"
        v-model="formState"
        :touched="touched"
        :handleBlur="handleBlur"
        :hasAttemptedSubmit="hasAttemptedSubmit"
      />
      <OtherSection
        v-show="(!isCatFlow && step === 5) || (isCatFlow && step === 6)"
        v-model="formState"
        :touched="touched"
        :handleBlur="handleBlur"
        :hasAttemptedSubmit="hasAttemptedSubmit"
        :animalLabel="animalLabel"
      />
      <SummarySection
        v-show="(!isCatFlow && step === 6) || (isCatFlow && step === 7)"
        v-model="formState"
        :touched="touched"
        :handleBlur="handleBlur"
        :hasAttemptedSubmit="hasAttemptedSubmit"
        :animalLabel="animalLabel"
      />

      <div v-if="hasAttemptedSubmit && validationErrors.length > 0" class="validation-summary">
        <p class="summary-title">Please complete the following required fields:</p>
        <div class="tags">
          <span v-for="err in validationErrors" :key="err" class="tag is-danger">{{ err }}</span>
        </div>
      </div>

      <div v-if="submissionError" class="validation-summary error-summary">
        <p class="summary-title">There was an error submitting your application:</p>
        <p class="error-message">{{ submissionError }}</p>
      </div>

      <div class="actions">
        <Button
          @click="prevStep"
          title="Back"
          :color="'white'"
          size="large"
          style="border: 1px solid var(--color-primary); color: var(--color-primary)"
          :disabled="step === 0 || isSubmitted"
        />
        <Button
          @click="handleSubmit"
          type="submit"
          :title="step < finalStep ? 'Next' : 'Submit Application'"
          color="green"
          size="large"
          :loading="step === finalStep && isSubmitting"
          :disabled="isSubmitted || isSubmitting"
        />
      </div>
    </section>

    <FormSubmitted
      v-else
      @reset="handleReset"
      title="Application Submitted"
      text="Thank you for your application! We will review it as soon as possible."
      form-type="adoption"
    />
  </section>
</template>

<style scoped lang="css">
.page-shell {
  min-height: 100vh;
  background-color: var(--color-primary);
  padding: 9rem var(--layout-padding-side) 64px;
  container-type: inline-size;
  container-name: shell;

  @media (width <= 440px) {
    padding: 6rem 16px 32px;
  }

  .form-card {
    max-width: 1600px;
    margin: 0 auto;
    background: var(--text-inverse);
    color: var(--text-primary);
    border-radius: 24px;
    box-shadow: 0 10px 30px rgb(0 0 0 / 10%);
    padding: 48px 48px 32px;

    @container shell (max-width: 800px) {
      padding: 32px 24px;
    }

    fieldset {
      border: 0;
      margin: 24px 0;
      padding: 0;

      .section-title {
        font-weight: 700;
        font-size: 18px;
        margin: 18px 0 12px;
      }
    }

    .cat-name-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2rem;

      h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      p {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-primary);
      }
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 20px;

      @media (width <= 600px) {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;

      @container shell (max-width: 650px) {
        grid-template-columns: 1fr;
      }
    }

    .validation-summary {
      background-color: var(--color-white);
      border: 1px solid #e11d48;
      color: #9f1239;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin: 2rem 0;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%);

      .summary-title {
        font-weight: 700;
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
      }

      .tag.is-danger {
        background-color: #fce7f3;
        color: #9f1239;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-full);
        font-size: 0.9rem;
        font-weight: 600;
      }
    }
  }
}
</style>
