<script setup lang="ts">
import { ref } from 'vue'

import InputSignature from '../common/ui/InputSignature.vue'

interface Cat {
  name: string
  age: string
  dob: string
  sex: 'Male' | 'Female' | string
  altered: string
  breed: string
  color: string
  adoptionFee: string
}

interface Props {
  cat?: Cat
  adopterName?: string
}

const props = withDefaults(defineProps<Props>(), {
  cat: () => ({
    name: 'Pending Pet Name',
    age: 'Unknown',
    dob: 'Unknown',
    sex: 'Unknown',
    altered: 'Unknown',
    breed: 'Unknown',
    color: 'Unknown',
    adoptionFee: '$0',
  }),
  adopterName: '',
})

const form = ref({
  adopterName: props.adopterName,
  address: '',
  phone: '',
  email: '',
  driverLicense: '',
  date: new Date().toISOString().split('T')[0],
  signature: null as string | null,
})

/**
 * Pronoun helper: p('he', 'she')
 * Uses props.cat.sex to determine which string to return.
 * Default/Fallback is Male.
 */
function p(male: string, female: string) {
  const sex = props.cat.sex?.toLowerCase()
  if (sex === 'female') return female
  if (sex === 'male') return male
  return male
}

function handlePrint() {
  globalThis.print()
}

function validate() {
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
      <h1>Adoption Contract</h1>
      <button @click="handlePrint" class="btn-primary">Print Contract</button>
    </div>

    <div class="contract-content">
      <header class="document-header">
        <h1 class="org-name">I Dream of Home Rescue, Inc.</h1>
        <h2 class="document-title">CAT ADOPTION CONTRACT</h2>
      </header>

      <div class="details-grid">
        <div><strong>Name:</strong> {{ cat.name }}</div>
        <div><strong>Age:</strong> {{ cat.age }}</div>
        <div><strong>DOB:</strong> {{ cat.dob }}</div>
        <div><strong>Sex:</strong> {{ cat.sex }}</div>
        <div><strong>Altered:</strong> {{ cat.altered }}</div>
        <div><strong>Breed:</strong> {{ cat.breed }}</div>
        <div><strong>Color:</strong> {{ cat.color }}</div>
        <div><strong>Adoption Fee:</strong> {{ cat.adoptionFee }}</div>
      </div>

      <section class="agreement-section">
        <p class="section-title">Agreement:</p>
        <p>
          I Dream of Home Rescue (IDOHR) and the undersigned (the Adopter), in consideration of the
          mutual covenants in this Agreement, agree to the following:
        </p>

        <p>
          You understand that {{ cat.name }} {{ p('was', 'was') }} previously unwanted or lost and
          may have been rescued from a dangerous situation.
        </p>

        <p>
          This could have long-lasting effects on {{ cat.name }}. You agree that we are making no
          representations or warranties about the conditions, personality, or temperament of
          {{ p('him', 'her') }}.
        </p>

        <p>
          The known medical condition of the pet has been discussed at the time of adoption, and the
          owner will assume responsibility for all medical costs.
        </p>

        <p>
          Rescue cannot guarantee the health of any pet and shall not be held responsible for
          medical expenses incurred.
        </p>

        <p>
          Adopters agree to not cosmetically alter the pet unnecessarily (e.g., declawing, docking,
          cropping).
        </p>

        <p>
          IDOHR hereby discloses the known health of {{ cat.name }}: {{ p('He', 'She') }}
          {{ p('is', 'is') }} vaccinated, spayed/neutered, and microchipped.
        </p>

        <p>
          You agree to provide {{ cat.name }} DAILY with fresh water, wholesome cat food, shelter,
          and adequate exercise and affection.
        </p>

        <p>
          You agree that {{ cat.name }} will be kept indoors. If taken outdoors, you will place
          {{ p('him', 'her') }} in an enclosed outdoor area (Catio) or on a harness/leash.
        </p>

        <p>
          {{ cat.name }} will be treated as a household pet and not left crated for extended periods
          (i.e., more than 4 consecutive hours in any 24-hour period).
        </p>

        <p>
          You will keep in your possession a crate suitable for {{ cat.name }} and will use the
          crate for travel.
        </p>

        <p>
          Adopter agrees that Rescue has the right to investigate the home to ensure the pet is
          safe, upon 24 hours' prior notice.
        </p>

        <p>
          If in the opinion of investigators, the pet is not receiving adequate care, Rescue has the
          right to reclaim the pet immediately.
        </p>

        <p>
          You agree to have {{ cat.name }} examined by a licensed veterinarian not less than yearly.
        </p>

        <p>In case of illness or injury, you agree to seek prompt veterinary care.</p>

        <p>
          You agree to keep all required vaccinations current (Rabies, FVRCP) and consent to us
          inquiring with your veterinarian.
        </p>

        <p>
          You agree to make a serious effort to find {{ cat.name }} if {{ p('he', 'she') }}
          {{ p('becomes', 'becomes') }} lost (police reports, signs, ads).
        </p>

        <p>You agree to notify IDOHR immediately if the pet is lost.</p>

        <p>
          You agree that {{ cat.name }} is microchipped and will always wear an identification tag.
        </p>

        <p>
          You agree that IDOHR will be the primary owner of said chip for the first six (6) months.
        </p>

        <p>
          If after six (6) months there is no question of care, the chip will be transferred to you
          as primary owner.
        </p>

        <p>The certificate of ownership remains with IDOHR until such time.</p>

        <p>
          If you are unable to care for {{ cat.name }}, you will return {{ p('him', 'her') }} to
          IDOHR.
        </p>

        <p>
          You agree that you will not re-home {{ cat.name }} without the knowledge and written
          consent of IDOHR.
        </p>

        <p>
          If you do not comply with these terms, or {{ cat.name }} is abused, we will recover
          {{ p('him', 'her') }} from you upon demand.
        </p>

        <p>
          Promptly after the demand, we will come to your residence, and you will surrender
          {{ cat.name }} to us immediately.
        </p>

        <p>
          The Rescue is not liable for any claims, legal or otherwise, in connection with your
          adoption.
        </p>

        <p>You agree to read and sign the attached Voluntary Release / Waiver of Liability.</p>

        <p>This Agreement is the entire agreement and supersedes any prior understandings.</p>

        <p>No modification will be valid unless in writing duly signed by both you and us.</p>

        <p>This Agreement is binding upon you and your heirs.</p>

        <p>
          The adopter agrees that any sum of money given to Rescue is a non-refundable donation.
        </p>
      </section>

      <section class="instructions-section">
        <p class="section-title">Take Home Instructions:</p>
        <ul class="instructions-list">
          <li>Follow confinement recommendations (separate room for a week).</li>
          <li>Keep them with food, litter, bed, water, and toys.</li>
          <li>Watch that stools remain firm.</li>
          <li>Continue the brand of food used in foster care.</li>
          <li>Do not bring other pets into the isolation space.</li>
          <li>IDOHR will provide guidance on slow introductions.</li>
        </ul>
      </section>

      <footer class="contract-footer">
        <div class="signatures-block">
          <p class="block-title">Signatures:</p>
          <p class="disclaimer">
            I/We, the adopter(s), have read and understand this agreement. I/We also understand that
            the pet remains the property of IDOHR until all provisions are fulfilled.
          </p>

          <div class="form-grid">
            <div class="field">
              <label for="adopterName">Adopter Name</label>
              <input id="adopterName" v-model="form.adopterName" type="text" class="form-input" />
            </div>
            <div class="field">
              <label for="address">Address</label>
              <input id="address" v-model="form.address" type="text" class="form-input" />
            </div>
            <div class="field">
              <label for="phone">Cell Phone</label>
              <input id="phone" v-model="form.phone" type="text" class="form-input" />
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" v-model="form.email" type="email" class="form-input" />
            </div>
            <div class="field">
              <label for="driverLicense">Driver's License #</label>
              <input
                id="driverLicense"
                v-model="form.driverLicense"
                type="text"
                class="form-input"
              />
            </div>
            <div class="field">
              <label for="date">Date</label>
              <input id="date" v-model="form.date" type="date" class="form-input" />
            </div>
          </div>

          <div class="signature-section">
            <InputSignature label="Electronic Signature" v-model="form.signature" />
          </div>
        </div>

        <AdoptionWaiver :cat-name="cat.name" :signature="form.signature" :date="form.date" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.contract-container {
  max-width: 56rem; /* max-w-4xl */
  margin: 0 auto;
  background-color: var(--white, #fff);
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 10%),
    0 2px 4px -2px rgb(0 0 0 / 10%);
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.contract-content {
  color: var(--text-secondary);
  font-family: serif;
  font-size: 0.875rem; /* text-sm */
  line-height: 1.625;
}

.document-header {
  text-align: center;
  border-bottom: 2px solid #000;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.org-name {
  font-size: 1.25rem; /* text-xl */
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: underline;
  margin-bottom: 0.25rem;
  color: #000;
}

.document-title {
  font-size: 1.125rem; /* text-lg */
  font-weight: 700;
  text-transform: uppercase;
  color: #000;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 2rem;
  padding: 1rem;
  background-color: #f9fafb; /* gray-50 */
  border: 1px solid #000;
  margin-bottom: 2rem;
}

.section-title {
  display: inline-block;
  font-weight: 700;
  border-bottom: 1px solid #000;
  margin-bottom: 1rem;
  color: #000;
}

.agreement-section p,
.instructions-section p {
  margin-bottom: 1rem;
}

.instructions-list {
  list-style-type: decimal;
  padding-left: 1.25rem;
}

.instructions-list li {
  margin-bottom: 0.25rem;
}

.contract-footer {
  margin-top: 3rem;
}

.signatures-block {
  border-top: 2px solid #000;
  padding-top: 2rem;
}

.block-title {
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: #000;
}

.disclaimer {
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (width >= 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.form-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #d1d5db; /* gray-300 */
  padding: 0.25rem 0;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus {
  border-bottom-color: var(--color-primary, #3b82f6);
}

.signature-section {
  max-width: 28rem;
  margin-bottom: 3rem;
}

/* Print Styles */
@media print {
  .contract-container {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
  }

  .header-actions {
    display: none !important;
  }

  .details-grid {
    background-color: transparent !important;
  }

  .form-input {
    border-bottom: none !important;
    padding: 0 !important;
    font-weight: 600;
  }

  input[type='date']::-webkit-calendar-picker-indicator {
    display: none !important;
  }

  .contract-footer {
    margin-top: 0;
  }
}
</style>
