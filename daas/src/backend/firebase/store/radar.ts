import firebase from 'firebase/app'
import 'firebase/firestore'
import { Blip, BlipChange, Radar } from '@/types/domain'
import { ActionTree } from 'vuex'
import { RootState, BlipsState } from '@/types/vuex'

const actions = (appConfig): ActionTree<BlipsState, RootState> =>  ({
  async getRadar ({ commit, getters }): Promise<void> {
    commit('setLoading', true)
    const user = getters['users/user']
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
  }
})

export default {
  actions
}
