import Vue from 'vue'
import { Module, GetterTree, MutationTree } from 'vuex'
import { User } from '@/types/domain'
import { RootState, UserState } from '@/types/vuex'
import appConfig from '../config'

const mutations: MutationTree<UserState> = {
  setUser (state: UserState, payload: User) {
    state.user = payload
  },
  setUserList (state: UserState, users: any) {
    state.userList = users
  },
  exchangeUser (state: UserState, user: User) {
    Vue.set(state.userList, user.id, user)
  }
}

const getters: GetterTree<UserState, RootState> = {
  user (state: UserState) {
    return state.user || {}
  },
  userList (state: UserState) {
    return state.userList
  },
  userCanEdit (state: UserState, getters) {
    const user = getters.user
    if (!user || !user.roles) return false
    return appConfig.editPermissions(user)
  }
}

const state: UserState = {
  user: undefined,
  userList: {}
}

export const user = (backend): Module<UserState, RootState> => {
  return {
    namespaced: true,
    state,
    getters,
    actions: backend.store.user.actions(appConfig),
    mutations
  }
}
