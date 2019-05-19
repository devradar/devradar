import Vue from 'vue'
import VueX from 'vuex'
import users from './user'
import blips from './blips'
import appConfig from '../config'
import fireback from '../backend/firebase/index'

Vue.use(VueX)

let backend
switch (appConfig.backend.type.toLocaleLowerCase()) {
  case 'firebase':
    backend = fireback
    break
}

export const store = new VueX.Store({
  modules: {
    users: users(backend),
    blips: blips(backend)
  }
})
