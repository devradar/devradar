import Vue from 'vue'
import VueX from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const ghProvider = new firebase.auth.GithubAuthProvider()
const twitterProvider = new firebase.auth.TwitterAuthProvider()
Vue.use(VueX)

export const store = new VueX.Store({
  state: {
    loadedBlips: [],
    user: {},
    userList: []
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setUserList (state, users) {
      state.userList = users
    },
    setBlips (state, blips) {
      state.loadedBlips = blips
    }
  },
  actions: {
    oauthLogin ({commit}, payload) {
      let provider
      switch (payload.provider) {
        case 'github':
          provider = ghProvider
          break
        case 'twitter':
          provider = twitterProvider
          break
        default:
          console.error(`Unknown provider: ${payload.provider}`)
      }
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL) // store user until logout happens
      firebase.auth().signInWithPopup(provider) // authenticated user is propagated to state using the hook created in the `init` action
        .catch(error => {
          console.error(error)
        })
    },
    getUserList ({commit}) {
      Promise.all([
        firebase.firestore().collection('users').get(),
        firebase.firestore().collection('roles').get()
      ])
        .then(([usersSnapshot, rolesSnapshot]) => {
          const roles = rolesSnapshot.docs.map(d => Object.assign(d.data(), {id: d.id}))
          const users = usersSnapshot.docs
            .map(d => Object.assign(d.data(), {id: d.id}))
            .map(d => {
              const userRoles = roles.find(r => r.id === d.id) || {}
              delete userRoles.id
              return Object.assign(d, {roles: userRoles})
            })
          commit('setUserList', users)
        })
        .catch(err => console.error(err))
    },
    setRoles ({commit}, {targetUser}) {
      const coll = firebase.firestore().collection('roles')
      return coll.doc(targetUser.uid).update(targetUser.roles)
        .catch(() => {
          return coll.doc(targetUser.uid).set(targetUser.roles)
        })
        .catch(err => console.error(err))
    },
    getBlips ({commit}) {
      firebase.firestore().collection('blips').get()
        .then(snapshot => {
          const blips = snapshot.docs.map(d => Object.assign(d.data(), {id: d.id}))
          commit('setBlips', blips)
        })
    }
  },
  getters: {
    loadedBlips (state) {
      return state.loadedBlips.sort((a, b) => a.title < b.title).sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase())
    },
    user (state) {
      return state.user
    },
    userList (state) {
      return state.userList
    }
  }
})
