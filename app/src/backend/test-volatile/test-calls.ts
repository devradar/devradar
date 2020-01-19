// a group of functions that need to be implemented for each backend
//  goal is to provide "shortcuts" during e2e tests
import { store } from '../../store'
import { Blip } from '@/types/domain'

async function login (): Promise<any> {
  await store.dispatch('user/oauthLogin', { provider: 'github' })
  return store.dispatch('blips/getRadarLazy', 'rick')
}

async function addBlip (radarId: string, blip: Blip): Promise<any> {
  return store.dispatch('blips/addBlip', blip)
}

export default {
  login,
  addBlip
}
