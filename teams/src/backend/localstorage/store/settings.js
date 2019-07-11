const actions = {
  setCategories ({ commit }, array) {
    commit('setCategories', array)
  },
  setStates ({ commit }, array) {
    commit('setStates', array)
  },
  selectBlip ({ commit }, item) {
    commit('selectBlip', item)
  },
  deselectBlip ({ commit }, item) {
    commit('deselectBlip', item)
  }
}

export default {
  actions
}
