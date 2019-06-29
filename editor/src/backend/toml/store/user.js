const actions = {
  oauthLogin ({ commit }, payload) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  getUserList ({ commit }) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  setRoles ({ commit }, { targetUser }) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  }
}

export default {
  actions
}
