const actions = {
  selectBlip ({ commit }, blip) {
    commit('selectBlip', blip)
  },
  deselectBlip ({ commit }, blip) {
    commit('deselectBlip', blip)
  }
}

export default {
  actions
}
