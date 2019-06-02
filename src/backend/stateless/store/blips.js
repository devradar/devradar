const actions = {
  getBlips ({ commit }) {
    commit('setBlips', [])
  },
  addBlip ({ commit, dispatch }, { blip, change }) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  updateBlip ({ commit }, blip) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  deleteBlip ({ commit }, blip) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  addChange ({ commit }, { blip, change }) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  deleteChange ({ commit }, { blip, change }) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  }
}

export default {
  actions
}
