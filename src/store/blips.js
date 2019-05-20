import Vue from 'vue'

export default (backend) => ({
  state: {
    blips: [],
    isLoading: false
  },
  mutations: {
    setBlips (state, blips) {
      state.blips = blips
    },
    addBlip (state, blip) {
      Vue.set(state.blips, blip.id, blip)
    },
    exchangeBlip (state, blip) {
      Vue.set(state.blips, blip.id, blip)
    },
    removeBlip (state, blip) {
      Vue.delete(state.blips, blip.id)
    },
    setLoading (state, isLoading) {
      state.isLoading = isLoading
    }
  },
  actions: backend.store.blips.actions,
  getters: {
    blips (state) {
      return state.blips
    },
    blipsArray (state, getters) {
      return state.blips
    },
    isLoading (state) {
      return state.isLoading
    }
  }
})
