// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import './stylus/main.styl'
import {store} from './store'

Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.base,
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3
  }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyC3FxfpYywy5ZYpiWuf9nw8_vlbxibpQH8',
      authDomain: 'techradar-f5834.firebaseapp.com',
      databaseURL: 'https://techradar-f5834.firebaseio.com',
      projectId: 'techradar-f5834',
      storageBucket: 'techradar-f5834.appspot.com'
    })
    firebase.firestore().settings({timestampsInSnapshots: true})

    // hook up auth listener to mutate 'user' state
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // upsert into user collection
        const db = firebase.firestore()
        db.collection('users').doc(user.uid).get()
          .then(snapshot => {
            const doc = snapshot.data()
            if (doc) {
              doc.displayName = user.displayName
              doc.lastLogin = new Date().toISOString()
              db.collection('users').doc(user.uid).update(doc) // update server document with time
              db.collection('roles').doc(user.uid).get()
                .then(rolesSnapshot => {
                  return Object.assign(doc, {roles: rolesSnapshot.data() || {}})
                })
                .catch(() => { // no roles defined
                  return Object.assign(doc, {roles: {}})
                })
                .then(user => {
                  store.commit('setUser', user)
                })
            } else { // document does not exist, create new user
              const doc = {
                uid: user.uid,
                name: user.displayName || user.uid,
                displayName: user.displayName,
                lastLogin: new Date().toISOString()
              }
              store.commit('setUser', {...doc, roles: {}})
              return db.collection('users').doc(user.uid).set(doc)
            }
          })
          .catch(e => console.error(e))
      } else { // user is not set (logout)
        store.commit('setUser', {})
      }
    })
  }
})
