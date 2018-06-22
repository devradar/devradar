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
        const coll = firebase.firestore().collection('users')
        coll.doc(user.uid).get()
          .then(snapshot => {
            const doc = snapshot.data()
            doc.displayName = user.displayName
            doc.lastLogin = new Date().toISOString()
            store.commit('setUser', doc)
            return coll.doc(user.uid).update(doc)
          })
          .catch(e => { // document does not exist
            const doc = {
              uid: user.uid,
              name: user.displayName || user.uid,
              displayName: user.displayName,
              lastLogin: new Date().toISOString(),
              roles: {}
            }
            store.commit('setUser', doc)
            return coll.doc(user.uid).set(doc)
          })
      } else {
        store.commit('setUser', {})
      }
    })
  }
})
