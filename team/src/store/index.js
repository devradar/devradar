import Vue from 'vue'
import VueX from 'vuex'
import VuexPersistence from 'vuex-persist'
import items from './items'
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
    key: 'devradar-teams',
    storage: window.localStorage,
    reducer: (state) => ({ items: { items: state.items.items } })
  })).plugin)
}
const store = new VueX.Store({
  modules: {
    items: items(backendActive),
    comm: comm(backendActive)
  },
  plugins: storePlugins
})

export {
  store,
  backendActive as backend
}
