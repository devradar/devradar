import Vue from 'vue'

export default (backend) => ({
  state: {
    team: undefined,
    devs: []
  },
  mutations: {
    setTeam (state, item) {
      state.team = item
    },
    addDev (state, item) {
      state.devs.push(item)
    },
    replaceDev (state, item, ix) {
      state.devs.splice(ix, 1, item)
    },
    deleteDev (state, ix) {
      Vue.delete(state.devs, ix)
    }
  },
  actions: backend.store.items.actions,
  getters: {
    team (state) {
      return state.team
    },
    devs (state) {
      return state.devs
    }
  }
})
