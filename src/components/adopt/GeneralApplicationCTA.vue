<script setup lang="ts">
import Button from '@/components/common/ui/Button.vue'

defineProps<{
  activeFilter: string
}>()

const emit = defineEmits<{
  apply: [species: 'cat' | 'dog']
}>()
</script>

<template>
  <div class="general-application">
    <h2>Don't see who you're looking for?</h2>
    <p>You can still submit a general application for a pet that may not be in our system yet.</p>
    <div class="application-buttons">
      <Button
        v-if="activeFilter === 'All' || activeFilter === 'Cat'"
        title="General Cat Application"
        color="white"
        @click="emit('apply', 'cat')"
      />
      <Button
        v-if="activeFilter === 'All' || activeFilter === 'Dog'"
        title="General Dog Application"
        color="white"
        @click="emit('apply', 'dog')"
      />
    </div>
  </div>
</template>

<style scoped src="../../pages/Adopt.css"></style>
