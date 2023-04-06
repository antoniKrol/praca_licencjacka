import { createApp } from 'vue'
import App from './App.vue'


// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Vue Router
import router from './router';


const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            themes: {
                light: {
                    primary: '#1976D2',
                    secondary: '#424242',

                },
                dark: {
                    primary: '#2196F3',
                    secondary: '#424242',

                },
            },
        },
    },
})

createApp(App).use(vuetify).use(router).mount('#app')