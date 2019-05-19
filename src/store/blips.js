import Vue from 'vue'
import fireback from '../backend/firebase/index'

export default {
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
  actions: fireback.store.actions,
  getters: {
    blips (state) {
      const blips = state.blips
      let ix = 1
      for (const id in blips) {
        const b = blips[id]
        b.index = ix++
        b.state = b.changes.sort((a, b) => a.date < b.date)[0].newState
      }
      return blips
    },
    blipsArray (state, getters) {
      const blips = Object.values(getters.blips)
      return blips
    },
    isLoading (state) {
      return state.isLoading
    }
  }
}
