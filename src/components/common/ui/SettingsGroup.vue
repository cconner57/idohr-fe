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
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  overflow: hidden;
  box-shadow: 0 1px 3px rgb(0 0 0 / 2%);
}

.group-description {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 8px;
  margin-left: 16px;
  margin-right: 16px;
  line-height: 1.4;
}
</style>
