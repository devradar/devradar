import Vue from 'vue'
import VueX from 'vuex'

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
      id: 'userId123',
      role: 'janitor'
    }
  },
  mutations: {},
  actions: {},
  getters: {
    loadedBlips (state) {
      return state.loadedBlips.sort((a, b) => a.title < b.title).sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase())
    }
  }
})
