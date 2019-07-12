// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueAnalytics from 'vue-analytics'
import App from './App'
import router from './router'
import './stylus/main.styl'
import { store, backend } from './store'
import appConfig from './config'

Vue.use(Vuetify, {
  theme: appConfig.theme
})
Vue.config.productionTip = false

if (appConfig.googleAnalytics && appConfig.googleAnalytics.id) {
  Vue.use(VueAnalytics, {
    id: appConfig.googleAnalytics.id,
    disabled: !appConfig.googleAnalytics.enabled,
    debug: {
      // turn on only in prod https://github.com/MatteoGabriele/vue-analytics/blob/9b7125472dc1313823e6c03538434d22b4edad8a/docs/turn-off-development.md
      sendHitTask: process.env.NODE_ENV === 'production'
    }
  })
}

// TODO: remove some time soon
console.log(process.env.NODE_ENV)

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
