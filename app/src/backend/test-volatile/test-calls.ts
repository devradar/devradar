// a group of functions that need to be implemented for each backend
//  goal is to provide "shortcuts" during e2e tests
import { store } from '../../store'
import { Blip } from '@/types/domain'

async function login (): Promise<any> {
  store.commit('blips/setLoading', true)
  setTimeout(() => store.dispatch('user/oauthLogin', { provider: 'github' }), 500)
  setTimeout(() => store.dispatch('blips/getRadarLazy', 'rick'), 1000)
}

async function addBlip (blip: Blip): Promise<any> {
  return store.dispatch('blips/addBlip', blip)
}

async function getRadarIdByUserId (userId: string): Promise<string> {
  let radarId
  switch (userId) {
    case 'rickUserUid':
      radarId = 'rick'
      break
    case 'mortyUserUid':
      radarId = ''
      break
  }
  return Promise.resolve(radarId)
}

export default {
  login,
  addBlip,
  getRadarIdByUserId
}
