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
        .map((b, bIndex) => {
          const changes = b.changes.map((c, cIndex) => {
            const { date, newState, text } = c
            return { date, newState, text, index: cIndex }
          })
          const state = changes.sort((a, b) => a.date < b.date)[0].newState
          const { category, link, description, title } = b
          return { category, link, index: bIndex, description, title, changes, state }
        })
    },
    blipsClean (state, getters) {
      const blips = JSON.parse(JSON.stringify(getters.blips))
      return blips
        .map(b => {
          delete b.index
          b.changes = b.changes.map(c => {
            delete c.index
            return c
          })
          return b
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
