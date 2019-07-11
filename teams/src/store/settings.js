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
    blips (state) {
      return state.blips
    }
  }
})
