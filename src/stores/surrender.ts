import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { useDemoMode } from '../composables/useDemoMode'
import { useMetrics } from '../composables/useMetrics'
import { API_ENDPOINTS } from '../constants/api'
import type { SurrenderFormState } from '../models/surrender-form'
import { getSurrenderValidationErrors } from './validation/surrenderValidation'

export const useSurrenderStore = defineStore('surrender', () => {
  const { isDemoMode } = useDemoMode()
  const step = ref(0)

  const isSubmitted = ref(false)
  const isSubmitting = ref(false)
  const submissionError = ref<string | null>(null)
  const hasAttemptedSubmit = ref(false)
  const selectedAnimal = ref<'dog' | 'cat' | null>(null)

  const formState = reactive<SurrenderFormState>({
    fax_number: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    whenToSurrenderAnimal: '',
    animalName: '',
    animalSex: '',
    animalAge: '',
    animalOwnershipDuration: '',
    animalLocationFound: '',
    animalWhySurrendered: '',
    householdMembers: [{ age: '', gender: 'Female', count: 1 }],
    otherPetsInHousehold: '',

    animalsBehaviorTowardsKnownPeople: '',

    animalsBehaviorTowardsStrangers: '',
    animalsBehaviorTowardsKnownAnimals: '',
    commentsOnBehavior: '',
    animalsReactionToNewPeople: '',
    animalHouseTrained: '',
    animalSpendMajorityOfTime: '',
    animalLeftAloneDuration: '',
    animalWhenLeftAlone: '',
    animalLeftAloneBehaviors: '',
    animalHowItPlays: '',
    animalToysItLikes: '',
    animalGamesItLikes: '',
    animalScaredOfAnything: '',
    animalScaredOfAnythingExplanation: '',
    animalBadHabits: '',
    animalAllowedOnFurniture: '',
    animalSleepAtNight: '',
    animalBehaviorFoodOthers: '',
    animalBehaviorToysOthers: '',
    animalProblemsRidingInCar: '',
    animalProblemsRidingInCarExplanation: '',
    animalEscapedBefore: '',
    animalEscapedBeforeExplanation: '',

    animalEverAttackedPeople: '',

    animalEverAttackedPeopleExplanation: '',
    animalEverAttackedOtherCats: '',
    animalEverAttackedOtherCatsExplanation: '',
    animalEverAttackedOtherDogs: '',
    animalEverAttackedOtherDogsExplanation: '',

    animalVeterinarianList: '',

    animalVeterinarianYearlyVisits: '',
    animalSpayedNeutered: '',
    animalVaccinationHistory: '',
    animalVaccinationsCurrent: '',
    animalTestedHeartworm: '',
    animalTestedHeartwormExplanation: '',
    animalHeartwormPrevention: '',
    animalHeartwormPreventionExplanation: '',
    animalMicrochipped: '',
    animalMicrochippedExplanation: '',
    animalVetOrGroomerBehavior: '',
    animalVetMuzzled: '',
    animalPastOrPresentHealthProblems: '',
    animalPastOrPresentHealthProblemsExplanation: '',
    animalCurrentMedications: '',
    animalCurrentMedicationsExplanation: '',

    animalTypeOfFood: '',

    animalEatingFrequency: '',
    animalAmountOfFood: '',
    animalFoodTreats: '',
    animalFoodTreatsExplanation: '',

    additionalInformation: '',

    fullBodyPhotoOfAnimal: '',
    closeUpPhotoOfAnimalFace: '',
    copiesOfRecords: '',
  })

  const validationErrors = computed(() => {
    return getSurrenderValidationErrors({
      step: step.value,
      selectedAnimal: selectedAnimal.value,
      formState,
    })
  })

  const isStepValid = computed(() => {
    if (isDemoMode.value) return true
    if (step.value === 0) return !!selectedAnimal.value
    if (step.value === 1) return validationErrors.value.length === 0
    return true
  })

  const { submitMetric } = useMetrics()

  const nextStep = () => {
    hasAttemptedSubmit.value = true
    if (!isStepValid.value) return false

    if (step.value === 3 && selectedAnimal.value === 'dog') {
      step.value += 2
    } else {
      step.value++
    }

    submitMetric('form_step', { form: 'surrender', step: step.value })

    hasAttemptedSubmit.value = false
    return true
  }

  const prevStep = () => {
    if (step.value > 0) {
      if (step.value === 5 && selectedAnimal.value === 'dog') {
        step.value -= 2
      } else {
        step.value--
      }
    }
  }

  const clearFormData = () => {
    formState.fax_number = ''
    formState.firstName = ''
    formState.lastName = ''
    formState.phoneNumber = ''
    formState.email = ''
    formState.streetAddress = ''
    formState.city = ''
    formState.state = ''
    formState.zipCode = ''
    formState.whenToSurrenderAnimal = ''
    formState.animalName = ''
    formState.animalSex = ''
    formState.animalAge = ''
    formState.animalOwnershipDuration = ''
    formState.animalLocationFound = ''
    formState.animalWhySurrendered = ''
    formState.householdMembers = [{ age: '', gender: 'Female', count: 1 }]
    formState.otherPetsInHousehold = ''
    formState.animalsBehaviorTowardsKnownPeople = ''
    formState.animalsBehaviorTowardsStrangers = ''
    formState.animalsBehaviorTowardsKnownAnimals = ''
    formState.commentsOnBehavior = ''
    formState.animalsReactionToNewPeople = ''
    formState.animalHouseTrained = ''
    formState.animalSpendMajorityOfTime = ''
    formState.animalLeftAloneDuration = ''
    formState.animalWhenLeftAlone = ''
    formState.animalLeftAloneBehaviors = ''
    formState.animalHowItPlays = ''
    formState.animalToysItLikes = ''
    formState.animalGamesItLikes = ''
    formState.animalScaredOfAnything = ''
    formState.animalScaredOfAnythingExplanation = ''
    formState.animalBadHabits = ''
    formState.animalAllowedOnFurniture = ''
    formState.animalSleepAtNight = ''
    formState.animalBehaviorFoodOthers = ''
    formState.animalBehaviorToysOthers = ''
    formState.animalProblemsRidingInCar = ''
    formState.animalProblemsRidingInCarExplanation = ''
    formState.animalEscapedBefore = ''
    formState.animalEscapedBeforeExplanation = ''
    formState.animalEverAttackedPeople = ''
    formState.animalEverAttackedPeopleExplanation = ''
    formState.animalEverAttackedOtherCats = ''
    formState.animalEverAttackedOtherCatsExplanation = ''
    formState.animalEverAttackedOtherDogs = ''
    formState.animalEverAttackedOtherDogsExplanation = ''
    formState.animalVeterinarianList = ''
    formState.animalVeterinarianYearlyVisits = ''
    formState.animalSpayedNeutered = ''
    formState.animalVaccinationHistory = ''
    formState.animalVaccinationsCurrent = ''
    formState.animalTestedHeartworm = ''
    formState.animalTestedHeartwormExplanation = ''
    formState.animalHeartwormPrevention = ''
    formState.animalHeartwormPreventionExplanation = ''
    formState.animalMicrochipped = ''
    formState.animalMicrochippedExplanation = ''
    formState.animalVetOrGroomerBehavior = ''
    formState.animalVetMuzzled = ''
    formState.animalPastOrPresentHealthProblems = ''
    formState.animalPastOrPresentHealthProblemsExplanation = ''
    formState.animalCurrentMedications = ''
    formState.animalCurrentMedicationsExplanation = ''
    formState.animalTypeOfFood = ''
    formState.animalEatingFrequency = ''
    formState.animalAmountOfFood = ''
    formState.animalFoodTreats = ''
    formState.animalFoodTreatsExplanation = ''
    formState.additionalInformation = ''
    formState.fullBodyPhotoOfAnimal = ''
    formState.closeUpPhotoOfAnimalFace = ''
    formState.copiesOfRecords = ''
  }

  const resetForm = () => {
    step.value = 0
    isSubmitted.value = false
    isSubmitting.value = false
    submissionError.value = null
    hasAttemptedSubmit.value = false
    selectedAnimal.value = null
    clearFormData()
  }

  const hasFiles = () =>
    formState.fullBodyPhotoOfAnimal instanceof File ||
    formState.closeUpPhotoOfAnimalFace instanceof File ||
    (Array.isArray(formState.copiesOfRecords) && formState.copiesOfRecords.some((f) => f instanceof File))

  const serializableTextFields = () => {
    const { fullBodyPhotoOfAnimal, closeUpPhotoOfAnimalFace, copiesOfRecords, ...textFields } =
      formState
    return {
      ...textFields,
      otherPetsInHousehold: Array.isArray(textFields.otherPetsInHousehold)
        ? textFields.otherPetsInHousehold.join(', ')
        : textFields.otherPetsInHousehold,
    }
  }

  const buildFormData = () => {
    const fd = new FormData()
    fd.append('data', JSON.stringify(serializableTextFields()))

    // Append file fields
    if (fullBodyPhotoOfAnimal instanceof File) {
      fd.append('fullBodyPhoto', fullBodyPhotoOfAnimal)
    }
    if (closeUpPhotoOfAnimalFace instanceof File) {
      fd.append('closeUpPhoto', closeUpPhotoOfAnimalFace)
    }
    if (Array.isArray(copiesOfRecords)) {
      for (const file of copiesOfRecords) {
        if (file instanceof File) {
          fd.append('records', file)
        }
      }
    }

    return fd
  }

  const submitApplication = async () => {
    if (isSubmitting.value) return

    isSubmitting.value = true
    submissionError.value = null

    try {
      if (isDemoMode.value) {
        console.log('Demo Mode: Simulating submission success')
        await new Promise((resolve) => setTimeout(resolve, 1000))
        isSubmitted.value = true
        resetForm()
        return
      }

      isSubmitted.value = false

      const useMultipart = hasFiles()
      const response = await fetch(API_ENDPOINTS.SURRENDER_APPLICATION, {
        method: 'POST',
        ...(useMultipart
          ? { body: buildFormData() }
          : {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(serializableTextFields()),
            }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      submitMetric('form_submit', { form: 'surrender' })

      isSubmitted.value = true
      resetForm()
    } catch (error) {
      console.error('Error submitting form:', error)
      submissionError.value = 'There was an error submitting your application. Please try again.'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    formState,
    step,
    isSubmitted,
    isSubmitting,
    submissionError,
    hasAttemptedSubmit,
    selectedAnimal,
    validationErrors,
    isStepValid,
    nextStep,
    prevStep,
    submitApplication,
    resetForm,
  }
})
