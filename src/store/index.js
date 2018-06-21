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
    loadedBlips: [
      {
        'title': 'AKS',
        'area': 'cloud',
        'status': 'trial',
        'link': '',
        'changed': false
      },
      {
        'title': 'ava',
        'area': 'backend',
        'status': 'trial',
        'link': '',
        'changed': false
      },
      {
        'title': 'Azure Functions',
        'area': 'cloud',
        'status': 'trial',
        'link': '',
        'changed': true
      },
      {
        'title': 'Tensorflow',
        'area': 'datascience',
        'status': 'assess',
        'link': '',
        'changed': true
      }
    ],
    user: null,
    userList: []
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setUserList (state, users) {
      state.userList = users
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
    init ({commit}) {
      // hook up auth listener to mutate 'user' state
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          commit('setUser', user)
        } else {
          commit('setUser', null)
        }
      })
    },
    getUserList ({commit}) {
      firebase.firestore().collection('users').get()
        .then(snapshot => {
          const users = snapshot.docs.map(d => d.data())
          commit('setUserList', users)
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
