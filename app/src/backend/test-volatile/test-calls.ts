// a group of functions that need to be implemented for each backend
//  goal is to provide "shortcuts" during e2e tests
import { store } from '../../store'

async function login (): Promise<any> {
  store.dispatch('user/oauthLogin', { provider: 'github' })
  store.dispatch('blips/getRadarLazy', 'rick')
}

export default {
  login
}