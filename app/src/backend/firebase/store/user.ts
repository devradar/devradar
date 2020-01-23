import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { ActionTree } from 'vuex'
import { RootState, UserState } from '@/types/vuex'

const ghProvider = new firebase.auth.GithubAuthProvider()
const twitterProvider = new firebase.auth.TwitterAuthProvider()
const googleProvider = new firebase.auth.GoogleAuthProvider()

const actions = (appConfig): ActionTree<UserState, RootState> => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
  oauthLogin (_, payload): void {
    let provider: firebase.auth.AuthProvider
    switch (payload.provider) {
      case 'github':
        provider = ghProvider
        break
      case 'twitter':
        provider = twitterProvider
        break
      case 'google':
        provider = googleProvider
        break
      default:
        console.error(`Unknown provider: ${payload.provider}`) // eslint-disable-line no-console
    }
    firebase.auth().signInWithPopup(provider) // authenticated user is propagated to state using the hook created in the `init` action
      .catch(error => {
        console.error(error) // eslint-disable-line no-console
      })
  },
  getUserList ({ commit }): void {
    Promise.all([
      firebase.firestore().collection('users').get(),
      firebase.firestore().collection('roles').get()
    ])
      .then(([usersSnapshot, rolesSnapshot]) => {
        const roles = rolesSnapshot.docs
          .map(d => Object.assign(d.data(), { id: d.id }))
          .reduce((p, doc) => Object.assign(p, { [doc.id]: doc }), {})
        const users = usersSnapshot.docs
          .map(d => Object.assign(d.data(), { id: d.id }))
          .map(d => {
            const userRoles = roles[d.id] || {}
            delete userRoles.id
            return Object.assign(d, { roles: userRoles })
          })
          .reduce((p, doc) => Object.assign(p, { [doc.id]: doc }), {})
        commit('setUserList', users)
      })
      .catch(err => console.error(err)) // eslint-disable-line no-console
  },
  setRoles ({ commit }, { targetUser }): Promise<void> {
    const coll = firebase.firestore().collection('roles')
    return coll.doc(targetUser.uid).update(targetUser.roles)
      .catch(() => {
        return coll.doc(targetUser.uid).set(targetUser.roles)
      })
      .then(() => {
        commit('exchangeUser', targetUser)
      })
      .catch(err => console.error(err)) // eslint-disable-line no-console
  },
  async logout ({ commit }): Promise<any> {
    commit('blips/setLoading', true, { root: true })
    await firebase.auth().signOut()
    commit('blips/reset', null, { root: true })
    commit('user/reset', null, { root: true })
    commit('blips/setLoading', false, { root: true })
  }
})

export default {
  actions
}
