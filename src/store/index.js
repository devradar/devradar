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
    user: {
      name: 'hans',
      id: 'userId123',
      role: 'janitor'
    }
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
      fb.auth().signInWithPopup(provider)
        .then(result => {
          const user = result.user
          console.log('yay')
          console.log(user)
        }).catch(error => {
          console.error(error)
        })
    }
  },
  getters: {
    loadedBlips (state) {
      return state.loadedBlips.sort((a, b) => a.title < b.title).sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase())
    }
  }
})
