import Vue from 'vue'
import Vuetify from 'vuetify'

import colors from 'vuetify/es5/util/colors'

const themeColor = {
  primary: {
    base: colors.blue.darken3,
    darken1: colors.blue.darken4
  },
  secondary: colors.indigo
}

Vue.use(Vuetify, {
  theme: themeColor
})
