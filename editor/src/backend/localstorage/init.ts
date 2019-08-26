function init (store) {
  // fetch states
  store.dispatch('blips/getBlips')

  // set user as not logged in
  store.commit('user/setUser', { roles: {} })
  return Promise.resolve() // mock async interface
}

export default init
