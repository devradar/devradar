import Vue from 'vue'
import { Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { Blip, Item } from '@/types/domain'
import { RootState, ItemsState } from '@/types/vuex'

// convert to numeric level/category
function string2enum (item: Item) {
  if (!item || !item.payload || !item.payload.meta) {
    return item
  }
  const levels = item.payload.meta.levels
  const cats = item.payload.meta.categories
  item.payload.blips = item.payload.blips
    .map((b: Blip) => {
      if (typeof b.level === 'string') {
        b.level = levels.indexOf(b.level)
      }
      if (typeof b.category === 'string') {
        b.category = cats.indexOf(b.category)
      }
      if (b.changes && b.changes.length) {
        b.changes = b.changes
          .map((c) => {
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

function flattenChanges (item: Item) {
  item.payload.blips = item.payload.blips
    .map((blip: Blip) => ({
      category: blip.category,
      level: blip.changes && blip.changes.length ? blip.changes
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].newLevel : blip.level,
      title: blip.title
    }))
  return item
}

const mutations: MutationTree<ItemsState> = {
  setTeam (state: ItemsState, item: Item) {
    state.team = item
  },
  addDev (state: ItemsState, item: Item) {
    state.devs.push(item)
  },
  deleteDev (state: ItemsState, ix: number) {
    Vue.delete(state.devs, ix)
  }
}

const getters: GetterTree<ItemsState, RootState> = {
  team (state: ItemsState) {
    return string2enum(state.team) || { filename: 'N/A', title: 'Upload your team competence radar on the right ➡️' }
  },
  devs (state: ItemsState) {
    return state.devs.map(string2enum)
  },
  hasItems (state: ItemsState) {
    return state.team && state.team.filename !== 'N/A' && !!state.devs.length
  },
  items (state: ItemsState) {
    return [state.team].concat(state.devs)
      .map(string2enum)
      .map(flattenChanges)
  }
}

const state: ItemsState = {
  team: undefined,
  devs: []
}

export const items = (backend: { store: { items: { actions: ActionTree<ItemsState, RootState> }}}): Module<ItemsState, RootState> => {
  return {
    namespaced: true,
    state,
    getters,
    actions: backend.store.items.actions,
    mutations
  }
}