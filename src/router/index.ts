import { nextTick } from 'vue'
import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'

import { useMetrics } from '../composables/useMetrics'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../pages/Home.vue'),
    },
    {
      path: '/about',
      component: () => import('../pages/About.vue'),
    },
    { path: '/adopt', name: 'adopt-list', component: () => import('../pages/Adopt.vue') },
    {
      path: '/adopt/:id',
      name: 'adopt-pet',
      component: () => import('../pages/Adopt.vue'),
      props: true,
    },
    {
      path: '/donate',
      component: () => import('../pages/Donate.vue'),
    },
    {
      path: '/volunteer',
      component: () => import('../pages/Volunteer.vue'),
    },
    {
      path: '/surrender',
      component: () => import('../pages/SurrenderPet.vue'),
    },
    {
      path: '/pet-adoption/:id',
      component: () => import('../pages/PetAdoption.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
    },
    {
      path: '/contract/:token',
      name: 'contract-sign',
      component: () => import('../pages/Contract.vue'),
      meta: { hideNavbar: true },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

interface CustomViewTransitionDocument extends Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startViewTransition: any
}



import { useUIStore } from '../stores/ui'

console.log('Router: File loaded')

router.beforeEach(async (to, from, next) => {
  console.log('Router: beforeEach started', { to: to.path, from: from.path })
  try {
    const uiStore = useUIStore()
    console.log('Router: Got UI Store')
    uiStore.startLoading()
    console.log('Router: UI Store loading started')
    next() // Ensure next is called!
  } catch (e) {
    console.error('Router: beforeEach Error', e)
    next()
  }
})

router.beforeResolve((to, from, next) => {
  const doc = document as unknown as CustomViewTransitionDocument
  console.log('Router: beforeResolve', { to, from, isStart: from === START_LOCATION })

  if (!doc.startViewTransition || from === START_LOCATION) {
    console.log('Router: Skipping view transition')
    next()
    return
  }

  console.log('Router: Starting view transition')
  doc.startViewTransition(async () => {
    next()
    await nextTick()
  })
})

router.afterEach((to) => {
  const { submitMetric } = useMetrics()
  const uiStore = useUIStore()

  uiStore.stopLoading()
  submitMetric('page_view', { path: to.fullPath })
})

router.onError((error) => {
  console.error('Router Error:', error)
  const uiStore = useUIStore()
  uiStore.stopLoading()
})

export default router
