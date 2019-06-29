import Vue from 'vue'
import VueX from 'vuex'
import VuexPersistence from 'vuex-persist'
import blips from './blips'
import comm from './comm'
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
  storePlugins.push((new VuexPersistence({
    key: 'devradar-blips',
    storage: window.localStorage,
    reducer: (state) => ({ blips: { blips: state.blips.blips } })
  })).plugin)

  storePlugins.push((new VuexPersistence({
    key: 'devradar-meta',
    storage: window.localStorage,
    reducer: (state) => ({ blips: { meta: state.blips.meta } })
  })).plugin)
}
const store = new VueX.Store({
  modules: {
    blips: blips(backendActive),
    comm: comm(backendActive)
  },
  plugins: storePlugins
})

export {
  store,
  backendActive as backend
}
