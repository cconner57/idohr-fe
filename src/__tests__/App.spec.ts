import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect,it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

import App from '../App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>Home</div>' },
    },
  ],
})

describe('App', () => {
  it('mounts properly', async () => {
    const wrapper = mount(App, {
      shallow: true,
      global: {
        plugins: [
          createTestingPinia({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            createSpy: (fn?: any) => fn ?? (() => {}),
          }),
          router,
        ],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })
})
