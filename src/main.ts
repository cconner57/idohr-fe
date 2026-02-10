import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router/index'
import { setupFetchInterceptor } from './utils/fetchInterceptor'

const app = createApp(App)

app.use(createPinia())
app.use(router)

console.log('App: Initializing...')
setupFetchInterceptor()

// Add initialization timeout warning
setTimeout(() => {
  const el = document.getElementById('debug-error')
  if (el && el.style.display !== 'block') {
    el.style.display = 'block'
    el.innerHTML += '<h3>⚠️ App Initialization:</h3> Router is taking too long to load. Likely stuck in deadlock.<hr>'
    console.warn('App: Router is taking too long to initialize. Possible deadlock.');
  }
}, 3000)

console.log('App: Waiting for router...')
await router.isReady()
console.log('App: Router ready, mounting...')

app.mount('#app')
console.log('App: Mounted.')
