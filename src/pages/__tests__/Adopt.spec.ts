import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

import type { IPet } from '@/models/common'
import Adopt from '@/pages/Adopt.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/adopt',
      component: Adopt,
    },
    {
      path: '/adopt/:id',
      component: Adopt,
    },
  ],
})

const mockPets: Partial<IPet>[] = [
  {
    id: 'pet-1',
    name: 'Teo',
    species: 'cat',
    physical: { ageGroup: 'young', breed: 'Mix', coatLength: 'short', color: 'white', size: 'medium' },
    behavior: { personalityTags: [], isGoodWithKids: true, isGoodWithDogs: false, isGoodWithCats: true, prefersToBeAlone: false, energyLevel: 'medium', isHouseTrained: true },
    photos: [],
    details: { status: 'available' },
  },
  {
    id: 'pet-2',
    name: 'Earth',
    species: 'cat',
    physical: { ageGroup: 'young', breed: 'Mix', coatLength: 'short', color: 'white', size: 'medium' },
    behavior: { personalityTags: [], isGoodWithKids: true, isGoodWithDogs: false, isGoodWithCats: true, prefersToBeAlone: false, energyLevel: 'medium', isHouseTrained: true },
    photos: [],
    details: { status: 'available' },
  },
  {
    id: 'pet-3',
    name: 'Willow',
    species: 'cat',
    physical: { ageGroup: 'young', breed: 'Mix', coatLength: 'short', color: 'gray', size: 'medium' },
    behavior: { personalityTags: [], isGoodWithKids: true, isGoodWithDogs: false, isGoodWithCats: true, prefersToBeAlone: false, energyLevel: 'medium', isHouseTrained: true },
    photos: [],
    details: { status: 'available' },
  },
  {
    id: 'pet-4',
    name: 'Chester',
    species: 'cat',
    physical: { ageGroup: 'young', breed: 'Mix', coatLength: 'short', color: 'orange', size: 'medium' },
    behavior: { personalityTags: [], isGoodWithKids: true, isGoodWithDogs: false, isGoodWithCats: true, prefersToBeAlone: false, energyLevel: 'medium', isHouseTrained: true },
    photos: [],
    details: { status: 'available' },
  },
]

describe('Adopt.vue', () => {
  it('renders pets sorted alphabetically by name', async () => {
    const wrapper = mount(Adopt, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              pets: {
                currentPets: mockPets as IPet[],
                isFetching: false,
              },
            },
          }),
          router,
        ],
        stubs: {
          AdoptPageHeader: true,
          FilterPanel: true,
          AdoptDetail: true,
          AdoptSummary: {
            props: ['pets'],
            template: '<div class="adopt-summary-stub"><div v-for="pet in pets" :key="pet.id" class="pet-name">{{ pet.name }}</div></div>',
          },
        },
      },
    })

    const petNames = wrapper.findAll('.pet-name').map((el) => el.text())
    expect(petNames).toEqual(['Chester', 'Earth', 'Teo', 'Willow'])
  })

  it('maintains alphabetical order when filtered by species', async () => {
    const mixedPets: Partial<IPet>[] = [
      { id: '1', name: 'Zara', species: 'cat', physical: { ageGroup: 'young', breed: 'Mix', coatLength: 'short', color: 'black', size: 'small' }, behavior: { personalityTags: [], isGoodWithKids: true, isGoodWithDogs: false, isGoodWithCats: true, prefersToBeAlone: false, energyLevel: 'low', isHouseTrained: true }, photos: [], details: { status: 'available' } },
      { id: '2', name: 'Alpha', species: 'dog', physical: { ageGroup: 'young', breed: 'Mix', coatLength: 'short', color: 'brown', size: 'medium' }, behavior: { personalityTags: [], isGoodWithKids: true, isGoodWithDogs: false, isGoodWithCats: true, prefersToBeAlone: false, energyLevel: 'low', isHouseTrained: true }, photos: [], details: { status: 'available' } },
      { id: '3', name: 'Bella', species: 'cat', physical: { ageGroup: 'young', breed: 'Mix', coatLength: 'short', color: 'white', size: 'small' }, behavior: { personalityTags: [], isGoodWithKids: true, isGoodWithDogs: false, isGoodWithCats: true, prefersToBeAlone: false, energyLevel: 'low', isHouseTrained: true }, photos: [], details: { status: 'available' } },
      { id: '4', name: 'Felix', species: 'cat', physical: { ageGroup: 'young', breed: 'Mix', coatLength: 'short', color: 'gray', size: 'small' }, behavior: { personalityTags: [], isGoodWithKids: true, isGoodWithDogs: false, isGoodWithCats: true, prefersToBeAlone: false, energyLevel: 'low', isHouseTrained: true }, photos: [], details: { status: 'available' } },
    ]

    const wrapper = mount(Adopt, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              pets: {
                currentPets: mixedPets as IPet[],
                isFetching: false,
              },
            },
          }),
          router,
        ],
        stubs: {
          AdoptPageHeader: {
            props: ['activeFilter'],
            template: '<div class="header-stub"><button class="cat-filter" @click="$emit(\'set-filter\', \'Cat\')">Cats</button></div>',
            emits: ['set-filter'],
          },
          FilterPanel: true,
          AdoptDetail: true,
          AdoptSummary: {
            props: ['pets'],
            template: '<div class="adopt-summary-stub"><div v-for="pet in pets" :key="pet.id" class="pet-name">{{ pet.name }}</div></div>',
          },
        },
      },
    })

    await wrapper.find('.cat-filter').trigger('click')

    const petNames = wrapper.findAll('.pet-name').map((el) => el.text())
    expect(petNames).toEqual(['Bella', 'Felix', 'Zara'])
  })
})
