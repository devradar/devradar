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
      firebase.firestore().collection('blips').get()
        .then(snapshot => {
          const blips = snapshot.docs.map(d => Object.assign(d.data(), {id: d.id}))
          commit('setBlips', blips)
        })
    },
    addBlip ({commit}, payload) {
      firebase.firestore().collection('blips').add(payload)
        .then(docRef => {
          const id = docRef.id
          commit('addBlip', Object.assign(payload, {id}))
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
