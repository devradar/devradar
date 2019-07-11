import Vue from 'vue'

export default (backend) => ({
  state: {
    categories: [],
    states: [],
    blips: []
  },
  mutations: {
    setCategories (state, array) {
      state.categories = array
    },
    setStates (state, array) {
      state.states = array
    },
    addBlip (state, item) {
      state.blips.push(item)
    },
    deleteBlip (state, ix) {
      Vue.delete(state.blips, ix)
    }
  },
  actions: backend.store.settings.actions,
  getters: {
    categories (state) {
      return state.categories
    },
    states (state) {
      return state.states
    },
    selectedBlips (state) {
      return state.blips
    }
  }
})
