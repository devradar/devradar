import Vue from 'vue'
import VueX from 'vuex'
import VuexPersistence from 'vuex-persist'
import { user } from './user'
import { blips } from './blips'
import { comm } from './comm'
import { intro } from './intro'
import appConfig from '../config'
import backend from '../backend/index'
import { UserState, BlipsState, CommState } from '@/types/vuex'

Vue.use(VueX)

const backendActive = backend[appConfig.backend.type]
if (!backendActive) {
  console.error('No valid backend defined. Please choose:', Object.keys(backend)) // eslint-disable-line no-console
}
backendActive.type = appConfig.backend.type

// add local (browser) storage
const storePlugins = []
if (backendActive.type === 'localstorage') {
  storePlugins.push((new VuexPersistence({
    key: 'devradar',
    storage: window.localStorage,
    reducer: (state: {
      user: UserState;
      blips: BlipsState;
      comm: CommState;
    }) => ({ blips: { meta: state.blips.meta, blips: state.blips.blips } })
  })).plugin)
}
const store = new VueX.Store({
  modules: {
    user: user(backendActive),
    blips: blips(backendActive),
    comm: comm(),
    intro: intro()
  },
  plugins: storePlugins
})

export {
  store,
  backendActive as backend
}
