import Vue from 'vue'

// convert to numeric state/category
function string2enum (item) {
  if (!((item || {}).payload || {}).meta) {
    return item
  }
  const states = item.payload.meta.states
  const cats = item.payload.meta.categories
  item.payload.blips = item.payload.blips
    .map(b => {
      if (typeof b.state === 'string') {
        b.state = states.indexOf(b.state)
      }
      if (typeof b.category === 'string') {
        b.category = cats.indexOf(b.category)
      }
      b.changes = b.changes
        .map(c => {
          if (typeof c.newState === 'string') {
            c.newState = states.indexOf(c.newState)
          }
          return c
        })
      return b
    })
  return item
}

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
      return string2enum(state.team) || { filename: 'N/A', title: 'Upload your team competence radar on the right ➡️' }
    },
    devs (state) {
      return state.devs.map(string2enum)
    },
    hasItems (state) {
      return state.team && state.team.filename !== 'N/A' && !!state.devs.length
    }
  }
})
