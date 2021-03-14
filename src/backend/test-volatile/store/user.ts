import { ActionTree } from 'vuex'
import Router from 'vue-router'
import { RootState, UserState } from '@/types/vuex'
import { LoginState } from '@/types/domain'
import users from '../mock-data/users'

const actions = (router: Router, appConfig: any): ActionTree<UserState, RootState> => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
  oauthLogin ({ commit, dispatch }, payload): void {
    let user
    switch (payload.provider) {
      case 'github':
        user = users.rick
        break
      default:
        user = users.morty
    }
    commit('setUser', user)
    commit('user/setLoginState', LoginState.LOGGED_IN, { root: true })
    commit('blips/setLoading', false, { root: true })
    dispatch('intro/event', 'login', { root: true })
  },
  getUserList (_context): void {
    // nop
  },
  setRoles (_context, _target): void {
    // nop
  },
  async logout ({ commit }): Promise<any> {
    commit('blips/setLoading', true, { root: true })
    commit('blips/reset', null, { root: true })
    commit('user/reset', null, { root: true })
    commit('user/setLoginState', LoginState.LOGGED_OUT, { root: true })
    commit('blips/setLoading', false, { root: true })
  }
})

export default actions
