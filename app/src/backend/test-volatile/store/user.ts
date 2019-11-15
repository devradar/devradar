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
  }
})

export default {
  actions
}
