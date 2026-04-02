<script setup lang="ts">
import { ref } from 'vue'

import { usePetInquiry } from '@/composables/usePetInquiry'
import type { IPet } from '@/models/common'

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
  'request_info',
)

const message = ref('')

const closeDrawer = () => {
  emit('update:isDrawerOpen', false)
}

const submitForm = async () => {
  await submitInquiry({ message: message.value })
}
</script>

<template>
  <Drawer
    :modelValue="isDrawerOpen"
    @update:modelValue="closeDrawer"
    :header="'Request Information'"
  >
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
      <h3 class="success__title">Message Sent!</h3>
      <p class="success__message">Thank you! We'll get back to you as soon as possible.</p>
    </div>

    <template v-else>
      <p>
        Have a question about <strong>{{ pet.name }}</strong
        >? Fill out the form below and one of our team members will get back to you as soon as
        possible.
      </p>

      <form @submit.prevent>
        <InputField
          label="First Name"
          placeholder="Enter your first name"
          type="text"
          v-model="formData.firstName"
        />
        <InputField
          label="Last Name"
          placeholder="Enter your last name"
          type="text"
          v-model="formData.lastName"
        />
        <InputField
          label="Email"
          placeholder="Enter your email"
          type="email"
          v-model="formData.email"
        />
        <InputField
          label="Phone (optional)"
          placeholder="Enter your phone number"
          type="tel"
          v-model="formData.phone"
        />
        <div class="field">
          <label class="label" for="request-info-message">Message</label>
          <textarea
            id="request-info-message"
            v-model="message"
            placeholder="Enter your question or message"
            rows="5"
          ></textarea>
        </div>
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

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  color: var(--text-primary);
  font-size: 1rem;
}

textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  font-size: 1rem;
  font-family: inherit;
  resize: none;
  background-color: var(--color-white);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 20%);
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
    color: var(--color-white);
    background-color: var(--color-primary);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    box-shadow: 0 12px 30px oklch(from var(--color-primary) l c h / 25%);
    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both;
  }

  &__icon {
    width: 48px;
    height: 48px;
    color: inherit;
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
