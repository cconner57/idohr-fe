import { describe, expect, it } from 'vitest'

import type { FormState } from '../../../models/adopt-form'
import { getAdoptionValidationErrors } from '../adoptionValidation'

const createMockFormState = (overrides: Partial<FormState> = {}): FormState => ({
  fax_number: '',
  secondPetId: null,
  generalPetName: '',
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  spouseFirstName: null,
  spouseLastName: null,
  roommatesNames: [''],
  childrenNamesAges: [{ name: '', age: '' }],
  currentPets: [],
  currentlyHavePets: 'No',
  pastPets: [],
  ownPetsBefore: 'No',
  email: 'john@example.com',
  address: '123 Main St',
  addressLine2: null,
  city: 'Anytown',
  state: 'CA',
  zip: '12345',
  phoneNumber: '555-555-5555',
  cellPhoneNumber: null,
  adultMembersAgreed: 'Yes',
  homeType: 'House',
  homeOwnership: 'Own',
  landlordName: null,
  landlordPhoneNumber: null,
  allowPets: null,
  breedRestrictionsWeightLimit: null,
  monthlyFee: null,
  allergies: null,
  primaryOwner: null,
  yearsAtAddress: null,
  previousAddress: null,
  expectToMove: null,
  travelPlan: null,
  catAccess: [],
  catIndoorOutdoor: null,
  catPreferenceBreed: null,
  catPreferencePhysical: null,
  catPreferencePersonality: null,
  catPreferenceNotWant: null,
  whyInterested: null,
  adoptionReason: null,
  ownCatBefore: null,
  ownKittenBefore: null,
  alreadyHaveVeterinarian: null,
  catAllowedHomeArea: null,
  catHomeAloneHours: null,
  catDisciplineType: null,
  catEscapeSteps: null,
  bredAnimalDescription: null,
  ownedDeclawedOrDebarked: null,
  movedWithPet: null,
  ownedSpecialNeedsPet: null,
  mobilityDevice: null,
  surrenderConditions: [],
  surrenderPlan: null,
  foodTypeBrand: null,
  affordVetCare: null,
  affordEmergencyCost: null,
  agreementSignature1: null,
  agreementSignature2: null,
  agreementSignature3: null,
  signatureData: null,
  dogWhySelected: null,
  dogHeardAbout: [],
  dogFencedBackyard: null,
  dogHasPool: null,
  dogPoolFence: null,
  dogHouseholdDescription: [],
  dogKeptLocation: [],
  dogSleepingLocation: [],
  dogAloneLocation: [],
  dogExercisePotty: null,
  dogCareResponsible: null,
  dogAnnualExpense: null,
  dogTravelArrangements: null,
  dogWillingToPottyTrain: null,
  dogTrainingExperience: [],
  dogWillingTrainingClass: null,
  dogConfinementTypes: [],
  dogBondingTime: null,
  dogDeniedOwnership: null,
  ...overrides,
})

describe('getAdoptionValidationErrors', () => {
  it('should return no general pet name validation errors if isGeneral is false', () => {
    const formState = createMockFormState({ generalPetName: '' })
    const errors = getAdoptionValidationErrors(-1, formState, 'cat', false)
    expect(errors).not.toContain('Interested Pet Name')
  })

  it('should return validation error for cat general flow when generalPetName is empty at step -1', () => {
    const formState = createMockFormState({ generalPetName: '' })
    const errors = getAdoptionValidationErrors(-1, formState, 'cat', true)
    expect(errors).toContain('Interested Pet Name')
  })

  it('should not return validation error for cat general flow when generalPetName is set at step -1', () => {
    const formState = createMockFormState({ generalPetName: 'Luna' })
    const errors = getAdoptionValidationErrors(-1, formState, 'cat', true)
    expect(errors).not.toContain('Interested Pet Name')
  })

  it('should return validation error for dog general flow when generalPetName is empty at step 0', () => {
    const formState = createMockFormState({ generalPetName: '' })
    const errors = getAdoptionValidationErrors(0, formState, 'dog', true)
    expect(errors).toContain('Interested Pet Name')
  })

  it('should not return validation error for dog general flow when generalPetName is set at step 0', () => {
    const formState = createMockFormState({ generalPetName: 'Buddy' })
    const errors = getAdoptionValidationErrors(0, formState, 'dog', true)
    expect(errors).not.toContain('Interested Pet Name')
  })
})
