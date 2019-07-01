import Vue from 'vue'

export default (backend) => ({
  state: {
    snackbar: {
      text: '',
      active: false
    }
  },
  mutations: {
    setSnackbar (state, text) {
      Vue.set(state.snackbar, 'text', text)
      Vue.set(state.snackbar, 'active', true)
    }
  },
  actions: {
    showSnackbar ({ commit }, text) {
      commit('setSnackbar', text)
    }
  },
  getters: {
    snackbar (state) {
      return state.snackbar
    }
  }
})
