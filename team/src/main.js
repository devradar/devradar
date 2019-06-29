// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import toml from 'toml'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import './stylus/main.styl'
import { store, backend } from './store'
import appConfig from './config'

Vue.use(Vuetify, {
  theme: appConfig.theme
})
Vue.config.productionTip = false

Vue.prototype.$config = appConfig
Vue.filter('limitString', function (string, limit = Infinity) {
  return string.slice(0, limit) + (string.length > limit ? '..' : '')
})

backend.init(store)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  render: h => h(App),
  template: '<App/>'
})
