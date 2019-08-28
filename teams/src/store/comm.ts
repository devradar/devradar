import Vue from 'vue'
import { Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState, CommState } from '@/types/vuex'

const actions: ActionTree<CommState, RootState> = {
  showSnackbar ({ commit }, text: string): void {
    commit('setSnackbar', text)
  }
}
const mutations: MutationTree<CommState> = {
  setSnackbar (state, text): void {
    Vue.set(state.snackbar, 'text', text)
    Vue.set(state.snackbar, 'active', true)
  }
}

const getters: GetterTree<CommState, RootState> = {
  snackbar (state) {
    return state.snackbar
  }
}

const state: CommState = {
  snackbar: {
    text: '',
    active: false
  }
}

export const comm = (): Module<CommState, RootState> => {
  return {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }
}