import firebase from 'firebase/app'
import 'firebase/firestore'
import { ActionTree } from 'vuex'
import { RootState, UserState } from '@/types/vuex'
import { LoginState } from '@/types/domain'

const actions = (appConfig): ActionTree<UserState, RootState> => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
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
    commit('user/loginState', LoginState.LOGOUT_PENDING, { root: true })
    await firebase.auth().signOut()
    commit('blips/reset', null, { root: true })
    commit('user/reset', null, { root: true })
    commit('blips/setLoading', false, { root: true })
  }
})

export default {
  actions
}
