// a group of functions that need to be implemented for each backend
//  goal is to provide "shortcuts" during e2e tests
import { store } from '../../store'
import { Blip } from '@/types/domain'

async function login (user = 'rick'): Promise<string> {
  const userId = user + 'UserUid'
  store.commit('blips/setLoading', true)
  // fake async behavior
  setTimeout(() => store.dispatch('user/oauthLogin', { provider: user === 'rick' ? 'github' : 'something' }), 500)
  setTimeout(() => store.dispatch('blips/getRadarLazy', user), 1000)
  return new Promise(resolve => {
    setTimeout(() => resolve(userId), 700)
  })
}

async function addBlip (blip: Blip): Promise<any> {
  return store.dispatch('blips/addBlip', blip)
}

async function dropBlips (): Promise<any> {
  return store.dispatch('blips/setBlips', [])
}

async function getRadarIdByUserId (userId: string): Promise<string> {
  let radarId
  switch (userId) {
    case 'rickUserUid':
      radarId = 'rick' // has 4 blips
      break
    case 'mortyUserUid':
      radarId = 'morty' // has 0 blips
      break
  }
  return Promise.resolve(radarId)
}

export default {
  login,
  addBlip,
  dropBlips,
  getRadarIdByUserId
}
