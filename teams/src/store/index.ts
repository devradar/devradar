import Vue from 'vue'
import VueX, { StoreOptions } from 'vuex'
import VuexPersistence from 'vuex-persist'
import backend from '../backend/index'
import appConfig from '../config'
import { comm } from './comm'
import { items } from './items'
import { settings } from './settings'
import { RootState, ItemsState, SettingsState } from '@/types/vuex'

Vue.use(VueX)

const backendActive = backend[appConfig.backend.type.toLowerCase()]
if (!backendActive) {
  // tslint:disable:no-console
  console.error('No valid backend defined. Please choose:', Object.keys(backend))
  // tslint:enable:no-console
}
backendActive.type = appConfig.backend.type.toLowerCase()

// add local (browser) storage
const storePlugins = []
if (backendActive.type === 'localstorage') {
  storePlugins.push((new VuexPersistence({
    key: 'devradar-teams',
    storage: window.localStorage,
    reducer: (state: {
      items: ItemsState;
      settings: SettingsState;
    }) => ({ items: state.items, settings: state.settings })
  })).plugin)
}

const storeOptions: StoreOptions<RootState> = {
  modules: {
    items: items(backendActive),
    comm: comm(),
    settings: settings(backendActive)
  },
  plugins: storePlugins
}
export const store = new VueX.Store<RootState>(storeOptions)
export { backendActive as backend }
