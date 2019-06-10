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
      state.blips.push(blip)
    },
    exchangeBlip (state, blip) {
      state.blips.splice(blip.index, 1, blip)
    },
    removeBlip (state, blip) {
      Vue.delete(state.blips, blip.index)
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
        .filter(b => b.changes.length > 0)
        .map((b, fakeIx) => {
          const changes = b.changes.map(c => {
            const { date, newState, text } = c
            return { date, newState, text }
          })
          const state = changes.sort((a, b) => a.date < b.date)[0].newState
          const { date, category, link, index, description, title } = b
          return { date, category, link, index: fakeIx, description, title, changes, state }
        })
    },
    isLoading (state) {
      return state.isLoading
    },
    blipsCount (state) {
      return state.blips.length
    },
    meta (state) {
      return state.meta
    }
  }
})
