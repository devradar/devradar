const actions = {
  uploadTeam ({ commit }, payload) {
    commit('setTeam', payload)
  },
  uploadDev ({ commit }, payload, ix) {
    if (ix >= -1) {
      commit('replaceDev', payload, ix)
    } else {
      commit('addDev', payload)
    }
  },
  deleteDev ({ commit }, ix) {
    commit('deleteDev', ix)
  }
}

export default {
  actions
}
