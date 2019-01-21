import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import Vue from 'vue'
import appConfig from '../config'

const ghProvider = new firebase.auth.GithubAuthProvider()
const twitterProvider = new firebase.auth.TwitterAuthProvider()

export default {
  state: {
    user: {},
    userList: {}
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setUserList (state, users) {
      state.userList = users
    },
    exchangeUser (state, user) {
      Vue.set(state.userList, user.id, user)
    }
  },
  actions: {
    oauthLogin ({ commit }, payload) {
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
    getUserList ({ commit }) {
      Promise.all([
        firebase.firestore().collection('users').get(),
        firebase.firestore().collection('roles').get()
      ])
        .then(([usersSnapshot, rolesSnapshot]) => {
          const roles = rolesSnapshot.docs
            .map(d => Object.assign(d.data(), { id: d.id }))
            .reduce((p, doc) => Object.assign(p, { [doc.id]: doc }), {})
          const users = usersSnapshot.docs
            .map(d => Object.assign(d.data(), { id: d.id }))
            .map(d => {
              const userRoles = roles[d.id] || {}
              delete userRoles.id
              return Object.assign(d, { roles: userRoles })
            })
            .reduce((p, doc) => Object.assign(p, { [doc.id]: doc }), {})
          commit('setUserList', users)
        })
        .catch(err => console.error(err))
    },
    setRoles ({ commit }, { targetUser }) {
      const coll = firebase.firestore().collection('roles')
      return coll.doc(targetUser.uid).update(targetUser.roles)
        .catch(() => {
          return coll.doc(targetUser.uid).set(targetUser.roles)
        })
        .then(docRef => {
          commit('exchangeUser', targetUser)
        })
        .catch(err => console.error(err))
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    userList (state) {
      return state.userList
    },
    userCanEdit (state, getters) {
      const user = getters.user
      return appConfig.editPermissions(user)
    }
  }
}
