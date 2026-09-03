<script setup lang="ts">
import type { IPet } from '../../../models/common.ts'
import { formatDate } from '../../../utils/common.ts'
import PetItem from '../../common/pet-item/PetItem.vue'

defineProps<{
  pets: IPet[]
}>()

const getCapsules = (pet: IPet): string[] => {
  const capsules = [
    pet?.species ?? '',
    pet?.sex ?? '',
    pet?.physical?.dateOfBirth ? formatDate(pet?.physical?.dateOfBirth ?? '', true) : '',
  ].filter(Boolean)

  if (
    pet?.medical?.specialNeeds?.length ||
    pet?.behavior?.specialNeeds ||
    pet?.descriptions?.specialNeeds
  ) {
    capsules.push('Special Needs')
  } else if (pet?.medical?.fivPositive) {
    capsules.push('FIV+')
  } else if (pet?.medical?.felvPositive) {
    capsules.push('FeLV+')
  }

  return capsules
}
</script>

<template>
  <div class="adopt-summary">
    <PetItem
      v-for="(pet, index) in pets"
      :capsules="getCapsules(pet)"
      :description="pet.descriptions?.primary ?? pet.descriptions?.fun ?? ''"
      :id="pet.slug || pet.id"
      :key="pet.id"
      :name="pet.name"
      :photo="pet.photos?.find((p) => p.isPrimary)?.url"
      :priority="index === 0"
      :isSponsored="pet.sponsored?.isSponsored ?? false"
      :status="pet.details?.status ?? ''"
    />
  </div>
</template>

<style scoped lang="css">
.adopt-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 30px 20px;
  justify-content: center;
}
</style>
