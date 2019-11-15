import { ActionTree } from 'vuex'
import { RootState, UserState } from '@/types/vuex'

const actions = (appConfig): ActionTree<UserState, RootState> =>  ({ // eslint-disable-line @typescript-eslint/no-unused-vars
  oauthLogin (_, payload): void {
  },
  getUserList (_): void {
  },
  setRoles (_, { targetUser }): void {
  }
})

export default {
  actions
}
