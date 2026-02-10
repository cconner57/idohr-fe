<script setup lang="ts">
import Icon from './Icon.vue'

defineProps<{
  items: {
    id: string;
    label: string;
    icon?: string;
    badge?: number | string | null
  }[]
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="tabs">
    <button
      v-for="item in items"
      :key="item.id"
      class="tab-btn"
      :class="{ active: modelValue === item.id }"
      @click="emit('update:modelValue', item.id)"
    >
      <span v-if="item.icon" class="tab-icon">
        <Icon :name="item.icon" size="18" />
      </span>
      <span class="tab-label">{{ item.label }}</span>
      <span v-if="item.badge !== undefined && item.badge !== null" class="count-badge">
        {{ item.badge }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 24px;
  overflow-x: auto;
  scrollbar-width: none;
  gap: 8px;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 1rem;
  color: var(--color-neutral-text-soft);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &.active {
    color: var(--color-secondary);
    border-bottom-color: var(--color-secondary);
    font-weight: 600;

    .count-badge {
      background: var(--color-secondary-weak);
      color: var(--color-secondary);
    }
  }

  &:hover:not(.active) {
    color: var(--text-primary);
    background-color: var(--color-neutral-weak);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
}

.tab-icon {
  display: flex;
  align-items: center;
}

.count-badge {
  background: var(--color-neutral-weak);
  color: var(--color-neutral-text-soft);
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}
</style>
