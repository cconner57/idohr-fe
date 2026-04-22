<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import FormSubmitted from '@/components/common/form-submitted/FormSubmitted.vue'
import Button from '@/components/common/ui/Button.vue'
import InputSelectGroup from '@/components/common/ui/InputSelectGroup.vue'
import InputSignature from '@/components/common/ui/InputSignature.vue'
import AdoptionSteps from '@/components/pet-adoption/adoption-steps/AdoptionSteps.vue'
import ApplicationHeader from '@/components/volunteer/application-header/ApplicationHeader.vue'
import { FOSTER_PAGES } from '@/constants/fosterQuestions'
import type { IFosterQuestion, TFosterSpecies } from '@/models/foster-form'
import { useFosterStore } from '@/stores/foster'

const router = useRouter()
const fosterStore = useFosterStore()
const { state } = storeToRefs(fosterStore)

const validationError = ref<string | null>(null)
const attemptedValidation = ref(false)

onMounted(() => {
  fosterStore.loadProgress()
})

const currentPage = computed(() => {
  return FOSTER_PAGES[state.value.currentStep - 1]
})

const currentVisibleQuestions = computed(() => {
  const species = state.value.speciesPreference
  const page = currentPage.value
  const housingStatus = (state.value.answers.q11 ?? '').trim()
  const hasCurrentPets = (state.value.answers.q30_hasCurrentPets ?? '').trim()
  const hasPastPets = (state.value.answers.q40_hasPastPets ?? '').trim()

  return page.questions.filter((q) => {
    if (q.id === 'q12') {
      return housingStatus === 'Rent' || housingStatus === 'Live with family'
    }

    if (page.id === 4 && q.id !== 'q30_hasCurrentPets') {
      return hasCurrentPets === 'Yes'
    }

    if (page.id === 5 && q.id !== 'q40_hasPastPets') {
      return hasPastPets === 'Yes'
    }

    const scope = q.speciesScope ?? 'all'
    if (scope === 'all') return true
    if (species === 'both') return true
    return scope === species
  })
})

const isQuestionRequired = (question: IFosterQuestion) => {
  if (currentPage.value.id === 4) {
    const hasCurrentPets = (state.value.answers.q30_hasCurrentPets ?? '').trim()

    if (question.id === 'q30_hasCurrentPets') {
      return true
    }

    if (hasCurrentPets === 'Yes') {
      return true
    }

    return false
  }

  if (currentPage.value.id === 5) {
    const hasPastPets = (state.value.answers.q40_hasPastPets ?? '').trim()

    if (question.id === 'q40_hasPastPets') {
      return true
    }

    if (hasPastPets === 'Yes') {
      return true
    }

    return false
  }

  return !!question.required
}

const getSpeciesLabel = () => {
  if (state.value.speciesPreference === 'cat') return 'cat'
  if (state.value.speciesPreference === 'dog') return 'dog'
  return 'pet'
}

const isBlank = (value: string | undefined) => {
  return !(value ?? '').trim()
}

const isInvalidEmail = (value: string) => {
  if (!value.trim()) return false
  return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

const isUnder18Dob = () => {
  const dob = state.value.answers.q2 ?? ''
  if (!dob.trim()) return false

  const date = new Date(`${dob}T00:00:00`)
  if (Number.isNaN(date.getTime())) return true

  const now = new Date()
  let age = now.getFullYear() - date.getFullYear()
  const monthDiff = now.getMonth() - date.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    age--
  }

  return age < 18
}

const getTodayLocalIsoDate = () => {
  const now = new Date()
  const tzOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10)
}

const isAgreementDateField = (questionId: string) => {
  return questionId === 'q94_date' || questionId === 'q95_date'
}

const isAgreementDateNotToday = (questionId: string, value: string) => {
  if (!isAgreementDateField(questionId)) return false
  if (!value.trim()) return false
  return value !== getTodayLocalIsoDate()
}

const questionValidationLabel = (question: IFosterQuestion) => {
  return getPageShortLabel(questionLabel(question))
}

const getQuestionValidationIssue = (question: IFosterQuestion) => {
  const value = state.value.answers[question.id] ?? ''

  if (isQuestionRequired(question) && isBlank(value)) {
    return questionValidationLabel(question)
  }

  if (question.type === 'email' && isInvalidEmail(value)) {
    return questionValidationLabel(question)
  }

  if (question.id === 'q2' && isUnder18Dob()) {
    return questionValidationLabel(question)
  }

  if (isAgreementDateNotToday(question.id, value)) {
    if (question.id === 'q94_date') return 'First acknowledgment date must be today'
    if (question.id === 'q95_date') return 'Second acknowledgment date must be today'
  }

  return null
}

const validationErrors = computed(() => {
  if (!attemptedValidation.value) return []

  const issues = new Set<string>()

  if (state.value.currentStep === 1 && !state.value.speciesPreference) {
    issues.add('Foster Preference')
  }

  currentVisibleQuestions.value.forEach((question) => {
    const issue = getQuestionValidationIssue(question)
    if (issue) {
      issues.add(issue)
    }
  })

  return Array.from(issues)
})

const isAgreementPage = computed(() => {
  return currentPage.value.id === 10
})

const getVisibleQuestion = (id: string) => {
  return currentVisibleQuestions.value.find((question) => question.id === id)
}

const questionHasError = (question: IFosterQuestion) => {
  if (!attemptedValidation.value) return false

  return !!getQuestionValidationIssue(question)
}

const questionLabel = (question: IFosterQuestion) => {
  if (question.id === 'q39') {
    if (state.value.speciesPreference === 'cat') {
      return 'Has your current pet(s) lived with other cats before?'
    }

    if (state.value.speciesPreference === 'dog') {
      return 'Has your current pet(s) lived with other dogs before?'
    }

    if (state.value.speciesPreference === 'both') {
      return 'Has your current pet(s) lived with other dogs and cats before?'
    }
  }

  const speciesText = getSpeciesLabel()
  const lowerReplaced = question.label.split('this species').join(speciesText)
  const capitalizedSpecies = speciesText.charAt(0).toUpperCase() + speciesText.slice(1)
  return lowerReplaced.split('This species').join(capitalizedSpecies)
}

const validateCurrentPage = () => {
  attemptedValidation.value = true

  if (validationErrors.value.length > 0) return false

  attemptedValidation.value = false
  validationError.value = null
  return true
}

const onNext = () => {
  if (!validateCurrentPage()) return
  fosterStore.goToNextStep()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const onBack = () => {
  fosterStore.goToPreviousStep()
  attemptedValidation.value = false
  validationError.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const onSubmit = async () => {
  if (!validateCurrentPage()) return
  await fosterStore.submitApplication()
  validationError.value = state.value.apiError ?? null
}

const inputType = (question: IFosterQuestion) => {
  if (question.type === 'email') return 'email'
  if (question.type === 'tel') return 'tel'
  if (question.type === 'date') return 'date'
  if (question.type === 'number') return 'number'
  return 'text'
}

const onReset = async () => {
  fosterStore.startNewForm()
  await router.push('/')
}

const speciesOptions: Array<{ label: string; value: TFosterSpecies }> = [
  { label: 'Cats', value: 'cat' },
  { label: 'Dogs', value: 'dog' },
  { label: 'Both', value: 'both' },
]

const hasSpeciesError = computed(() => {
  return (
    attemptedValidation.value && state.value.currentStep === 1 && !state.value.speciesPreference
  )
})

const fosterHeaderText =
  'Thank you for opening your home to a rescue pet. This foster application helps us match pets to the right environment, schedule support resources, and make placement safer for everyone involved.'

const fosterHeaderIntro = computed(() => {
  return state.value.currentStep === 1 ? fosterHeaderText : undefined
})

const getPageShortLabel = (title: string) => {
  return title.replace(/^Page\s+\d+:\s*/, '')
}

const fosterStepLabels = computed(() => {
  return [
    'Profile',
    'Home',
    'Environment',
    'Pets',
    'History',
    'Skills',
    'Care',
    'Commitment',
    'Scenarios',
    'Agreement',
  ]
})
</script>

<template>
  <section class="page-shell">
    <div v-if="!state.isSubmitted" class="form-container">
      <form class="form-card" aria-label="Foster Application" novalidate @submit.prevent>
        <ApplicationHeader header-title="Foster" :header-text="fosterHeaderIntro" />

        <section class="progress-panel" aria-label="Foster form progress">
          <AdoptionSteps :currentStep="state.currentStep - 1" :steps="fosterStepLabels" />
        </section>

        <fieldset
          v-if="state.currentStep === 1"
          class="section-block species"
          aria-label="Species preference"
        >
          <legend class="section-title">Foster Preference</legend>
          <p class="section-copy">What species are you currently available to foster?</p>
          <InputSelectGroup
            label=""
            :options="speciesOptions"
            :modelValue="state.speciesPreference"
            :hasError="hasSpeciesError"
            @update:modelValue="
              (val) => fosterStore.setSpeciesPreference((val as TFosterSpecies) ?? '')
            "
          />
        </fieldset>

        <fieldset
          class="section-block"
          :aria-labelledby="isAgreementPage ? undefined : 'foster-step-title'"
        >
          <legend v-if="!isAgreementPage" id="foster-step-title" class="section-title">
            {{ getPageShortLabel(currentPage.title) }}
          </legend>

          <div v-if="!isAgreementPage" class="questions-grid">
            <article
              v-for="question in currentVisibleQuestions"
              :key="question.id"
              class="question-card"
              :class="{
                'has-error': questionHasError(question),
                'full-row':
                  (currentPage.id === 4 && question.id === 'q30_hasCurrentPets') ||
                  (currentPage.id === 5 && question.id === 'q40_hasPastPets'),
              }"
            >
              <label :for="question.id">
                {{ questionLabel(question) }}
              </label>

              <textarea
                v-if="question.type === 'textarea'"
                :id="question.id"
                rows="3"
                :value="state.answers[question.id] ?? ''"
                :aria-invalid="questionHasError(question)"
                @input="
                  fosterStore.setAnswer(question.id, ($event.target as HTMLTextAreaElement).value)
                "
              ></textarea>

              <InputSelectGroup
                v-else-if="question.type === 'select'"
                label=""
                :options="question.options ?? []"
                :modelValue="state.answers[question.id] ?? ''"
                :hasError="questionHasError(question)"
                @update:modelValue="(val) => fosterStore.setAnswer(question.id, String(val ?? ''))"
              />

              <input
                v-else
                :id="question.id"
                :type="inputType(question)"
                :value="state.answers[question.id] ?? ''"
                :aria-invalid="questionHasError(question)"
                @input="
                  fosterStore.setAnswer(question.id, ($event.target as HTMLInputElement).value)
                "
              />
            </article>
          </div>

          <div v-else class="agreement-content">
            <div class="agreement-copy">
              <p>
                I certify that all information submitted in this foster application is true,
                complete, and accurate to the best of my knowledge. I confirm that I am at least 18
                years old and understand that any material omission or misrepresentation may result
                in denial, removal of a foster animal, or termination of foster participation at
                IDOHR's sole discretion. I understand that fostering may be costly and time
                intensive, and that I may incur out-of-pocket expenses, including urgent care
                expenses, unless reimbursement is expressly authorized in writing by IDOHR in
                advance. If you understand and agree, please type your full name below.
              </p>

              <article
                v-if="getVisibleQuestion('q94')"
                class="question-card"
                :class="{
                  'has-error': questionHasError(getVisibleQuestion('q94')!),
                }"
              >
                <div class="agreement-ack-row">
                  <div class="agreement-ack-item">
                    <label for="q94">Type your name</label>
                    <input
                      id="q94"
                      type="text"
                      :value="state.answers.q94 ?? ''"
                      :aria-invalid="questionHasError(getVisibleQuestion('q94')!)"
                      @input="
                        fosterStore.setAnswer('q94', ($event.target as HTMLInputElement).value)
                      "
                    />
                  </div>

                  <div
                    v-if="getVisibleQuestion('q94_date')"
                    class="agreement-ack-item"
                    :class="{ 'has-error': questionHasError(getVisibleQuestion('q94_date')!) }"
                  >
                    <label for="q94_date">Date</label>
                    <input
                      id="q94_date"
                      type="date"
                      :value="state.answers.q94_date ?? ''"
                      :aria-invalid="questionHasError(getVisibleQuestion('q94_date')!)"
                      @input="
                        fosterStore.setAnswer('q94_date', ($event.target as HTMLInputElement).value)
                      "
                    />
                  </div>
                </div>
              </article>

              <p>
                If approved as a foster, I agree to follow all IDOHR policies and instructions,
                maintain safe control of the foster pet, and communicate promptly regarding
                behavior, health, injuries, incidents, escapes, and emergencies. I understand that
                fostering a dog or cat may involve bites, scratches, zoonotic disease exposure,
                property damage, conflict with resident pets, and emotionally difficult outcomes,
                including severe illness or death. To the fullest extent permitted by law, I
                voluntarily assume all risks related to fostering and agree to release, defend,
                indemnify, and hold harmless IDOHR, its officers, directors, volunteers, partners,
                and representatives from any and all claims, demands, actions, damages, losses,
                liabilities, judgments, and expenses (including reasonable attorneys' fees) arising
                out of or related to my fostering activities, except to the extent caused by IDOHR's
                gross negligence or willful misconduct. If you understand and agree, please type
                your full name below.
              </p>

              <article
                v-if="getVisibleQuestion('q95')"
                class="question-card"
                :class="{ 'has-error': questionHasError(getVisibleQuestion('q95')!) }"
              >
                <div class="agreement-ack-row">
                  <div class="agreement-ack-item">
                    <label for="q95">Type your name</label>
                    <input
                      id="q95"
                      type="text"
                      :value="state.answers.q95 ?? ''"
                      :aria-invalid="questionHasError(getVisibleQuestion('q95')!)"
                      @input="
                        fosterStore.setAnswer('q95', ($event.target as HTMLInputElement).value)
                      "
                    />
                  </div>

                  <div
                    v-if="getVisibleQuestion('q95_date')"
                    class="agreement-ack-item"
                    :class="{ 'has-error': questionHasError(getVisibleQuestion('q95_date')!) }"
                  >
                    <label for="q95_date">Date</label>
                    <input
                      id="q95_date"
                      type="date"
                      :value="state.answers.q95_date ?? ''"
                      :aria-invalid="questionHasError(getVisibleQuestion('q95_date')!)"
                      @input="
                        fosterStore.setAnswer('q95_date', ($event.target as HTMLInputElement).value)
                      "
                    />
                  </div>
                </div>
              </article>

              <article
                v-if="getVisibleQuestion('q100')"
                class="question-card signature-card"
                :class="{ 'has-error': questionHasError(getVisibleQuestion('q100')!) }"
              >
                <InputSignature
                  label="Signature"
                  :modelValue="state.answers.q100 ?? null"
                  :hasError="questionHasError(getVisibleQuestion('q100')!)"
                  @update:modelValue="(val) => fosterStore.setAnswer('q100', val ?? '')"
                />
              </article>
            </div>
          </div>
        </fieldset>

        <div
          v-if="attemptedValidation && validationErrors.length > 0"
          class="validation-summary"
          role="alert"
          tabindex="-1"
        >
          <p class="summary-title">Please complete the following required fields:</p>
          <div class="tags">
            <span v-for="err in validationErrors" :key="err" class="tag is-danger">{{ err }}</span>
          </div>
        </div>

        <div v-if="validationError" class="validation-summary error-alert" role="alert">
          <p class="summary-title">Submission Error</p>
          <p>{{ validationError }}</p>
        </div>

        <footer class="actions">
          <Button
            type="button"
            title="Back"
            color="white"
            size="large"
            @click="onBack"
            :disabled="state.currentStep === 1"
            style="border: 1px solid var(--color-primary); color: var(--color-primary)"
          />
          <Button
            v-if="state.currentStep < 10"
            type="button"
            title="Next"
            color="green"
            size="large"
            @click="onNext"
          />
          <Button
            v-else
            type="button"
            title="Submit Application"
            color="green"
            size="large"
            @click="onSubmit"
            :loading="state.isSubmitting"
          />
        </footer>
      </form>
    </div>

    <FormSubmitted v-else formType="foster" @reset="onReset" />
  </section>
</template>

<style scoped lang="css">
.page-shell {
  min-height: 100vh;
  background-color: var(--color-primary);
  padding: 9rem var(--layout-padding-side) 64px;

  @media (width <= 440px) {
    padding: 6rem 16px 32px;
  }
}

.form-container {
  max-width: 1600px;
  margin: 0 auto;
  container-type: inline-size;
  container-name: foster-form;
}

.form-card {
  background: var(--text-inverse);
  color: var(--text-primary);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgb(0 0 0 / 10%);
  padding: 48px 48px 32px;

  @container foster-form (max-width: 900px) {
    padding: 32px 24px;
  }
}

.progress-panel {
  margin: 8px 0 24px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background-color: transparent;
}

.section-block {
  border: 0;
  margin: 24px 0;
  padding: 0;
}

.section-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 1.35;
  margin: 18px 0 12px;
}

.section-copy {
  margin-bottom: 12px;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.species {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @container foster-form (max-width: 860px) {
    grid-template-columns: 1fr;
  }
}

.agreement-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.agreement-copy {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 840px;
  margin: 0 auto;

  p {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-primary);
  }
}

.signature-card {
  margin-top: 8px;
}

.agreement-ack-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;

  @container foster-form (max-width: 860px) {
    grid-template-columns: 1fr;
  }
}

.agreement-ack-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.has-error input {
    border-color: var(--color-danger) !important;
    outline: 1px solid var(--color-danger);
  }
}

.question-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  background-color: transparent;

  label {
    font-size: 1rem;
    line-height: 1.45;
    color: var(--text-primary);
  }

  input,
  select,
  textarea {
    width: 100%;
    border: 1px solid var(--color-neutral-border);
    border-radius: var(--radius-md);
    padding: 12px 16px;
    font: inherit;
    font-size: 1rem;
    color: var(--text-primary);
    background-color: var(--color-white);
    box-shadow: var(--shadow-md);
    min-height: 48px;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 20%);
    }
  }

  textarea {
    min-height: 96px;
    resize: none;
  }

  &.has-error {
    input,
    select,
    textarea {
      border-color: var(--color-danger) !important;
      outline: 1px solid var(--color-danger);
    }
  }
}

.question-card.full-row {
  grid-column: 1 / -1;
}

.validation-summary {
  background-color: var(--color-danger-surface);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin: 24px 0;
  text-align: center;

  .summary-title {
    color: var(--color-danger);
    font-weight: 600;
    margin-bottom: 12px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }

  .tag.is-danger {
    background-color: var(--color-danger-weak);
    color: var(--color-danger);
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

@media (width <= 440px) {
  .actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>
