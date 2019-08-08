import Vue from 'vue'

export default (backend) => ({
  state: {
    selectedBlips: [] // only title
  },
  mutations: {
    selectBlip (state, blip) {
      state.selectedBlips.push(blip.title)
    },
    deselectBlip (state, blip) {
      const ix = state.selectedBlips.findIndex(e => e.toLowerCase() === blip.title.toLowerCase())
      Vue.delete(state.selectedBlips, ix)
    }
  },
  actions: backend.store.settings.actions,
  getters: {
    selectedBlipTitles (state) {
      return state.selectedBlips
    }
  }
})
