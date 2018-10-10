import Vue from 'vue'
import Vuetify from 'vuetify'

import colors from 'vuetify/es5/util/colors'

const themeColor = {
  primary: {
    base: colors.blueGrey.darken1,
    darken1: colors.blueGrey.darken2
  },
  secondary: colors.blueGrey.lighten3
}

Vue.use(Vuetify, {
  theme: themeColor
})
