import firebase from 'firebase/app'
import 'firebase/firestore'

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

async function upsertRadar (user) {
  if (!user.radar) {
    const db = firebase.firestore()
    const getSnapshot = await db.collection('radars')
      .where('owner', '==', user.uid)
      .get()
    if (getSnapshot.empty) {
      console.log('No radar found for this user; creating one..')
      const doc = {
        categories: [ 'Tools', 'Techniques', 'Platforms', 'Frameworks' ],
        levels: [ 'Hold', 'Assess', 'Trial', 'Adopt' ],
        owner: user.uid,
        readers: [],
        isPublic: true
      }
      const setSnapshot = await db.collection('radars').add(doc)
      const updateSnapshot = await db.collection('users').doc(user.uid).update({ radar: setSnapshot.id })
    } else {
      // set the first radar to the active radar
      const updateSnapshot = await db.collection('users').doc(user.uid).update({ radar: getSnapshot.docs[0].id })
    }
  }
}
function init (store, appConfig) {
  if (!appConfig.backend.project || !appConfig.backend.key) {
    console.error('Misconfigured backend in config.ts, please provide backend.project and backend.key')
    return Promise.reject()
  }
  const app = firebase.initializeApp({
    apiKey: appConfig.backend.key,
    authDomain: `${appConfig.backend.project}.firebaseapp.com`,
    databaseURL: `https://${appConfig.backend.project}.firebaseio.com`,
    projectId: `${appConfig.backend.project}`
  })

  // resolve after auth status is defined as logged in or not
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        upsertUser(user)
          .then(user => {
            store.commit('user/setUser', user)
            resolve(user)
          })
        upsertRadar(user)
      } else { // user is not set (logout)
        store.commit('user/setUser', { roles: {} })
        resolve({})
      }
      setTimeout(() => store.dispatch('blips/getRadar'), 1000)
    })
  })
}

export default init
