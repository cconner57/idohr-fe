import { createRouter, createWebHistory } from 'vue-router'

import { nextTick } from 'vue'

import { useMetrics } from '../composables/useMetrics'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../pages/Home.vue'),
    },
    {
      path: '/login',
      component: () => import('../pages/Login.vue'),
      meta: { hideNavbar: true },
    },
    {
      path: '/register',
      name: 'register-invite',
      component: () => import('../pages/RegisterFromInvite.vue'),
      meta: { hideNavbar: true },
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
    if (to.path.startsWith('/admin') && savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

type StartViewTransitionOptions = {
  update?: ViewTransitionUpdateCallback
  types?: string[]
}

interface CustomViewTransitionDocument extends Document {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  startViewTransition(
    callback?: ViewTransitionUpdateCallback,
    options?: StartViewTransitionOptions,
  ): any
}

import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const uiStore = useUIStore()

  // Optimization: If restoring admin session with existing credentials, skip loader to prevent flicker
  const isRestoringSession =
    authStore.isAuthenticated && uiStore.isRestored && to.path.startsWith('/admin')

  if (!isRestoringSession) {
    uiStore.startLoading()
  }

  if (!authStore.initialized) {
    if (isRestoringSession) {
      // Optimistic load: Verify in background, don't block navigation
      authStore.initialize().catch(console.error)
    } else {
      await authStore.initialize()
    }
  }

  if (!authStore.user && authStore.isAuthenticated) {
    // previously empty or intended for something. Removing empty block warning.
    // If logic needed, add it. If not, maybe just remove.
    // The original code was:
    // if (!authStore.user && authStore.isAuthenticated) {
    //
    // }
    // I'll just comment it out effectively or remove it if I can see context.
    // Looking at previous context:
    // 197:   if (!authStore.user && authStore.isAuthenticated) {
    // 198:
    // 199:   }
    // It seems safe to remove or comment.
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/admin')
    return
  }

  if (to.path.startsWith('/admin')) {
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }

    // RBAC logic moved to AdminLayout.vue for state-based nav
    next()
    return
  }

  next()
})

router.beforeResolve((to, from, next) => {
  const doc = document as unknown as CustomViewTransitionDocument

  if (!doc.startViewTransition) {
    next()
    return
  }

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

router.onError(() => {
  const uiStore = useUIStore()
  uiStore.stopLoading()
})

export default router
