import Vue from 'vue'
import { Module, GetterTree, MutationTree } from 'vuex'
import { RootState, BlipsState } from '@/types/vuex'
import { Blip, Meta } from '@/types/domain';
import { getUUID, cleanBlip } from '../util'
import appConfig from '../config'

const mutations: MutationTree<BlipsState> = {
  dropBlips (state: BlipsState) {
    state.blips = []
  },
  addBlip (state: BlipsState, blip: Blip) {
    blip.id = blip.id || getUUID()
    blip.changes = blip.changes
      .map(c => Object.assign({ id: getUUID() }, c)) // make sure an existing ID has priority by correct assign order
    state.blips.push(blip)
  },
  exchangeBlip (state: BlipsState, blip: Blip) {
    const index = state.blips.findIndex(b => b.id === blip.id)
    state.blips.splice(index, 1, blip)
  },
  removeBlip (state: BlipsState, blip: Blip) {
    Vue.delete(state.blips, state.blips.findIndex(b => b.id === blip.id))
  },
  setLoading (state: BlipsState, isLoading: boolean) {
    state.isLoading = isLoading
  },
  setMeta (state: BlipsState, meta: Meta) {
    const { title, categories, levels } = meta
    state.meta = { title, categories, levels }
  }
}

const getters: GetterTree<BlipsState, RootState> = {
  blipsWithIndex (state: BlipsState) {
    return state.blips
      .filter(b => b.changes.length > 0)
      .map(cleanBlip)
      .sort((a: Blip, b: Blip) => a.title > b.title ? 1 : -1)
      .map((b, bIndex) => {
        const changes = b.changes.map((c, cIndex) => {
          // append a 'fake' index that is used for visuals only e.g. blip# in radar view
          Object.assign(c, { index: cIndex })
          return c
        })
        const level = changes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].newLevel
        b.level = level
        Object.assign(b, { index: bIndex })
        return b
      })
  },
  blipsClean (state: BlipsState, getters) {
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
  isLoading (state: BlipsState) {
    return state.isLoading
  },
  meta (state: BlipsState) {
    return state.meta
  }
}

const state: BlipsState = {
  blips: [],
  isLoading: false,
  meta: {
    title: 'Rick\'s skillradar',
    categories: ['Tools', 'Techniques', 'Platforms', 'Frameworks'],
    levels: ['Novice', 'Intermediate', 'Advanced', 'Veteran']
  }
}

export const blips = (backend): Module<BlipsState, RootState> => {
  return {
    namespaced: true,
    state,
    getters,
    actions: backend.store.blips.actions(appConfig),
    mutations
  }
}
