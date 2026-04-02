<script setup lang="ts">
import { ref } from 'vue'

import { usePetInquiry } from '@/composables/usePetInquiry'
import type { IPet } from '@/models/common'
import { formatPhoneNumber } from '@/utils/validators'

import Drawer from '../../common/drawer/Drawer.vue'
import Button from '../../common/ui/Button.vue'
import InputField from '../../common/ui/InputField.vue'

const { pet, isDrawerOpen } = defineProps<{
  pet: IPet
  isDrawerOpen: boolean
}>()

const emit = defineEmits(['update:isDrawerOpen'])

const { formData, isSubmitting, isSubmitted, apiError, submitInquiry } = usePetInquiry(
  pet,
  'schedule_meet',
)

const preferredDate = ref('')
const preferredTime = ref('')

const updatePhone = (value: string | number | null) => {
  formData.phone = formatPhoneNumber(value)
}

const closeDrawer = () => {
  emit('update:isDrawerOpen', false)
}

const submitForm = async () => {
  await submitInquiry({
    message: `Preferred Date: ${preferredDate.value || 'Not specified'}\nPreferred Time: ${preferredTime.value || 'Not specified'}`,
  })
}
</script>

<template>
  <Drawer :modelValue="isDrawerOpen" @update:modelValue="closeDrawer" :header="`Schedule a Meet`">
    <div v-if="isSubmitted" class="success">
      <div class="success__icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="success__icon"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h3 class="success__title">Request Sent!</h3>
      <p class="success__message">
        Thank you! One of our volunteers will reach out to schedule your meet and greet.
      </p>
    </div>

    <template v-else>
      <p>
        We’re excited to help you meet <strong>{{ pet.name }}</strong
        >! Our friendly volunteers are here to assist you in setting up a meet and greet. You’re
        welcome to visit our shelter during these hours:
      </p>
      <ul>
        <li><strong>Monday through Friday</strong><br />10am to 12pm and 6pm to 8pm</li>
        <li><strong>Weekends</strong><br />12pm to 4pm</li>
      </ul>
      <p>
        If these times don’t work for you, no problem! Simply fill out the form below, and one of
        our volunteers will get in touch with you as soon as possible to arrange a time that works
        best for you.
      </p>

      <form @submit.prevent>
        <InputField
          label="Your First Name:"
          placeholder="Enter your first name"
          type="text"
          v-model="formData.firstName"
        />
        <InputField
          label="Your Last Name:"
          placeholder="Enter your last name"
          type="text"
          v-model="formData.lastName"
        />
        <InputField
          label="Your Email:"
          placeholder="Enter your email"
          type="email"
          v-model="formData.email"
        />
        <InputField
          label="Your Phone Number:"
          placeholder="Enter your phone number"
          type="tel"
          v-model="formData.phone"
          inputmode="tel"
          @update:modelValue="updatePhone"
        />
        <InputField
          label="Preferred Date:"
          placeholder="Select a preferred date"
          type="date"
          v-model="preferredDate"
          openPickerOnFocus
        />
        <InputField
          label="Preferred Time:"
          placeholder="Select a preferred time"
          type="time"
          v-model="preferredTime"
          openPickerOnFocus
        />
      </form>

      <p v-if="apiError" class="error">{{ apiError }}</p>

      <p class="footer-note">We look forward to helping you find your new best friend!</p>

      <div class="actions">
        <Button
          title="Submit"
          color="green"
          @click="submitForm()"
          :loading="isSubmitting"
          :fullWidth="true"
        />
      </div>
    </template>
  </Drawer>
</template>

<style scoped lang="css">
p {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-weight: 300;
}

ul {
  margin: 0 0 1rem 1.5rem;
  padding: 0;
  list-style-type: disc;
  color: var(--text-primary);
}

li {
  margin-bottom: 0.5rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.error {
  color: var(--color-danger);
  font-weight: 400;
  margin-bottom: 1rem;
}

.footer-note {
  text-align: center;
  margin-bottom: 0;
}

.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &__icon-wrapper {
    color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-primary) 20%, #fff);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both;
  }

  &__icon {
    width: 48px;
    height: 48px;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  &__message {
    color: var(--color-neutral-strong);
    font-size: 1.05rem;
    line-height: 1.6;
    max-width: 300px;
    margin: 0;
    font-weight: 300;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
</style>
