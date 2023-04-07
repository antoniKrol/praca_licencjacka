import { createVuetify } from 'vuetify'
import defaults from './defaults'
import theme from './theme'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    defaults,
    theme,
    components,
    directives,
})