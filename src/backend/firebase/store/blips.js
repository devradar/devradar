import firebase from 'firebase/app'
import 'firebase/firestore'
import appConfig from '../../../config'

const actions = {
  getBlips ({ commit }) {
    commit('setLoading', true)
    let blipsArray
    firebase.firestore().collection('blips').get()
      .then(snapshot => {
        blipsArray = snapshot.docs
          .map(d => Object.assign(d.data(), { id: d.id }))
        return Promise.all(blipsArray.map(b => firebase.firestore().collection(`blips/${b.id}/changes`).get()))
      })
      .then(snapshotArray => {
        for (const [index, snapshot] of snapshotArray.entries()) {
          const changes = snapshot.docs.map(d => Object.assign(d.data(), { id: d.id }))
          blipsArray[index].changes = changes
        }
        blipsArray = blipsArray
          .filter(b => b.title && b.id)
          .filter(b => b.changes && b.changes.length > 0)
          .map((b, ix) => {
            b.index = ix + 1
            return b
          })
        commit('setBlips', blipsArray)
        commit('setLoading', false)
      })
  },
  addBlip ({ commit, dispatch }, { blip, change }) {
    // prepend https if nothing is there
    commit('setLoading', true)
    if (blip.link && !/^https?:\/\//i.test(blip.link)) blip.link = 'https://' + blip.link
    firebase.firestore().collection('blips').add(blip)
      .then(docRef => {
        const id = docRef.id
        blip.id = id
        blip.changes = []
        dispatch('addChange', { blip, change })
        commit('setLoading', false)
      })
  },
  updateBlip ({ commit }, blip) {
    commit('setLoading', true)
    // create copy of the store object to remove changes array/index for firebase entry
    const doc = { ...blip }
    // prepend https if nothing is there
    if (blip.link && !/^https?:\/\//i.test(doc.link)) doc.link = 'https://' + doc.link
    delete doc.changes
    delete doc.index
    firebase.firestore().collection('blips').doc(blip.id).update(doc)
      .then(() => {
        commit('exchangeBlip', blip)
        commit('setLoading', false)
      })
  },
  deleteBlip ({ commit }, blip) {
    commit('setLoading', true)
    firebase.firestore().collection('blips').doc(blip.id).delete()
      .then(() => {
        commit('removeBlip', blip)
        commit('setLoading', false)
      })
  },
  addChange ({ commit }, { blip, change }) {
    commit('setLoading', true)
    firebase.firestore().collection(`blips/${blip.id}/changes`).add(change)
      .then(docRef => {
        const id = docRef.id
        change = Object.assign(change, { id })
        blip.changes.push(change)
        commit('exchangeBlip', blip)
        commit('setLoading', false)
      })
  },
  deleteChange ({ commit }, { blip, change }) {
    commit('setLoading', true)
    firebase.firestore().collection(`blips/${blip.id}/changes`).doc(change.id).delete()
      .then(() => {
        blip.changes = blip.changes.filter(c => c.id !== change.id)
        commit('exchangeBlip', blip)
        commit('setLoading', false)
      })
  },
  getMeta ({ commit }) {
    const { title, states, categories } = appConfig.backend
    const meta = { title, states, categories }
    commit('setMeta', meta)
  }
}

export default {
  actions
}
