import firebase from 'firebase/app'
import 'firebase/firestore'
import { Blip, BlipChange, Meta } from '@/types/domain'
import { ActionTree } from 'vuex'
import { RootState, BlipsState } from '@/types/vuex'

const actions = (): ActionTree<BlipsState, RootState> =>  ({
  async getRadar ({ commit, rootGetters }): Promise<void> {
    const user = rootGetters['user/user']
    if (!user || !user.radar) return
    commit('setLoading', true)
    const radarSnapshot = await firebase.firestore().collection('radars').doc(user.radar).get()
    if (!radarSnapshot.exists) {
      // in case a radar is referenced but was deleted in the meantime; clean up the user account
      await firebase.firestore().collection('users').doc(user.uid).update({ radar: null })
      commit('setLoading', false)
      return
    }
    const { categories, levels, title } = radarSnapshot.data()
    commit('setMeta', { title: title || `${user.name}'s devradar`, categories, levels })
    const blipSnapshot = await firebase.firestore().collection(`radars/${radarSnapshot.id}/blips`).get()
    commit('dropBlips')
    blipSnapshot.forEach(async doc => {
      // @ts-ignore type checking of docs property
      const { title, category, link, level } = doc.data()
      const blip = {
        title,
        category,
        link,
        level,
        id: doc.id,
        changes: []
      }
      const changeSnapshot = await firebase.firestore().collection(`radars/${radarSnapshot.id}/blips/${doc.id}/changes`).get()
      changeSnapshot.forEach(changeDoc => {
        const { date, newLevel, text } = changeDoc.data()
        const change = {
          date,
          newLevel,
          text,
          id: changeDoc.id
        }
        blip.changes.push(change)
      })
      commit('addBlip', blip)
    })
    commit('setLoading', false)
  },
  async addBlip ({ commit, rootGetters, dispatch }, blip: Blip): Promise<void> {
    commit('setLoading', true)
    // prepend https if nothing is there
    const user = rootGetters['user/user']
    const { category, description = '', title } = blip
    let link = blip.link || ''
    if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link
    // handle each change separately to create valid documents
    const changes = blip.changes
    delete blip.changes
    const setSnapshot = await firebase.firestore().collection(`radars/${user.radar}/blips`).add({ category, description, title, link })
    commit('setLoading', false)
    blip.id = setSnapshot.id
    blip.changes = []
    changes.forEach(change => dispatch('addChange', { blip, change }))
  },
  async updateBlip ({ commit, rootGetters }, blip: Blip): Promise<void> {
    commit('setLoading', true)
    // create copy of the store object to remove changes array/index for firebase entry
    const user = rootGetters['user/user']
    const { category, description = '', title } = blip
    let link = blip.link || ''
    // prepend https if nothing is there
    if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link
    await firebase.firestore().collection(`radars/${user.radar}/blips`).doc(blip.id).update({ category, description, title, link })
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
  async setBlips({ commit, rootGetters }, blips: Blip[]): Promise<void> {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    // drop entire collection of blips
    const collectionSnapshot = await firebase.firestore().collection(`radars/${user.radar}/blips`).get()
    await Promise.all(collectionSnapshot.docs.map(docSnapshot => {
      return firebase.firestore().collection(`radars/${user.radar}/blips`).doc(docSnapshot.id).delete()
    }))
    commit('dropBlips')
    // add all new blips
    await Promise.all(blips.map(b => {
      commit('addBlip', b)
      return firebase.firestore().collection(`radars/${user.radar}/blips`).add(b)
    }))
    commit('setLoading', false)
  },
  async addChange ({ commit, rootGetters }, { blip, change }: { blip: Blip; change: BlipChange }): Promise<void> {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    const { date, newLevel, text } = change
    const setSnapshot = await firebase.firestore().collection(`radars/${user.radar}/blips/${blip.id}/changes`).add({ date, newLevel, text })
    change.id = setSnapshot.id
    if (!blip.changes) blip.changes = []
    blip.changes.push(change)
    commit('exchangeBlip', blip)
    commit('setLoading', false)
  },
  async deleteChange ({ commit, rootGetters }, { blip, change }: { blip: Blip; change: BlipChange }): Promise<void> {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    await firebase.firestore().collection(`radars/${user.radar}/blips/${blip.id}/changes`).doc(change.id).delete()
    blip.changes = blip.changes.filter(c => c.id !== change.id)
    commit('exchangeBlip', blip)
    commit('setLoading', false)
  },
  async setMeta({ commit, rootGetters }, meta: Meta): Promise<void> {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    await firebase.firestore().collection(`radars`).doc(user.radar).update(meta)
    commit('setMeta', meta)
    commit('setLoading', false)
  }
})

export default {
  actions
}
