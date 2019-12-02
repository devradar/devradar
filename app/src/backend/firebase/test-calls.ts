// a group of functions that need to be implemented for each backend
//  goal is to provide "shortcuts" during e2e tests

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

async function login (): Promise<any> {
  return firebase.auth().signInWithEmailAndPassword('rick@devradar.io', 'sanchez') // morty@devradar.io / jessica
}

export default {
  login
}