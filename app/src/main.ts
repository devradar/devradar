import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import Vuetify from 'vuetify'
import VueTour from 'vue-tour'
import App from './App.vue'
import router from './router'
import { store, backend } from './store'
import appConfig from './config'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vue-tour/dist/vue-tour.css'

Vue.use(Vuetify)
Vue.use(VueTour)

const vuetifyOpts = {
  theme: appConfig.theme
}

Vue.config.productionTip = false

if ('googleAnalytics' in appConfig && 'id' in appConfig['googleAnalytics']) {
  Vue.use(VueAnalytics, {
    id: appConfig['googleAnalytics']['id'],
    disabled: !appConfig['googleAnalytics']['enabled'],
    debug: {
      // turn on only in prod https://github.com/MatteoGabriele/vue-analytics/blob/9b7125472dc1313823e6c03538434d22b4edad8a/docs/turn-off-development.md
      sendHitTask: process.env.NODE_ENV === 'production'
    },
    router
  })
}

Vue.filter('limitString', function (str: string, limit = Infinity) {
  return str.slice(0, limit) + (str.length > limit ? '..' : '')
})

backend.init(store, appConfig)

const app = new Vue({
  router,
  store,
  render: h => h(App),
  template: '<App/>',
  vuetify: new Vuetify(vuetifyOpts)
})
app.$mount('#app')

if (appConfig.isUnderTest) {
  window['app'] = app
  window['backend'] = backend
  console.warn(`Running in Test Mode with Backend: ${backend.type}`) // eslint-disable-line no-console
  console.log('Backend Configuration', appConfig.backend) // eslint-disable-line no-console
}
