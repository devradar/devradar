import firebase from 'firebase/app'
import 'firebase/firestore'
import { ActionTree } from 'vuex'
import { getUUID, cleanChange, cleanBlip } from '../../../util'
import { Blip, BlipChange, Meta } from '@/types/domain'
import { RootState, BlipsState } from '@/types/vuex'
import router from '@/router'

const actions = (): ActionTree<BlipsState, RootState> => ({
  // return the devradar ID for a given alias (also returns ID if input is already a valid ID)
  async followRadarAlias ({ commit }, alias: string): Promise<string> {
    let response = ''
    let radarSnapshot: any = {}
    try {
      radarSnapshot = await firebase.firestore().collection('radars').doc(alias).get()
    } catch (e) {
      // will throw if an 'alias' parameter is actually a radarId, handle response in the finally block
    } finally {
      if (radarSnapshot.exists) { // provided string is not actually an alias but a valid ID
        response = radarSnapshot.id
      } else {
        const aliasSnapshot = await firebase.firestore().collection('radarAliases')
          .where('alias', '==', alias)
          .limit(1)
          .get()
        if (aliasSnapshot.size === 0) {
          console.error('No devradar found for this alias (or ID):', alias) // eslint-disable-line no-console
          response = ''
        } else {
          const data = aliasSnapshot.docs[0].data()
          response = data.radarId
          commit('setRadarAlias', alias)
        }
      }
    }
    return response
  },
  // check if a given radarId already has an alias
  async findAliasForRadarId ({ commit }, id: string): Promise<string> {
    const aliasSnapshot = await firebase.firestore().collection('radarAliases')
      .where('radarId', '==', id)
      .limit(1)
      .get()
    if (aliasSnapshot.size === 0) {
      return ''
    } else {
      const data = aliasSnapshot.docs[0].data()
      const alias = data.alias
      commit('setRadarAlias', alias)
      return alias
    }
  },
  async getRadar ({ commit, dispatch }, id: string): Promise<void> {
    commit('setLoading', true)

    try {
      const radarSnapshot = await firebase.firestore().collection('radars').doc(id).get()
      const { categories, levels, title, isPublic = false, owner } = radarSnapshot.data()
      commit('setMeta', { title: title || `devradar #${id}`, categories, levels })
      commit('setIsPublic', isPublic)
      commit('setId', id)
      commit('setOwnerId', owner)

      // populate with blip info
      const blipSnapshot = await firebase.firestore().collection(`radars/${radarSnapshot.id}/blips`)
        .limit(100)
        .get()
      commit('dropBlips')
      blipSnapshot.forEach(async doc => {
        // @ts-ignore type checking of docs property
        const blip = cleanBlip(doc.data())
        blip.id = doc.id // ensure that firebase._id is used
        commit('addBlip', blip)
      })
      await dispatch('findAliasForRadarId', id)
    } catch (e) {
      console.error('Error while fetching radar: ', id) // eslint-disable-line no-console
      console.error(e) // eslint-disable-line no-console
    }
    commit('setLoading', false)
  },
  // call getRadar if the id is different from the one currently in state
  async getRadarLazy ({ dispatch, rootGetters }, aliasOrId: string): Promise<void> {
    const loadedId = rootGetters['blips/radarId']
    const radarId = await dispatch('followRadarAlias', aliasOrId)
    if (loadedId !== radarId && radarId !== '') {
      return dispatch('getRadar', radarId)
    }
    return Promise.resolve()
  },
  async addBlip ({ commit, getters }, blip: Blip): Promise<void> {
    commit('setLoading', true)
    // prepend https if nothing is there
    const radarId = getters['radarId']
    const nBlip = cleanBlip(blip)
    const { changes } = blip
    // assign IDs to changes
    nBlip.changes = changes
      .map(c => {
        if (!c.id) c.id = getUUID()
        return c
      })
      .map(cleanChange)
    // TODO: debug missing link/description?
    const setSnapshot = await firebase.firestore().collection(`radars/${radarId}/blips`).add(JSON.parse(JSON.stringify(nBlip))) // JSON parsing to prevent this error from occuring: https://stackoverflow.com/questions/48156234/function-documentreference-set-called-with-invalid-data-unsupported-field-val
    nBlip['id'] = setSnapshot.id
    commit('addBlip', nBlip)
    commit('setLoading', false)
  },
  async updateBlip ({ commit, rootGetters }, blip: Blip): Promise<void> {
    commit('setLoading', true)
    // create copy of the store object to remove changes array/index for firebase entry
    const user = rootGetters['user/user']
    const nBlip = cleanBlip(blip)
    await firebase.firestore().collection(`radars/${user.radar}/blips`).doc(blip.id).update(nBlip)
    commit('exchangeBlip', blip)
    commit('setLoading', false)
  },
  async deleteBlip ({ commit, rootGetters }, blip: Blip): Promise<void> {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    await firebase.firestore().collection(`radars/${user.radar}/blips`).doc(blip.id).delete()
    commit('removeBlip', blip)
    commit('setLoading', false)
  },
  async setBlips ({ commit, rootGetters, dispatch }, blips: Blip[]): Promise<void> {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    // drop entire collection of blips
    const collectionSnapshot = await firebase.firestore().collection(`radars/${user.radar}/blips`).limit(100).get()
    await Promise.all(collectionSnapshot.docs.map(docSnapshot => {
      return firebase.firestore().collection(`radars/${user.radar}/blips`).doc(docSnapshot.id).delete()
    }))
    commit('dropBlips')
    // add all new blips
    await Promise.all(blips.map(cleanBlip).map(b => dispatch('addBlip', b)))
    commit('setLoading', false)
  },
  async addChange ({ commit, rootGetters }, { blip, change }: { blip: Blip; change: BlipChange }): Promise<void> {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    if (!blip['changes']) blip.changes = []
    const newChange = cleanChange(change)
    newChange.id = getUUID()
    blip.changes.push(newChange)
    const nBlip = cleanBlip(blip)
    await firebase.firestore().collection(`radars/${user.radar}/blips`).doc(blip.id).update(nBlip)
    commit('exchangeBlip', blip)
    commit('setLoading', false)
  },
  async deleteChange ({ commit, rootGetters }, { blip, change }: { blip: Blip; change: BlipChange }): Promise<void> {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    blip.changes = blip.changes.filter(c => c.id !== change.id)
    const nBlip = cleanBlip(blip)
    await firebase.firestore().collection(`radars/${user.radar}/blips`).doc(blip.id).update(nBlip)
    commit('exchangeBlip', blip)
    commit('setLoading', false)
  },
  async setMeta ({ commit, rootGetters }, meta: Meta): Promise<void> {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    await firebase.firestore().collection(`radars`).doc(user.radar).update(meta)
    commit('setMeta', meta)
    commit('setLoading', false)
  },
  async getRadarAlias ({ commit, rootGetters }): Promise<void> {
    const user = rootGetters['user/user']
    if (!user || !user.radar) return
    const aliasSnapshot = await firebase.firestore().collection('radarAliases').doc(user.uid).get()
    if (aliasSnapshot.exists) {
      const data = aliasSnapshot.data()
      commit('setRadarAlias', data.alias)
    } else {
      commit('setRadarAlias', '')
    }
  },
  async setRadarAlias ({ commit, rootGetters }, { alias, radarId }: { alias: string; radarId: string }): Promise<void> {
    const user = rootGetters['user/user']
    if (!user || !user.radar) return
    const doc = {
      alias,
      radarId
    }
    await firebase.firestore().collection('radarAliases').doc(user.uid).set(doc)
    commit('setRadarAlias', alias)
    router.push({ name: 'radar', params: { radarId: alias } })
  },
  async isRadarAliasAvailable (_, alias: string): Promise<boolean> {
    const aliasSnapshot = await firebase.firestore().collection('radarAliases')
      .where('alias', '==', alias)
      .limit(1)
      .get()
    return aliasSnapshot.size === 0
  }
})

export default {
  actions
}
