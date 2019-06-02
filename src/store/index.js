import Vue from 'vue'
import VueX from 'vuex'
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

const store = new VueX.Store({
  modules: {
    users: users(backendActive),
    blips: blips(backendActive)
  }
})

export {
  store,
  backendActive as backend
}
