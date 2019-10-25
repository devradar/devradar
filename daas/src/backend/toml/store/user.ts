import { ActionTree } from 'vuex'
import { RootState, UserState } from '@/types/vuex'

const actions = (appConfig): ActionTree<UserState, RootState> =>  ({ // eslint-disable-line @typescript-eslint/no-unused-vars
  oauthLogin (): void {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  getUserList (): void{
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  setRoles (): void {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  }
})

export default {
  actions
}
