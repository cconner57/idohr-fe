<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import FormSubmitted from '@/components/common/form-submitted/FormSubmitted.vue'
import Button from '@/components/common/ui/Button.vue'
import AdoptionContract from '@/components/contracts/AdoptionContract.vue'
import FosterToAdoptContract from '@/components/contracts/FosterToAdoptContract.vue'
import type { IPet } from '@/models/common'

interface ContractResponse {
  contract: {
    type: string
    application_id: number
  }
  pet: IPet
  adopter: {
    name: string
    email?: string
    phone?: string
    address?: string
  }
}

const route = useRoute()
const token = route.params.token as string

const loading = ref(true)
const error = ref('')
const isSubmitted = ref(false)
const validationError = ref('')

const contractData = ref<ContractResponse | null>(null)
const contractComponent = ref<
  InstanceType<typeof AdoptionContract> | InstanceType<typeof FosterToAdoptContract> | null
>(null)

// Fetch contract data
onMounted(async () => {
  try {
    const res = await fetch(`/api/contracts/${token}`)
    if (!res.ok) {
      if (res.status === 404) throw new Error('Contract not found or expired.')
      throw new Error('Failed to load contract.')
    }
    const data = await res.json()
    contractData.value = data
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'An unknown error occurred'
    }
  } finally {
    loading.value = false
  }
})

const isFosterToAdopt = computed(() => {
  return contractData.value?.contract?.type === 'FOSTER_TO_ADOPT'
})

// Map data to props for AdoptionContract
const adoptionContractProps = computed(() => {
  if (!contractData.value || !contractData.value.pet) return {}
  const pet = contractData.value.pet
  return {
    cat: {
      name: pet.name || 'Unknown',
      age: pet.physical?.ageGroup || 'Unknown',
      dob: pet.physical?.dateOfBirth || 'Unknown',
      sex: pet.sex || 'Unknown',
      altered: pet.medical?.spayedOrNeutered ? 'Yes' : 'No',
      breed: pet.physical?.breed || 'Unknown',
      color: pet.physical?.color || 'Unknown',
      adoptionFee: pet.adoption?.fee ? `$${pet.adoption.fee}` : '$0',
    },
    adopterName: contractData.value.adopter?.name || '',
  }
})

// Map data to props for FosterToAdoptContract
const fosterContractProps = computed(() => {
  if (!contractData.value || !contractData.value.pet) return {}
  const pet = contractData.value.pet
  return {
    cat: {
      name: pet.name || 'Unknown',
      age: pet.physical?.ageGroup || 'Unknown',
      sex: pet.sex || 'Unknown',
      breed: pet.physical?.breed || 'Unknown',
      color: pet.physical?.color || 'Unknown',
      adoptionFee: pet.adoption?.fee ? String(pet.adoption.fee) : '0',
    },
    adopter: contractData.value.adopter,
  }
})

const handleSubmit = async () => {
  validationError.value = ''

  if (!contractComponent.value) return

  // Validate
  const validation = contractComponent.value.validate()
  if (!validation.valid) {
    validationError.value = validation.error || 'Please complete the contract.'
    // Scroll to bottom where error usually is (or simply to bottom)
    globalThis.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    return
  }

  // Submit
  const signature = contractComponent.value.form.signature

  if (!contractData.value) return

  try {
    const res = await fetch('/api/contracts/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        application_id: contractData.value.contract.application_id,
        signature: signature,
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to submit contract.')
    }

    isSubmitted.value = true
    globalThis.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    if (err instanceof Error) {
      validationError.value = err.message
    } else {
      validationError.value = 'An error occurred. Please try again.'
    }
  }
}
</script>

<template>
  <div class="page-shell">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading Contract...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h1>Unable to Load Contract</h1>
      <p>{{ error }}</p>
      <p>
        Please contact us at <a href="mailto:cats@idohr.org">cats@idohr.org</a> if you believe this
        is an error.
      </p>
    </div>

    <div v-else-if="isSubmitted" class="success-state">
      <FormSubmitted
        title="Contract Signed!"
        text="Thank you for signing the adoption contract. We are so excited for you!"
        form-type="adoption"
        @reset="() => {}"
      />
      <!-- Hide reset button in this context via props ideally, or just ignore event -->
    </div>

    <div v-else class="contract-wrapper">
      <!-- Render Correct Contract Component -->
      <component
        :is="isFosterToAdopt ? FosterToAdoptContract : AdoptionContract"
        v-bind="isFosterToAdopt ? fosterContractProps : adoptionContractProps"
        ref="contractComponent"
      />

      <div class="actions-bar">
        <div v-if="validationError" class="validation-message">
          {{ validationError }}
        </div>

        <p class="terms-reminder">
          By clicking "Sign & Submit", you agree to the terms outlined above.
        </p>

        <Button
          @click="handleSubmit"
          title="Sign & Submit Contract"
          color="green"
          size="large"
          class="submit-btn"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  background-color: var(--color-primary);
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
}

.loading-state,
.error-state {
  text-align: center;
  color: var(--text-inverse);
  margin-top: 4rem;
}

.error-state a {
  color: var(--text-inverse);
  text-decoration: underline;
}

.contract-wrapper {
  max-width: 900px;
  width: 100%;
}

.actions-bar {
  background: var(--text-inverse);
  padding: 2rem;
  margin-top: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%);
}

.validation-message {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.terms-reminder {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.submit-btn {
  width: 100%;
  max-width: 400px;
}

/* Spinner */
.spinner {
  border: 4px solid rgb(255 255 255 / 30%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-left-color: var(--text-inverse);
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
