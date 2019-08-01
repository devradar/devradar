const actions = {
  setCategories ({ commit }, array) {
    commit('setCategories', array)
  },
  setLevels ({ commit }, array) {
    commit('setLevels', array)
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
