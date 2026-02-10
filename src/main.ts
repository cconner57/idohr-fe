import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router/index.js'
import { setupFetchInterceptor } from './utils/fetchInterceptor'

const app = createApp(App)

app.use(createPinia())
app.use(router)

setupFetchInterceptor()

await router.isReady()

app.mount('#app')
