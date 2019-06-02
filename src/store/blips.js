import Vue from 'vue'

export default (backend) => ({
  state: {
    blips: [],
    isLoading: false,
    meta: {
      title: '',
      name: 'Noone',
      categories: ['Tools', 'Techniques', 'Platforms', 'Frameworks'],
      states: ['Novice', 'Intermediate', 'Advanced', 'Veteran']
    }
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
    },
    setMeta (state, meta) {
      state.meta = meta
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
    },
    getNextID (state) {
      return state.blips.length
    },
    meta (state) {
      return state.meta
    }
  }
})
