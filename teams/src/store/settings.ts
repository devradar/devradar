import Vue from 'vue'
import { Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { Blip } from '@/types/domain'
import { RootState, SettingsState } from '@/types/vuex'

const mutations: MutationTree<SettingsState> = {
  selectBlip (state, blip: Blip): void {
    state.selectedBlipsTitle.push(blip.title)
  },
  deselectBlip (state, blip: Blip): void {
    const ix = state.selectedBlipsTitle.findIndex((e): boolean => e.toLowerCase() === blip.title.toLowerCase())
    Vue.delete(state.selectedBlipsTitle, ix)
  }
}

const getters: GetterTree<SettingsState, RootState> = {
  selectedBlipsTitle (state): string[] {
    return state.selectedBlipsTitle
  }
}

const state: SettingsState = {
  selectedBlipsTitle: []
}

export const settings = (backend: { store: { settings: { actions: ActionTree<SettingsState, RootState> }}}): Module<SettingsState, RootState> => {
  return {
    namespaced: true,
    state,
    getters,
    actions: backend.store.settings.actions,
    mutations
  }
}