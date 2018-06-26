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
      state.blips[blip.id] = blip
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
          const blipsObject = blipsArray.reduce((p, blip) => Object.assign(p, {[blip.id]: blip}), {})
          commit('setBlips', blipsObject)
        })
    },
    addBlip ({commit}, payload) {
      firebase.firestore().collection('blips').add(payload)
        .then(docRef => {
          const id = docRef.id
          commit('addBlip', Object.assign(payload, {id}))
        })
    },
    updateBlip ({commit}, blip) {
      firebase.firestore().collection('blips').doc(blip.id).update(blip)
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
    addChange ({commit}, blip, change) {
      firebase.firestore().collection(`blips/${blip.id}/changes`).add(change)
        .then(docRef => {
          const id = docRef.id
          change = Object.assign(change, {id})
          blip.changes.push(change)
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
