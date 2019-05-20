// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* global BLIPS_TOML */ // defined in vue.config.js during app build
import Vue from 'vue'
// import toml from 'toml'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import './stylus/main.styl'
import { store } from './store'
import appConfig from './config'
import fireback from './backend/firebase/index'
import tomlback from './backend/toml/index'

Vue.use(Vuetify, {
  theme: appConfig.theme
})
Vue.config.productionTip = false

Vue.prototype.$config = appConfig
Vue.filter('limitString', function (string, limit = Infinity) {
  return string.slice(0, limit) + (string.length > limit ? '..' : '')
})

let init
switch (appConfig.backend.type.toLowerCase()) {
  case 'firebase':
    init = fireback.init
    break
  case 'toml':
    if (!BLIPS_TOML) {
      console.error('No blips.toml found during build; toml backend misconfigured')
      break
    }
    init = tomlback.init
    break
  default:
    console.error('No backend defined')
}

console.log(BLIPS_TOML)
// only initialize app after auth
init(store)
  .catch(() => Promise.resolve())
  .then(() => {
  /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      render: h => h(App),
      template: '<App/>'
    })
  })
