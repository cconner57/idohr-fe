<script setup lang="ts">
import { nextTick, ref, useAttrs, watch } from 'vue'

defineOptions({
  inheritAttrs: false,
})

type TInputValue = string | number | null

const props = defineProps<{
  id?: string

  label?: string
  placeholder: string
  type?: string
  modelValue: TInputValue
  fullWidth?: boolean
  required?: boolean
  hasError?: boolean
  maxlength?: string | number
  inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  openPickerOnFocus?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TInputValue]
  blur: [event: Event]
}>()

const attrs = useAttrs()
const inputId = props.id ?? `input-${Math.random().toString(36).slice(2, 9)}`

const inputRef = ref<HTMLInputElement | null>(null)

function onInput(e: Event) {
  const target = e.target as HTMLInputElement | null
  let val: string | number | null = target?.value ?? null

  if (props.type === 'number' && val !== null && val !== '') {
    const num = Number(val)
    if (!Number.isNaN(num)) {
      val = num
    }
  }
  emit('update:modelValue', val)

  nextTick(() => {
    if (inputRef.value && String(props.modelValue ?? '') !== inputRef.value.value) {
      inputRef.value.value = String(props.modelValue ?? '')
    }
  })
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (inputRef.value && inputRef.value.value !== String(newVal ?? '')) {
      inputRef.value.value = String(newVal ?? '')
    }
  },
)

function onBlur(e: Event) {
  emit('blur', e)
}

function openPicker() {
  if (!props.openPickerOnFocus || !inputRef.value) {
    return
  }

  const pickerInput = inputRef.value as HTMLInputElement & {
    showPicker?: () => void
  }

  pickerInput.showPicker?.()
}
</script>

<template>
  <div
    class="control field"
    :class="{ 'is-fullwidth': props.fullWidth, 'has-error': props.hasError }"
  >
    <label v-if="props.label" class="label" :for="inputId">{{ props.label }}</label>
    <input
      ref="inputRef"
      v-bind="attrs"
      :id="inputId"
      :class="{ 'is-empty': !props.modelValue }"
      :placeholder="props.placeholder"
      :type="props.type"
      :value="props.modelValue"
      :aria-invalid="props.hasError"
      @input="onInput"
      @focus="openPicker"
      @click="openPicker"
      @blur="onBlur"
      :required="props.required"
      :maxlength="props.maxlength"
      :inputmode="props.inputmode"
    />
  </div>
</template>

<style scoped>
.control {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.label {
  color: var(--text-primary);
}

input {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  font-size: 1rem;
  transition: all var(--transition-normal);
  background-color: var(--color-white);
  caret-color: var(--text-primary);
  box-shadow: var(--shadow-md);
  color: var(--text-primary);
  flex: 1;
  min-height: 48px;
  font-family: inherit;
  appearance: none;
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 20%);
}

.control.has-error input {
  border-color: var(--color-danger);
  outline: 1px solid var(--color-danger);
}
</style>
