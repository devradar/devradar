import Vue from 'vue'

// convert to numeric level/category
function string2enum (item) {
  if (!((item || {}).payload || {}).meta) {
    return item
  }
  const levels = item.payload.meta.levels
  const cats = item.payload.meta.categories
  item.payload.blips = item.payload.blips
    .map(b => {
      if (typeof b.level === 'string') {
        b.level = levels.indexOf(b.level)
      }
      if (typeof b.category === 'string') {
        b.category = cats.indexOf(b.category)
      }
      if (b.changes && b.changes.length) {
        b.changes = b.changes
          .map(c => {
            if (typeof c.newLevel === 'string') {
              c.newLevel = levels.indexOf(c.newLevel)
            }
            return c
          })
      }
      return b
    })
  return item
}

function flattenChanges (item) {
  item.payload.blips = item.payload.blips
    .map(b => ({ category: b.category, level: b.changes && b.changes.length ? b.changes.sort((a, b) => a.date < b.date)[0].newLevel : b.level, title: b.title }))
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
    },
    items (state) {
      return [state.team].concat(state.devs)
        .map(string2enum)
        .map(flattenChanges)
    }
  }
})
