import Vue from 'vue'
import appConfig from '../config'

export default (backend) => ({
  state: {
    user: {},
    userList: {}
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setUserList (state, users) {
      state.userList = users
    },
    exchangeUser (state, user) {
      Vue.set(state.userList, user.id, user)
    }
  },
  actions: backend.store.user.actions,
  getters: {
    user (state) {
      return state.user
    },
    userList (state) {
      return state.userList
    },
    userCanEdit (state, getters) {
      const user = getters.user
      return appConfig.editPermissions(user)
    }
  }
})
