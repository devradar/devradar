import Vue from 'vue'
import VueX from 'vuex'
import users from './user'
import blips from './blips'

Vue.use(VueX)

export const store = new VueX.Store({
  modules: {
    users,
    blips
  }
})
