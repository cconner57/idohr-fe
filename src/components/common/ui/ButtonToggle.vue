<script setup lang="ts">
import { computed } from 'vue'
type ToggleValue = string | number | boolean | null

const props = withDefaults(
  defineProps<{
    label: string
    modelValue?: ToggleValue
    trueValue?: ToggleValue
    falseValue?: ToggleValue
    trueLabel?: string

    falseLabel?: string
    hasError?: boolean
  }>(),
  {
    trueValue: 'Yes',
    falseValue: 'No',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: ToggleValue]
}>()

const displayTrueLabel = computed(() => {
  if (props.trueLabel) return props.trueLabel
  if (typeof props.trueValue === 'string') return props.trueValue
  return 'Yes'
})

const displayFalseLabel = computed(() => {
  if (props.falseLabel) return props.falseLabel
  if (typeof props.falseValue === 'string') return props.falseValue
  return 'No'
})
</script>

<template>
  <div class="field-group">
    <label v-if="props.label" class="field-label">{{ props.label }}</label>
    <div
      class="toggle-container"
      :class="{ 'has-error': props.hasError }"
      role="group"
      :aria-label="props.label"
    >
      <button
        type="button"
        class="toggle-btn"
        :class="{ active: props.modelValue === props.trueValue }"
        :aria-pressed="props.modelValue === props.trueValue"
        @click="emit('update:modelValue', props.trueValue)"
      >
        {{ displayTrueLabel }}
      </button>
      <button
        type="button"
        class="toggle-btn"
        :class="{ active: props.modelValue === props.falseValue }"
        :aria-pressed="props.modelValue === props.falseValue"
        @click="emit('update:modelValue', props.falseValue)"
      >
        {{ displayFalseLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="css">
.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border-width: 0;
}

.toggle-container {
  display: flex;
  align-items: stretch;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  padding: 2px;
  height: 48px;
  width: 100%;
  margin: 0;
  min-inline-size: 0;
  box-sizing: border-box;
}

.toggle-container.has-error {
  border-color: var(--color-danger);
}

.toggle-btn {
  flex: 1;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 6px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  padding: 0 16px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  height: 100%;

  &.active {
    background: #fff;
    border-color: #e5e7eb;
    box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
    color: var(--color-primary);
    font-weight: 700;
  }

  &:hover:not(.active) {
    color: var(--text-primary);
  }
}
</style>
