import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { setupFetchInterceptor } from './utils/fetchInterceptor'

const app = createApp(App)

app.use(createPinia())
app.use(router)

console.log('App: Initializing...')
setupFetchInterceptor()

console.log('App: Waiting for router...')
await router.isReady()
console.log('App: Router ready, mounting...')

app.mount('#app')
console.log('App: Mounted.')
