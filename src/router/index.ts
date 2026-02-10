import { nextTick } from 'vue'
import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'

import { useMetrics } from '../composables/useMetrics'
import About from '../pages/About.vue'
import Adopt from '../pages/Adopt.vue'
import Contract from '../pages/Contract.vue'
import Donate from '../pages/Donate.vue'
import Home from '../pages/Home.vue'
import NotFound from '../pages/NotFound.vue'
import PetAdoption from '../pages/PetAdoption.vue'
import SurrenderPet from '../pages/SurrenderPet.vue'
import Volunteer from '../pages/Volunteer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/about',
      component: About,
    },
    { path: '/adopt', name: 'adopt-list', component: Adopt },
    {
      path: '/adopt/:id',
      name: 'adopt-pet',
      component: Adopt,
      props: true,
    },
    {
      path: '/donate',
      component: Donate,
    },
    {
      path: '/volunteer',
      component: Volunteer,
    },
    {
      path: '/surrender',
      component: SurrenderPet,
    },
    {
      path: '/pet-adoption/:id',
      component: PetAdoption,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
    {
      path: '/contract/:token',
      name: 'contract-sign',
      component: Contract,
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


router.beforeEach(async () => {
  const uiStore = useUIStore()
  uiStore.startLoading()
})

router.beforeResolve((to, from, next) => {
  const doc = document as unknown as CustomViewTransitionDocument

  if (!doc.startViewTransition || from === START_LOCATION) {
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
