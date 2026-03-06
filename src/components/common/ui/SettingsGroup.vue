<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="settings-group-container">
    <h3 v-if="title" class="group-title">{{ title }}</h3>
    <div class="settings-group">
      <slot></slot>
    </div>
    <p v-if="description" class="group-description">{{ description }}</p>
  </div>
</template>

<style scoped>
.settings-group-container {
  margin-bottom: 32px;
}

.group-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 8px;
  margin-left: 16px;
  letter-spacing: 0.05em;
}

.settings-group {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-100);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.group-description {
  font-size: 0.8rem;
  color: var(--color-gray-500);
  margin-top: 8px;
  margin-left: 16px;
  margin-right: 16px;
  line-height: 1.4;
}
</style>
