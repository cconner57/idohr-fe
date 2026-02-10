<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    placeholder: string
    modelValue: string | null
    hasError?: boolean
    spanFull?: boolean

    maxChars?: number
  }>(),
  {
    spanFull: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()
const inputId = `textarea-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div class="field" :class="{ 'col-span-2': props.spanFull, 'has-error': props.hasError }">
    <label :for="inputId" class="label">{{ props.label }}</label>
    <div class="control">
      <textarea
        :id="inputId"
        :aria-invalid="props.hasError"
        class="textarea"
        rows="3"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        :maxlength="props.maxChars"
        @input="(e) => emit('update:modelValue', (e.target as HTMLTextAreaElement).value)"
      />
      <div v-if="props.maxChars" class="char-count">
        {{ (props.modelValue || '').length }} / {{ props.maxChars }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.control {
  display: flex;
  flex-direction: column;
}

.label {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5em;
  display: block;
}

.textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #fff;
  caret-color: var(--text-primary);
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  color: var(--text-primary);
  font-family: inherit;
  appearance: none;
  resize: none;
}

.textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 20%);
}

.col-span-2 {
  grid-column: span 2;
}

.field {
  margin-bottom: 0;
}

.full-width {
  grid-column: 1 / -1;
}

.has-error .textarea {
  border-color: var(--color-danger) !important;
  outline: 1px solid var(--color-danger) !important;
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 4px;
}
</style>
