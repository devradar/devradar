import dummy from './dummydata'

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
  },
  loadDummyData ({ commit, dispatch }) {
    commit('setTeam', dummy.items.team)
    dummy.items.team.payload.blips.forEach(blip => dispatch('selectBlip', blip))
    dummy.items.devs.forEach(i => commit('addDev', i))
  }
}

export default {
  actions
}
