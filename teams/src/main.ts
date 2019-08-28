// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import toml from 'toml'
import Vuetify from 'vuetify'
import App from './App.vue'
import appConfig from './config'
import router from './router'
import { backend, store } from './store'
import './stylus/main.styl'

Vue.use(Vuetify, {
  theme: appConfig.theme
})
Vue.config.productionTip = false

Vue.prototype.$config = appConfig
Vue.filter('limitString', (str, limit = Infinity) => {
  return str.slice(0, limit) + (str.length > limit ? '..' : '')
})

backend.init(store)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  render: (h) => h(App),
  template: '<App/>'
})
