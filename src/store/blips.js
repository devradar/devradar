import Vue from 'vue'

export default (backend) => ({
  state: {
    blips: [],
    isLoading: false,
    meta: {
      title: 'Rick\'s skillradar',
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
      state.meta = Object.assign(state.meta, meta)
    }
  },
  actions: backend.store.blips.actions,
  getters: {
    blips (state) {
      return state.blips
        .map(b => {
          const changes = b.changes.map(c => {
            const { date, newState, text } = c
            return { date, newState, text }
          })
          const state = changes.sort((a, b) => a.date < b.date)[0].newState
          const { date, category, link, index, description, title } = b
          return { date, category, link, index, description, title, changes, state }
        })
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
