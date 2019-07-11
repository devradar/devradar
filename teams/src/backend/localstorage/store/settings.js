const actions = {
  setCategories ({ commit }, array) {
    commit('setCategories', array)
  },
  setStates ({ commit }, array) {
    commit('setStates', array)
  },
  addBlip ({ commit }, item) {
    commit('addBlip', item)
  }
}

export default {
  actions
}
