import Vue from 'vue'
import { getUUID, cleanBlip } from '../util'

export default (backend) => ({
  state: {
    blips: [],
    isLoading: false,
    meta: {
      title: 'Rick\'s skillradar',
      categories: ['Tools', 'Techniques', 'Platforms', 'Frameworks'],
      levels: ['Novice', 'Intermediate', 'Advanced', 'Veteran']
    }
  },
  mutations: {
    dropBlips (state) {
      state.blips = []
    },
    addBlip (state, blip) {
      blip.id = blip.id || getUUID()
      blip.changes = blip.changes
        .map(c => Object.assign({ id: getUUID() }, c)) // make sure an existing ID has priority by correct assign order
      state.blips.push(blip)
    },
    exchangeBlip (state, blip) {
      const index = state.blips.findIndex(b => b.id === blip.id)
      state.blips.splice(index, 1, blip)
    },
    removeBlip (state, blip) {
      Vue.delete(state.blips, state.blips.findIndex(b => b.id === blip.id))
    },
    setLoading (state, isLoading) {
      state.isLoading = isLoading
    },
    setMeta (state, meta) {
      const { title, categories, levels } = meta
      state.meta = { title, categories, levels }
    }
  },
  actions: backend.store.blips.actions,
  getters: {
    blipsWithIndex (state) {
      return state.blips
        .filter(b => b.changes.length > 0)
        .map(cleanBlip)
        .map((b, bIndex) => {
          const changes = b.changes.map((c, cIndex) => {
            c.index = cIndex // append a 'fake' index that is used for visuals only e.g. blip# in radar view
            return c
          })
          const level = changes.sort((a, b) => a.date < b.date)[0].newLevel
          b.level = level
          b.index = bIndex
          return b
        })
    },
    blipsClean (state, getters) {
      const blips = JSON.parse(JSON.stringify(getters.blipsWithIndex))
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
    meta (state) {
      return state.meta
    }
  }
})
