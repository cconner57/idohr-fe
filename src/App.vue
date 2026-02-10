<script setup lang="ts">
import '../src/styles/reset.css'
import '../src/styles/base.css'
import '../src/styles/shared.css'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

import NavBar from './components/common/nav-bar/NavBar.vue'
import PageLoader from './components/common/PageLoader.vue'
import Toast from './components/common/ui/Toast.vue'
import { useUIStore } from './stores/ui'

const uiStore = useUIStore()

const route = useRoute()
const showNavBar = computed(() => {
  return !route.meta.hideNavbar
})
</script>

<template>
  <PageLoader />
  <Toast
    :show="uiStore.toast.show"
    :message="uiStore.toast.message"
    :type="uiStore.toast.type"
    @close="uiStore.hideToast()"
  />
  <NavBar v-if="showNavBar" />
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
