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
    selectBlip (state, item) {
      state.blips.push(item)
    },
    deselectBlip (state, item) {
      const ix = state.blips.findIndex(e => e.title.toLowerCase() === item.title.toLowerCase())
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
