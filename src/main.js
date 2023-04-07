import { createApp } from 'vue'
import App from '@/App.vue'
import router from './router';
import vuetify from '@/plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'



// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(router)


// Mount vue app
app.mount('#app')