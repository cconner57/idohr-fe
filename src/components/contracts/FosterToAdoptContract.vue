<script setup lang="ts">
/* eslint-disable max-lines */
import { computed, ref, watch } from 'vue'

import InputSignature from '../common/ui/InputSignature.vue'

interface Cat {
  name: string
  age: string
  sex: 'Male' | 'Female' | string
  breed: string
  color: string
  adoptionFee: string
}

interface Adopter {
  name: string
  phone?: string
  email?: string
  address?: string
}

interface Props {
  cat?: Cat
  adopter?: Adopter
  vettingCompletionDate?: string
}

const props = withDefaults(defineProps<Props>(), {
  cat: () => ({
    name: 'Pending Pet Name',
    age: 'Unknown',
    sex: 'Unknown',
    breed: 'Unknown',
    color: 'Unknown',
    adoptionFee: '0',
  }),
  adopter: () => ({
    name: '',
    phone: '',
    email: '',
    address: '',
  }),
  // Default date handled in script if undefined, but prop can override.
})

// Calculate default vetting date (90 days from now) if not passed
const defaultVettingDate = new Date()
defaultVettingDate.setDate(defaultVettingDate.getDate() + 90)
const estimatedCompletionDate = computed(() => {
  if (props.vettingCompletionDate) return props.vettingCompletionDate
  return defaultVettingDate.toLocaleDateString()
})

const form = ref({
  fosterName: props.adopter.name,
  phone: props.adopter.phone || '',
  email: props.adopter.email || '',
  address: props.adopter.address || '',
  date: new Date().toISOString().split('T')[0],
  signature: null as string | null,
  agreements: {
    custody: false,
    policies: false,
    temporary: false,
  },
})

// Watch prop changes to update form defaults if needed
watch(
  () => props.adopter,
  (newAdopter) => {
    if (newAdopter.name) form.value.fosterName = newAdopter.name
    if (newAdopter.phone) form.value.phone = newAdopter.phone
    if (newAdopter.email) form.value.email = newAdopter.email
    if (newAdopter.address) form.value.address = newAdopter.address
  },
  { deep: true },
)

/**
 * Pronoun helper: p('he', 'she', 'they')
 * Uses props.cat.sex to determine which string to return.
 * Case-insensitive check.
 */
function p(male: string, female: string, neutral: string) {
  const sex = props.cat.sex?.toLowerCase()
  if (sex === 'female') return female
  if (sex === 'male') return male
  return neutral
}

function handlePrint() {
  globalThis.print()
}

function validate() {
  if (
    !form.value.agreements.custody ||
    !form.value.agreements.policies ||
    !form.value.agreements.temporary
  ) {
    return { valid: false, error: 'Please agree to all terms and conditions.' }
  }
  if (!form.value.signature) {
    return { valid: false, error: 'Please sign the contract.' }
  }
  return { valid: true }
}

defineExpose({ form, validate })
</script>

<template>
  <div class="contract-container">
    <div class="header-actions">
      <h1>Foster-to-Adopt Contract</h1>
      <button @click="handlePrint" class="btn-primary">Print Contract</button>
    </div>

    <div class="contract-content">
      <header class="document-header">
        <h1 class="document-title">KITTEN FOSTER TO ADOPT CONTRACT</h1>
      </header>

      <section class="section mb-6">
        <p class="section-title">Program Overview:</p>
        <p>
          The I Dream of Home Rescue (IDOHR) Foster-to-Adopt Program was created to place young
          animals into approved forever homes in foster situations until fully vetted. Adoption
          occurs upon completion of receiving all vaccinations, microchipping, and spay/neuter.
        </p>
      </section>

      <div class="details-grid mb-6">
        <div><strong>Name:</strong> {{ cat.name }}</div>
        <div><strong>Approx Age:</strong> {{ cat.age }}</div>
        <div><strong>Gender:</strong> {{ cat.sex }}</div>
        <div><strong>Breed:</strong> {{ cat.breed }}</div>
        <div><strong>Color:</strong> {{ cat.color }}</div>
      </div>

      <section class="section mb-6">
        <p class="section-title">Foster Agreement:</p>
        <p>
          I, <strong>{{ form.fosterName || '________________' }}</strong
          >, agree to provide temporary foster care for {{ cat.name }} from IDOHR.
        </p>
      </section>

      <section class="section mb-6">
        <p class="section-title">Terms & Conditions (Please Check to Agree):</p>

        <div class="checkbox-group">
          <label class="checkbox-item">
            <input type="checkbox" v-model="form.agreements.custody" class="print:hidden" />
            <span class="checkmark print:hidden"></span>
            <span class="checkbox-text" :class="{ 'unchecked-print': !form.agreements.custody }">
              [<span class="print-box">{{ form.agreements.custody ? 'X' : '&nbsp;&nbsp;' }}</span
              >] I understand that IDOHR is entering into this Agreement as a courtesy to allow me
              to have custody of {{ cat.name }} until {{ p('he', 'she', 'they') }}
              {{ p('is', 'is', 'are') }} fully vetted.
            </span>
          </label>

          <label class="checkbox-item">
            <input type="checkbox" v-model="form.agreements.policies" class="print:hidden" />
            <span class="checkmark print:hidden"></span>
            <span class="checkbox-text" :class="{ 'unchecked-print': !form.agreements.policies }">
              [<span class="print-box">{{ form.agreements.policies ? 'X' : '&nbsp;&nbsp;' }}</span
              >] I must comply with IDOHR policies while {{ cat.name }} is in my temporary foster
              care.
            </span>
          </label>

          <label class="checkbox-item">
            <input type="checkbox" v-model="form.agreements.temporary" class="print:hidden" />
            <span class="checkmark print:hidden"></span>
            <span class="checkbox-text" :class="{ 'unchecked-print': !form.agreements.temporary }">
              [<span class="print-box">{{ form.agreements.temporary ? 'X' : '&nbsp;&nbsp;' }}</span
              >] I understand that custody will be temporary until the adoption process is complete.
            </span>
          </label>
        </div>
      </section>

      <section class="section mb-6">
        <p class="section-title">As a Temporary Foster Home, I agree to the following:</p>
        <ul class="agreement-list">
          <li>
            I agree to pay an adoption fee of ${{ cat.adoptionFee }} at the time of signing this
            contract.
          </li>
          <li>
            {{ cat.name }} remains the sole property of IDOHR during the foster-to-adopt timeframe,
            which lasts until {{ p('he', 'she', 'they') }} {{ p('is', 'is', 'are') }} fully vetted
            and a final Adoption Contract is signed.
          </li>
          <li>
            The estimated end date of this foster contract is:
            <strong>{{ estimatedCompletionDate }}</strong
            >.
          </li>
          <li>
            If for any reason the adoption is not finalized, I understand that {{ cat.name }} shall
            be returned to IDOHR.
          </li>
          <li>
            I will provide good care, including proper food, fresh water, shelter, exercise,
            grooming, and medication when required.
          </li>
          <li>
            I will comply with all instructions received from IDOHR and will not deviate from
            instructions without consulting a representative.
          </li>
          <li>I agree to maintain {{ cat.name }} as a household pet and companion.</li>
          <li>
            I agree to properly supervise {{ cat.name }}. I will not allow
            {{ p('him', 'her', 'them') }} to freely roam outside of the home at any time.
          </li>
          <li>
            I will provide basic training using only positive reinforcement. At no time will I use
            punishment as a training tool.
          </li>
        </ul>
      </section>

      <section class="section mb-6">
        <p class="section-title">Veterinary Care:</p>
        <ul class="agreement-list">
          <li>
            I will comply with IDOHR’s requirements to ensure that {{ cat.name }} is fully vetted
            before the expiration of this contract.
          </li>
          <li>
            If {{ cat.name }} needs medical attention, a member of IDOHR must be contacted
            immediately and must approve all vet visits.
          </li>
          <li>
            If I elect to take {{ cat.name }} to an unapproved veterinarian, I will provide IDOHR
            with records and I assume full financial responsibility.
          </li>
          <li>
            I understand that other animals in my household could be exposed to medical conditions
            not yet recognized in {{ cat.name }}, and IDOHR is not liable for disease or injury to
            my existing pets.
          </li>
        </ul>
      </section>

      <section class="section mb-8">
        <p class="section-title">Liability & Release:</p>
        <p>
          I specifically release IDOHR of any responsibility for any damage to property or personal
          injury relating to {{ cat.name }} and hold IDOHR harmless regarding any damage or injury
          of any nature.
        </p>
      </section>

      <footer class="contract-footer">
        <div class="signatures-block">
          <p class="section-title">Signatures:</p>
          <p class="mb-6">
            I recognize this is an Agreement and I have signed this Agreement freely and
            voluntarily.
          </p>

          <div class="form-grid mb-8">
            <div class="field">
              <label for="fosterName">Foster Name</label>
              <input id="fosterName" v-model="form.fosterName" type="text" class="form-input" />
            </div>
            <div class="field">
              <label for="phone">Phone</label>
              <input id="phone" v-model="form.phone" type="text" class="form-input" />
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" v-model="form.email" type="email" class="form-input" />
            </div>
            <div class="field">
              <label for="address">Address</label>
              <input id="address" v-model="form.address" type="text" class="form-input" />
            </div>
          </div>

          <div class="vetting-info mb-8">
            <p>
              <strong>IDOHR ANTICIPATES COMPLETION OF MEDICAL VETTING BY:</strong>
              {{ estimatedCompletionDate }}
            </p>
          </div>

          <div class="execution-block">
            <div class="signature-section">
              <InputSignature label="Electronic Signature" v-model="form.signature" />
            </div>
            <div class="date-section">
              <div class="field">
                <label for="date-signed">Date</label>
                <input
                  id="date-signed"
                  v-model="form.date"
                  type="date"
                  class="form-input text-center"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.contract-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--white, #fff);
  padding: 3rem;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 10%),
    0 2px 4px -2px rgb(0 0 0 / 10%);
  color: #000;
  font-family: serif;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  font-family: sans-serif;
}

.header-actions h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.btn-primary {
  background-color: var(--color-primary, #2563eb);
  color: var(--text-inverse, #fff);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark, #1d4ed8);
}

.document-header {
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #000;
  padding-bottom: 1rem;
}

.document-title {
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
}

.section-title {
  font-weight: 800;
  text-decoration: underline;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.section {
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #000;
  margin-bottom: 2rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.checkbox-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-item input[type='checkbox'] {
  margin-top: 0.3rem;
}

.print-box {
  display: none;
}

.agreement-list {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.agreement-list li {
  margin-bottom: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 0.25rem;
}

.form-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #aaa;
  padding: 0.5rem 0;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 1rem;
}

.vetting-info {
  border: 1px solid #000;
  padding: 1rem;
  text-align: center;
  background-color: #f0f0f0;
}

.execution-block {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 2rem;
  gap: 2rem;
}

.signature-section {
  flex: 2;
}

.date-section {
  flex: 1;
}

.text-center {
  text-align: center;
}

/* Print Styles */
@media print {
  body {
    background-color: #fff;
  }

  .contract-container {
    width: 100% !important;
    max-width: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .header-actions {
    display: none !important;
  }

  /* Replace checkboxes with print-friendly [X] */
  .checkbox-item input {
    display: none;
  }

  .print-box {
    display: inline-block;
    font-weight: 700;
    font-family: monospace;
  }

  .form-input {
    border-bottom: none !important;
    padding: 0 !important;
    font-weight: 700;
  }

  /* Hide placeholder/empty inputs if needed, or make them look like lines?
     Request said "Remove input borders so it looks like a typed document."
     So effectively plain text.
  */

  .details-grid,
  .vetting-info {
    background-color: transparent !important;
  }

  .vetting-info {
    border: 2px solid #000; /* Keep border for emphasis */
  }
}
</style>
