import Vue from 'vue'

export default (backend) => ({
  state: {
    categories: [],
    levels: [],
    blips: []
  },
  mutations: {
    setCategories (state, array) {
      state.categories = array
    },
    setLevels (state, array) {
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
    levels (state) {
      return state.levels
    },
    selectedBlips (state) {
      return state.blips
    }
  }
})
