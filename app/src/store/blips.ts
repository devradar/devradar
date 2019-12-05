import Vue from 'vue'
import { Module, GetterTree, MutationTree } from 'vuex'
import { RootState, BlipsState as RadarState } from '@/types/vuex'
import { Blip, Meta } from '@/types/domain';
import { getUUID, cleanBlip, addBlipLevelFromChanges } from '../util'
import appConfig from '../config'

const state: RadarState = {
  id: '',
  ownerId: '',
  isPublic: false,
  radarAlias: '',
  blips: [],
  isLoading: false,
  meta: {
    title: '',
    categories: [],
    levels: []
  }
}

const defaultState: RadarState = JSON.parse(JSON.stringify(state))

const mutations: MutationTree<RadarState> = {
  dropBlips (state: RadarState) {
    state.blips = []
  },
  addBlip (state: RadarState, blip: Blip) {
    blip.changes = blip.changes
      .map(c => Object.assign({ id: getUUID() }, c)) // make sure an existing ID has priority by correct assign order
    state.blips.push(blip)
  },
  exchangeBlip (state: RadarState, blip: Blip) {
    const index = state.blips.findIndex(b => b.id === blip.id)
    state.blips.splice(index, 1, blip)
  },
  removeBlip (state: RadarState, blip: Blip) {
    Vue.delete(state.blips, state.blips.findIndex(b => b.id === blip.id))
  },
  setLoading (state: RadarState, isLoading: boolean) {
    state.isLoading = isLoading
  },
  setMeta (state: RadarState, meta: Meta) {
    const { title, categories, levels } = meta
    state.meta = { title, categories, levels }
  },
  setRadarAlias (state: RadarState, name: string) {
    state.radarAlias = name
  },
  setOwnerId (state: RadarState, id: string) {
    state.ownerId = id
  },
  setIsPublic (state: RadarState, isPublic: boolean) {
    state.isPublic = isPublic
  },
  setId (state: RadarState, id: string) {
    state.id = id
  },
  reset (state: RadarState) {
    for (const key in state) {
      state[key] = defaultState[key]
    }
  }
}

const getters: GetterTree<RadarState, RootState> = {
  blipsWithIndex (state: RadarState) {
    return state.blips
      .filter(b => b.changes.length > 0 || b.level >= 0)
      .map(cleanBlip)
      .sort((a: Blip, b: Blip) => a.title > b.title ? 1 : -1)
      .map(addBlipLevelFromChanges)
      .map((b, bIndex) => {
        const changes = b.changes.map((c, cIndex) => {
          // append a 'fake' index that is used for visuals only e.g. blip# in radar view
          Object.assign(c, { index: cIndex })
          return c
        })
        Object.assign(b, { index: bIndex })
        return b
      })
  },
  blipsClean (state: RadarState, getters) {
    const blips = JSON.parse(JSON.stringify(getters.blipsWithIndex))
    return blips
      .map(b => {
        delete b.index
        if (b.changes.length) {
          b.changes = b.changes.map(c => {
            delete c.index
            return c
          })
        }
        return b
      })
  },
  isLoading (state: RadarState) {
    return state.isLoading
  },
  meta (state: RadarState) {
    return state.meta
  },
  radarAlias (state: RadarState) {
    return state.radarAlias
  },
  isPublic (state: RadarState) {
    return state.isPublic
  },
  radarId (state: RadarState) {
    return state.id
  },
  ownerId (state: RadarState) {
    return state.ownerId
  },
  isLoaded (state: RadarState) {
    return state.meta.levels.length > 0 && state.id.length > 0
  }
}



export const blips = (backend): Module<RadarState, RootState> => {
  return {
    namespaced: true,
    state,
    getters,
    actions: backend.store.blips.actions(appConfig),
    mutations
  }
}
