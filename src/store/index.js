import Vue from 'vue'
import VueX from 'vuex'
import VuexPersistence from 'vuex-persist'
import users from './user'
import blips from './blips'
import appConfig from '../config'
import backend from '../backend/index'

Vue.use(VueX)

const backendActive = backend[appConfig.backend.type.toLowerCase()]
if (!backendActive) {
  console.error('No valid backend defined. Please choose:', Object.keys(backend))
}
backendActive.type = appConfig.backend.type.toLowerCase()

// add local (browser) storage
const storePlugins = []
if (backendActive.type === 'localstorage') {
  console.log('localling')
  storePlugins.push((new VuexPersistence({
    key: 'devradar-blips',
    storage: window.localStorage,
    reducer: (state) => ({ blips: { blips: state.blips.blips } })
  })).plugin)
}
const store = new VueX.Store({
  modules: {
    users: users(backendActive),
    blips: blips(backendActive)
  },
  plugins: storePlugins
})

export {
  store,
  backendActive as backend
}
