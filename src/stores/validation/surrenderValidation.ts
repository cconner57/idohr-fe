import type { SurrenderFormState } from '../../models/surrender-form'

interface SurrenderValidationContext {
  step: number
  selectedAnimal: 'dog' | 'cat' | null
  formState: SurrenderFormState
}

function getStep0Errors(selectedAnimal: 'dog' | 'cat' | null): string[] {
  if (!selectedAnimal) return ['Animal Type (Dog or Cat)']
  return []
}

function getStep1Errors(formState: SurrenderFormState): string[] {
  const errors: string[] = []

  if (!formState.firstName) errors.push('First Name')
  if (!formState.lastName) errors.push('Last Name')
  if (!formState.phoneNumber) errors.push('Phone Number')
  if (!formState.email) errors.push('Email')
  if (!formState.streetAddress) errors.push('Street Address')
  if (!formState.city) errors.push('City')
  if (!formState.state) errors.push('State')
  if (!formState.zipCode) errors.push('Zip Code')
  if (!formState.whenToSurrenderAnimal) errors.push('When do you need to surrender your animal')
  if (!formState.animalName) errors.push("Animal's Name")
  if (!formState.animalAge) errors.push('Age')
  if (!formState.animalSex) errors.push('Sex')
  if (!formState.animalOwnershipDuration) errors.push('How long have you had your animal?')
  if (!formState.animalLocationFound) errors.push('Where did you get your animal?')
  if (!formState.animalWhySurrendered) errors.push('Why are you surrendering your animal?')
  if (!formState.otherPetsInHousehold) errors.push('Other pets in household')

  let hasAgeError = false
  let hasQtyError = false
  formState.householdMembers.forEach((member) => {
    if (!member.age) hasAgeError = true
    if (!member.count || member.count < 1) hasQtyError = true
  })
  if (hasAgeError) errors.push('Household - Age')
  if (hasQtyError) errors.push('Household - Quantity')

  return errors
}

export function getSurrenderValidationErrors(context: SurrenderValidationContext): string[] {
  if (context.step === 0) return getStep0Errors(context.selectedAnimal)
  if (context.step === 1) return getStep1Errors(context.formState)
  return []
}
