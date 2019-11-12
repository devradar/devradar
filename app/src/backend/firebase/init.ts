import firebase from 'firebase/app'
import 'firebase/firestore'
import appConfig from '../../config'
import router from '../../router'

async function upsertUser (user): Promise<any> {
  // upsert into user collection
  const db = firebase.firestore()
  const getSnapshot = await db.collection('users').doc(user.uid).get()
  const doc = getSnapshot.data()
  if (doc) {
    const userUpdate = {
      displayName: user.displayName,
      lastLogin: new Date().toISOString(),
      email: user.email
    }
    await db.collection('users').doc(user.uid).update(userUpdate) // update server document with time
    const rolesSnapshot = await db.collection('roles').doc(user.uid).get()
    return Object.assign(doc, { roles: rolesSnapshot.data() || {} })
  } else { // document does not exist, create new user
    const doc = {
      uid: user.uid,
      name: user.displayName || user.uid,
      displayName: user.displayName,
      lastLogin: new Date().toISOString(),
      email: user.email
    }
    const docRef = await db.collection('users').doc(user.uid).set(doc)
    return Object.assign(docRef, { roles: {} })
  }
}

async function upsertRadar (user): Promise<string> {
  if (!user.radar) {
    const db = firebase.firestore()
    const getSnapshot = await db.collection('radars')
      .where('owner', '==', user.uid)
      .get()
    let radarId
    if (getSnapshot.empty) {
      console.log('No radar found for this user; creating one..')
      const doc = {
        categories: appConfig.radarDefault.categories,
        levels: appConfig.radarDefault.levels,
        owner: user.uid,
        readers: [],
        isPublic: appConfig.radarDefault.isPublic || false
      }
      const setSnapshot = await db.collection('radars').add(doc)
      await db.collection('users').doc(user.uid).update({ radar: setSnapshot.id })
      radarId = setSnapshot.id
    } else {
      // set the first radar to the active radar
      await db.collection('users').doc(user.uid).update({ radar: getSnapshot.docChanges()[0].doc.id })
      radarId = getSnapshot.docChanges()[0].doc.id
    }
    return radarId
  } else {
    return user.radar
  }
}
async function init (store, appConfig) {
  if (!appConfig.backend.project || !appConfig.backend.key) {
    console.error('Misconfigured backend in config.ts, please provide backend.project and backend.key')
    return Promise.reject()
  }
  const app = firebase.initializeApp({ // eslint-disable-line @typescript-eslint/no-unused-vars
    apiKey: appConfig.backend.key,
    authDomain: `${appConfig.backend.project}.firebaseapp.com`,
    databaseURL: `https://${appConfig.backend.project}.firebaseio.com`,
    projectId: `${appConfig.backend.project}`
  })

  // resolve after auth status is defined as logged in or not
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(async oauthUser => {
      if (oauthUser) {
        const user = await upsertUser(oauthUser)
        store.commit('user/setUser', user)
        const radarId = await upsertRadar(user)
        if (!store.getters['blips/isLoading']) {
          // TODO: should not redirect in case user is currently viewing "something useful"
          router.push({ name: 'radar', params: { radarId } })
        }
        resolve(user)
      } else { // user is not set (logout)
        store.commit('user/setUser', { roles: {} })
        resolve({})
      }
    })
  })
}

export default init
