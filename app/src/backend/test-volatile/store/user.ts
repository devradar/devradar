import { ActionTree } from 'vuex'
import { RootState, UserState } from '@/types/vuex'
import users from '../mock-data/users'

const actions = (appConfig): ActionTree<UserState, RootState> =>  ({ // eslint-disable-line @typescript-eslint/no-unused-vars
  oauthLogin ({ commit }, payload): void {
    let user
    switch (payload.provider) {
      case 'github':
        user = users['rick']
        break
      default:
        user = users['morty']
    }
    commit('setUser', user)
  },
  getUserList (_): void {
  },
  setRoles (_, { targetUser }): void {
  },
  async logout ({ commit }): Promise<any> {
    commit('blips/setLoading', true, { root: true })
    commit('blips/reset', null, { root: true })
    commit('user/reset', null, { root: true })
    commit('blips/setLoading', false, { root: true })
  }
})

export default {
  actions
}
