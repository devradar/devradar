import Vue from 'vue'
import { Module, GetterTree, MutationTree } from 'vuex'
import { User, LoginState } from '@/types/domain'
import { RootState, UserState } from '@/types/vuex'
import appConfig from '../config'
import router from '../router'

const state: UserState = {
  user: undefined,
  userList: {},
  loginState: LoginState.UNKNOWN
}

const defaultState: UserState = JSON.parse(JSON.stringify(state))

const mutations: MutationTree<UserState> = {
  setUser (state: UserState, payload: User) {
    state.user = payload
  },
  setUserList (state: UserState, users: Record<string, unknown>) {
    state.userList = users
  },
  exchangeUser (state: UserState, user: User) {
    Vue.set(state.userList, user.id, user)
  },
  reset (state: UserState) {
    for (const key in state) {
      state[key] = defaultState[key]
    }
    state.loginState = LoginState.LOGGED_OUT
  },
  setLoginState (state: UserState, loginState: LoginState) {
    state.loginState = loginState
  }
}

const getters: GetterTree<UserState, RootState> = {
  user (state: UserState) {
    return state.user || {}
  },
  radarId (_state: UserState, getters) {
    return getters.user.radar
  },
  userList (state: UserState) {
    return state.userList
  },
  userCanEdit (_state: UserState, getters, _rootState, rootGetters) {
    const user = getters.user
    if (!user || !user.roles || !user.uid) return false
    return user.uid === rootGetters['blips/ownerId']
  },
  loginState (state: UserState) {
    return state.loginState
  }
}

export const user = (backend : any): Module<UserState, RootState> => {
  return {
    namespaced: true,
    state,
    getters,
    actions: backend.store.user(router, appConfig),
    mutations
  }
}
