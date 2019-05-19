// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import toml from 'toml'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import './stylus/main.styl'
import { store } from './store'
import appConfig from './config'
import fireback from './backend/firebase/index'

Vue.use(Vuetify, {
  theme: appConfig.theme
})
Vue.config.productionTip = false

Vue.prototype.$config = appConfig
Vue.filter('limitString', function (string, limit = Infinity) {
  return string.slice(0, limit) + (string.length > limit ? '..' : '')
})

let init
switch (appConfig.backend.type.toLocaleLowerCase()) {
  case 'firebase':
    init = fireback.init
    break
  default:
    console.error('No backend defined')
}

// function init () {
//   if (appConfig.backend.type === 'firebase') {

//   } else {
//     // local file storage
//     const content =
//     const content = fs.readFileSync(appConfig.backend.file, 'utf8')
//     const data = toml.parse(content)
//     console.log(data)
//   }
// }

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
