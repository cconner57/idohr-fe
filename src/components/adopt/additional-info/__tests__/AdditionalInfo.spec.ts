import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { IPet } from '@/models/common'

import AdditionalInfo from '../AdditionalInfo.vue'

describe('AdditionalInfo.vue', () => {
  const basePet: IPet = {
    id: 'pet-123',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    name: 'Mochi',
    species: 'cat',
    sex: 'female',
    physical: {
      breed: 'Domestic Shorthair',
      color: 'Orange',
      size: 'medium',
      ageGroup: 'adult',
      coatLength: 'short',
    },
    behavior: {
      energyLevel: 'medium',
      personalityTags: [],
      isGoodWithCats: true,
      isGoodWithDogs: false,
      isGoodWithKids: true,
      isHouseTrained: true,
      prefersToBeAlone: false,
    },
    medical: {
      spayedOrNeutered: true,
      vaccinationsUpToDate: true,
      microchip: {
        microchipped: true,
      },
      surgeries: [],
      vaccinations: {},
    },
    descriptions: {
      primary: 'A sweet cat',
    },
    details: {
      status: 'available',
    },
    adoption: {},
    foster: {},
    returned: {
      isReturned: false,
      history: [],
    },
    sponsored: {
      isSponsored: false,
    },
    photos: [],
    profileSettings: {
      isSpotlightFeatured: false,
      showAdditionalInformation: false,
      showMedicalHistory: false,
    },
  }

  it('renders standard health info when no special conditions exist', () => {
    const wrapper = mount(AdditionalInfo, {
      props: { pet: basePet },
    })

    expect(wrapper.text()).toContain('Vaccinated, Spayed, Microchipped')
    expect(wrapper.text()).not.toContain('Viral Status')
    expect(wrapper.text()).not.toContain('Special Needs')
    expect(wrapper.text()).not.toContain('Conditions')
  })

  it('displays viral status when pet is FIV positive or FeLV positive', () => {
    const fivPet: IPet = {
      ...basePet,
      medical: {
        ...basePet.medical,
        fivPositive: true,
        felvPositive: false,
      },
    }

    const wrapper = mount(AdditionalInfo, {
      props: { pet: fivPet },
    })

    expect(wrapper.text()).toContain('Viral Status')
    expect(wrapper.text()).toContain('FIV Positive')
  })

  it('displays special needs and medical conditions when present', () => {
    const specialPet: IPet = {
      ...basePet,
      medical: {
        ...basePet.medical,
        specialNeeds: ['Blind - Both Eyes', 'Three-Legged'],
        healthConcerns: ['anemia', 'asthma'],
      },
    }

    const wrapper = mount(AdditionalInfo, {
      props: { pet: specialPet },
    })

    expect(wrapper.text()).toContain('Special Needs')
    expect(wrapper.text()).toContain('Blind - Both Eyes, Three-Legged')
    expect(wrapper.text()).toContain('Conditions')
    expect(wrapper.text()).toContain('Anemia, Asthma')
  })
})
