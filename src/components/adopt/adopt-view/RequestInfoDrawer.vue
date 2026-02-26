<script setup lang="ts">
import { reactive, ref } from 'vue'

import { API_ENDPOINTS } from '../../../constants/api.ts'
import type { IPet } from '../../../models/common.ts'
import Drawer from '../../common/drawer/Drawer.vue'
import Button from '../../common/ui/Button.vue'
import InputField from '../../common/ui/InputField.vue'

const { pet, isDrawerOpen } = defineProps<{
  pet: IPet
  isDrawerOpen: boolean
}>()

const emit = defineEmits(['update:isDrawerOpen'])

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const apiError = ref<string | null>(null)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
})

const closeDrawer = () => {
  emit('update:isDrawerOpen', false)
}

const submitForm = async () => {
  apiError.value = null
  isSubmitting.value = true

  try {
    const response = await fetch(API_ENDPOINTS.PET_INQUIRY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fax_number: '',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        petId: pet.id,
        petName: pet.name,
        message: formData.message,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      apiError.value = errorData.error || 'Something went wrong. Please try again.'
      return
    }

    isSubmitted.value = true
  } catch {
    apiError.value = 'Network error. Please try again later.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Drawer
    :modelValue="isDrawerOpen"
    @update:modelValue="closeDrawer"
    :header="`Request Information About ${pet.name}`"
  >
    <div v-if="isSubmitted" class="success">
      <p>Thank you! Your message has been sent. We'll get back to you as soon as possible.</p>
    </div>

    <template v-else>
      <p>
        Have a question about {{ pet.name }}? Fill out the form below and one of our team members
        will get back to you as soon as possible.
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
          <label class="label">Message</label>
          <textarea
            v-model="formData.message"
            placeholder="Enter your question or message"
            rows="5"
          ></textarea>
        </div>
      </form>

      <p v-if="apiError" class="error">{{ apiError }}</p>

      <p class="footer-note">We look forward to helping you find your new best friend!</p>

      <div class="actions">
        <Button title="Submit" color="green" @click="submitForm()" :disabled="isSubmitting" />
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
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  background-color: #fff;
  color: var(--text-primary);
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  transition: all 0.2s;
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
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;

  p {
    font-size: 1.1rem;
    font-weight: 400;
  }
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
</style>
