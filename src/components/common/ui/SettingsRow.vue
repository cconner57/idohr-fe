<script setup lang="ts">
import Icon from './Icon.vue'

defineProps<{
  label: string
  description?: string
  icon?: string
  iconColor?: string
  clickable?: boolean
  showChevron?: boolean
}>()

// Define emits for the click event
defineEmits(['click'])
</script>

<template>
  <div
    class="settings-row"
    :class="{ clickable }"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @keydown.enter="clickable && $emit('click')"
    @keydown.space.prevent="clickable && $emit('click')"
    @click="clickable && $emit('click')"
  >
    <div v-if="icon" class="row-icon" :style="{ color: iconColor, backgroundColor: `${iconColor}15` }">
      <Icon :name="icon" size="18" />
    </div>

    <div class="row-content">
      <span class="row-label">{{ label }}</span>
      <p v-if="description" class="row-description">{{ description }}</p>
    </div>

    <div class="row-action">
      <slot></slot>
      <div v-if="showChevron" class="chevron">
        <Icon name="chevronRight" size="16" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f3f4f6;
  min-height: 52px;
  transition: background 0.15s ease;
}

.settings-row:last-child {
  border-bottom: none;
}

.settings-row.clickable {
  cursor: pointer;
}

.settings-row.clickable:active {
  background-color: #f9fafb;
}

.row-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.row-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.row-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.2;
}

.row-description {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 2px 0 0;
  line-height: 1.3;
}

.row-action {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 16px;
  flex: 1;
  justify-content: flex-end;
  min-width: 0;
}

.chevron {
  color: #d1d5db;
  display: flex;
}

.settings-row.clickable:hover .chevron {
  color: #9ca3af;
}
</style>
