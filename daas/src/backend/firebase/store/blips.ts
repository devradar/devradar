import firebase from 'firebase/app'
import 'firebase/firestore'
import { Blip, BlipChange } from '@/types/domain'
import { ActionTree } from 'vuex'
import { RootState, BlipsState } from '@/types/vuex'

const actions = (appConfig): ActionTree<BlipsState, RootState> =>  ({
  async getRadar ({ commit, rootGetters }): Promise<void> {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    console.log('geradar', rootGetters)
    if (!user || !user.radar) return
    const radarSnapshot = await firebase.firestore().collection('radars').doc(user.radar).get()
    const { categories, levels } = radarSnapshot.data()
    commit('setMeta', { title: `${user.name}'s devradar`, categories, levels })
    const blipSnapshot = await firebase.firestore().collection(`radars/${radarSnapshot.id}/blips`).get()
    commit('dropBlips')
    for (const doc of blipSnapshot.docChanges()) {
      // @ts-ignore type checking of docs property
      const { title, category, level, link } = doc.doc.data()
      const blip = {
        title,
        category,
        level,
        link,
        id: doc.doc.id
      }
      commit('addBlip', blip)
    }
    commit('setLoading', false)
  },
  addBlip ({ commit, rootGetters, dispatch }, blip: Blip): void {
    commit('setLoading', true)
    // prepend https if nothing is there
    const user = rootGetters['user/user']
    const { category, description, title } = blip
    let link = blip.link
    if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link
    // handle each change separately to create valid documents
    const changes = blip.changes
    delete blip.changes
    firebase.firestore().collection(`radars/${user.radar}/blips`).add({ category, description, title, link })
      .then(docRef => {
        blip.id = docRef.id
        blip.changes = []
        changes.forEach(change => dispatch('addChange', { blip, change }))
        commit('setLoading', false)
      })
  },
  updateBlip ({ commit, rootGetters }, blip: Blip): void {
    commit('setLoading', true)
    // create copy of the store object to remove changes array/index for firebase entry
    const user = rootGetters['user/user']
    const { category, description, title } = blip
    let link = blip.link
    // prepend https if nothing is there
    if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link
    firebase.firestore().collection(`radars/${user.radar}/blips`).doc(blip.id).update({ category, description, title, link })
      .then(() => {
        commit('exchangeBlip', blip)
        commit('setLoading', false)
      })
  },
  deleteBlip ({ commit, rootGetters }, blip: Blip): void {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    firebase.firestore().collection(`radars/${user.radar}/blips`).doc(blip.id).delete()
      .then(() => {
        commit('removeBlip', blip)
        commit('setLoading', false)
      })
  },
  addChange ({ commit, rootGetters }, { blip, change }: { blip: Blip; change: BlipChange }): void {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    const { date, newLevel, text } = change
    firebase.firestore().collection(`radars/${user.radar}/blips/${blip.id}/changes`).add({ date, newLevel, text })
      .then(docRef => {
        change.id = docRef.id
        blip.changes.push(change)
        commit('exchangeBlip', blip)
        commit('setLoading', false)
      })
  },
  deleteChange ({ commit, rootGetters }, { blip, change }: { blip: Blip; change: BlipChange }): void {
    commit('setLoading', true)
    const user = rootGetters['user/user']
    firebase.firestore().collection(`radars/${user.radar}/blips/${blip.id}/changes`).doc(change.id).delete()
      .then(() => {
        blip.changes = blip.changes.filter(c => c.id !== change.id)
        commit('exchangeBlip', blip)
        commit('setLoading', false)
      })
  }
})

export default {
  actions
}
