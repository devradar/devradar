// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import * as fb from 'firebase'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import './stylus/main.styl'
import {store} from './store'

Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.base,
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3
  }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    fb.initializeApp({
      apiKey: 'AIzaSyC3FxfpYywy5ZYpiWuf9nw8_vlbxibpQH8',
      authDomain: 'techradar-f5834.firebaseapp.com',
      databaseURL: 'https://techradar-f5834.firebaseio.com',
      projectId: 'techradar-f5834',
      storageBucket: 'techradar-f5834.appspot.com'
    })
  }
})
