<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAdoptionStore } from '../../../stores/adoption'
import { ButtonToggle, Icon } from '../../common/ui'

defineProps<{
  touched?: Record<string, boolean>
  // eslint-disable-next-line no-unused-vars
  handleBlur?: (_field: string) => void
  hasAttemptedSubmit?: boolean
}>()

const adoptionStore = useAdoptionStore()
const { formState } = storeToRefs(adoptionStore)

// We want to store a boolean, so we set true/false values explicitly
const handleConfirmationUpdate = (val: string | number | boolean | null) => {
  formState.value.homeTourSubmitted = val === true
}
</script>

<template>
  <div class="home-tour-section">
    <h2>Home Tour Video</h2>
<br>
    <div class="info-card">
      <div class="icon-wrapper">
        <Icon name="video" />
      </div>
      <div class="info-content">
        <h3>Required Step: Home Tour (1 - 1.5 Minutes)</h3>
        <p>
          To complete your application, please capture a short video showing the inside and outside of your home. This helps us ensure a safe and happy environment for our future pets!
        </p>

        <div class="instructions">
          <h4>What to include:</h4>
          <ul>
            <li>Common areas where the pet will spend time</li>
            <li>Where the pet will sleep</li>
            <li>Backyard or outdoor areas (if applicable)</li>
            <li>Other pets (if any)</li>
          </ul>

          <h4>How to submit:</h4>
          <p>
            You can email your video to Lori (IDOHR Director) at <a href="mailto:cats@idohr.org">cats@idohr.org</a> or text it to <a href="tel:9092614185">(909) 261-4185</a>.
          </p>
          <p>
            <strong>Note:</strong> Your application will <u>not</u> be considered without this home tour.
          </p>
        </div>
      </div>
    </div>

    <div class="confirmation-toggle">
       <ButtonToggle
          label="I have submitted my home tour video to the Director"
          :modelValue="formState.homeTourSubmitted"
          @update:modelValue="handleConfirmationUpdate"
          :true-value="true"
          :false-value="false"
          true-label="Yes, I have submitted the video"
          false-label="No, not yet"
          :hasError="hasAttemptedSubmit && !formState.homeTourSubmitted"
        />
        <p v-if="hasAttemptedSubmit && !formState.homeTourSubmitted" class="error-text">
          You must confirm that you have submitted the home tour video to proceed.
        </p>
    </div>
  </div>
</template>

<style scoped>
.home-tour-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-align: center;
}

.info-card {
  background-color: hsl(from var(--color-primary) h s 96%);
  border: 1px solid hsl(from var(--color-primary) h s 90%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  box-shadow: 0 4px 12px rgb(0 165 173 / 8%);
}

.icon-wrapper {
  background-color: var(--color-primary-weak); /* Assuming this variable exists as per usage */
  color: var(--color-primary);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper svg {
  width: 1.5rem;
  height: 1.5rem;
}

.info-content {
  flex: 1;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

p {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.instructions {
  background-color: #fff;
  border: 1px solid hsl(from var(--color-primary) h s 90%);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
}

h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

h4:first-child {
  margin-top: 0;
}

ul {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

li {
  margin-bottom: 0.25rem;
}

.confirmation-toggle {
  margin-top: 1rem;
}

.error-text {
  color: var(--color-danger);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
}

@media (width <= 600px) {
  .info-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .instructions {
    text-align: left;
  }
}
</style>
