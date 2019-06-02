import firebase from 'firebase/app'
import 'firebase/firestore'
import appConfig from '../../config'

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

function init (store) {
  firebase.initializeApp({
    apiKey: appConfig.backend.key,
    authDomain: `${appConfig.backend.project}.firebaseapp.com`,
    databaseURL: `https://${appConfig.backend.project}.firebaseio.com`,
    projectId: `${appConfig.backend.project}`
  })
  // hook up auth listener to mutate 'user' state
  store.dispatch('getBlips')
  store.dispatch('getMeta')

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

export default init
