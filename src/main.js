// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import { store } from './store'
import appConfig from './config'
Vue.use(Vuetify, {
  theme: appConfig.theme
})
Vue.config.productionTip = false

Vue.prototype.$config = appConfig
Vue.filter('limitString', function (string, limit = Infinity) {
  return string.slice(0, limit) + (string.length > limit ? '..' : '')
})

function upsertUser (user) {
  // upsert into user collection
  const db = firebase.firestore()
  return db.collection('users').doc(user.uid).get()
    .then(snapshot => {
      const doc = snapshot.data()
      if (doc) {
        doc.displayName = user.displayName
        doc.lastLogin = new Date().toISOString()
        db.collection('users').doc(user.uid).update(doc) // update server document with time
        return db.collection('roles').doc(user.uid).get()
          .then(rolesSnapshot => {
            return Object.assign(doc, { roles: rolesSnapshot.data() || {} })
          })
      } else { // document does not exist, create new user
        const doc = {
          uid: user.uid,
          name: user.displayName || user.uid,
          displayName: user.displayName,
          lastLogin: new Date().toISOString()
        }
        return db.collection('users').doc(user.uid).set(doc)
          .then(doc => {
            return Object.assign(doc, { roles: {} })
          })
      }
    })
    .catch(e => console.error(e))
}

function init () {
  firebase.initializeApp({
    apiKey: appConfig.firebase.key,
    authDomain: `${appConfig.firebase.project}.firebaseapp.com`,
    databaseURL: `https://${appConfig.firebase.project}.firebaseio.com`,
    projectId: `${appConfig.firebase.project}`
  })
  firebase.firestore().settings({ timestampsInSnapshots: true })

  // hook up auth listener to mutate 'user' state
  store.dispatch('getBlips')
  // resolve after auth status is defined as logged in or not
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        upsertUser(user)
          .then(user => {
            store.commit('setUser', user)
            resolve(user)
          })
      } else { // user is not set (logout)
        store.commit('setUser', { roles: {} })
        resolve({})
      }
    })
  })
}

// only initialize app after auth
init()
  .catch(() => Promise.resolve())
  .then(() => {
  /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      render: h => h(App),
      template: '<App/>'
    })
  })
