import firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  state: {
    blips: []
  },
  mutations: {
    setBlips (state, blips) {
      state.blips = blips
    },
    addBlip (state, blip) {
      state.blips.push(blip)
    }
  },
  actions: {
    getBlips ({commit}) {
      let blips
      firebase.firestore().collection('blips').get()
        .then(snapshot => {
          blips = snapshot.docs
            .map(d => Object.assign(d.data(), {id: d.id}))
          return Promise.all(blips.map(b => firebase.firestore().collection(`blips/${b.id}/changes`).get()))
        })
        .then(snapshotArray => {
          for (const [index, snapshot] of snapshotArray.entries()) {
            const changes = snapshot.docs.map(d => Object.assign(d.data(), {id: d.id}))
            blips[index].changes = changes
          }
          commit('setBlips', blips)
        })
    },
    addBlip ({commit}, payload) {
      firebase.firestore().collection('blips').add(payload)
        .then(docRef => {
          const id = docRef.id
          commit('addBlip', Object.assign(payload, {id}))
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
        .map((b, index) => Object.assign(b, {index: index + 1}))
    }
  }
}
