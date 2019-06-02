const actions = {
  getBlips ({ commit }) {
    commit('setBlips', [])
    commit('setLoading', false)
  },
  addBlip ({ commit, dispatch, getters }, { blip, change }) {
    // prepend https if nothing is there
    if (blip.link && !/^https?:\/\//i.test(blip.link)) blip.link = 'https://' + blip.link
    blip.changes = []
    blip.id = getters.getNextID
    blip.index = blip.id
    blip.state = change.newState
    dispatch('addChange', { blip, change })
  },
  updateBlip ({ commit }, blip) {
    commit('exchangeBlip', blip)
  },
  deleteBlip ({ commit }, blip) {
    commit('removeBlip', blip)
  },
  addChange ({ commit }, { blip, change }) {
    change = Object.assign(change, { id: blip.changes.length })
    blip.changes.push(change)
    commit('exchangeBlip', blip)
  },
  deleteChange ({ commit }, { blip, change }) {
    blip.changes = blip.changes.filter(c => c.id !== change.id)
    commit('exchangeBlip', blip)
  }
}

export default {
  actions
}
