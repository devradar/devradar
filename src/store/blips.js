import firebase from 'firebase/app'
import 'firebase/firestore'
import Vue from 'vue'

export default {
  state: {
    blips: []
  },
  mutations: {
    setBlips (state, blips) {
      state.blips = blips
    },
    addBlip (state, blip) {
      Vue.set(state.blips, blip.id, blip)
    },
    exchangeBlip (state, blip) {
      Vue.set(state.blips, blip.id, blip)
    },
    removeBlip (state, blip) {
      Vue.delete(state.blips, blip.id)
    }
  },
  actions: {
    getBlips ({commit}) {
      let blipsArray
      firebase.firestore().collection('blips').get()
        .then(snapshot => {
          blipsArray = snapshot.docs
            .map(d => Object.assign(d.data(), {id: d.id}))
          return Promise.all(blipsArray.map(b => firebase.firestore().collection(`blips/${b.id}/changes`).get()))
        })
        .then(snapshotArray => {
          for (const [index, snapshot] of snapshotArray.entries()) {
            const changes = snapshot.docs.map(d => Object.assign(d.data(), {id: d.id}))
            blipsArray[index].changes = changes
          }
          const blipsObject = blipsArray
            .filter(b => b.title && b.id)
            .map(b => {
              // b.state = b.changes.filter((a, b) => a.date > b.date)[0].newState
              return b
            })
            .reduce((p, blip) => Object.assign(p, {[blip.id]: blip}), {})
          commit('setBlips', blipsObject)
        })
    },
    addBlip ({commit, dispatch}, {blip, change}) {
      // prepend https if nothing is there
      if (blip.link && !/^https?:\/\//i.test(blip.link)) blip.link = 'https://' + blip.link
      firebase.firestore().collection('blips').add(blip)
        .then(docRef => {
          const id = docRef.id
          blip.id = id
          blip.changes = []
          dispatch('addChange', {blip, change})
        })
    },
    updateBlip ({commit}, blip) {
      // create copy of the store object to remove changes array/index for firebase entry
      const doc = {...blip}
      // prepend https if nothing is there
      if (blip.link && !/^https?:\/\//i.test(doc.link)) doc.link = 'https://' + doc.link
      delete doc.changes
      delete doc.index
      firebase.firestore().collection('blips').doc(blip.id).update(doc)
        .then(() => {
          commit('exchangeBlip', blip)
        })
    },
    deleteBlip ({commit}, blip) {
      firebase.firestore().collection('blips').doc(blip.id).delete()
        .then(() => {
          commit('removeBlip', blip)
        })
    },
    addChange ({commit}, {blip, change}) {
      firebase.firestore().collection(`blips/${blip.id}/changes`).add(change)
        .then(docRef => {
          const id = docRef.id
          change = Object.assign(change, {id})
          blip.changes.push(change)
          commit('exchangeBlip', blip)
        })
    },
    deleteChange ({commit}, {blip, change}) {
      firebase.firestore().collection(`blips/${blip.id}/changes`).doc(change.id).delete()
        .then(() => {
          blip.changes = blip.changes.filter(c => c.id !== change.id)
          commit('exchangeBlip', blip)
        })
    }
  },
  getters: {
    blips (state) {
      return state.blips
    },
    blipsArray (state) {
      const blips = Object.values(state.blips)
        .map((b, index) => Object.assign(b, {index: index + 1}))
      return blips
    }
  }
}
