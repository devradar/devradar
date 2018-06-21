import Vue from 'vue'
import VueX from 'vuex'
import * as fb from 'firebase'

const ghProvider = new fb.auth.GithubAuthProvider()
const twitterProvider = new fb.auth.TwitterAuthProvider()
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
    user: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
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
      fb.auth().setPersistence(fb.auth.Auth.Persistence.LOCAL) // store user until logout happens
      fb.auth().signInWithPopup(provider) // authenticated user is propagated to state using the hook created in the `init` action
        .catch(error => {
          console.error(error)
        })
    },
    init ({commit}) {
      // hook up auth listener to mutate 'user' state
      fb.auth().onAuthStateChanged(user => {
        if (user) {
          commit('setUser', user)
        }
      })
    }
  },
  getters: {
    loadedBlips (state) {
      return state.loadedBlips.sort((a, b) => a.title < b.title).sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase())
    },
    user (state) {
      return state.user
    }
  }
})
