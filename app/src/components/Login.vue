<template>
  <v-dialog v-model="visible" max-width="960px">
    <v-card>
      <v-card-title>
        <span class="headline">Login/Register</span>
      </v-card-title>
      <v-card-text justify="center">
        <section id="firebaseui-auth-container"></section>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { LoginState } from '../types/domain'

@Component({})
export default class NewChange extends Vue {
  visible: true

  public mounted () {
    console.log('mounted login') // eslint-disable-line no-console
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: () => false
      },
      signInOptions: [
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ]
    }
    this.$store.commit('users/loginState', LoginState.LOGIN_PENDING)
    ui.start('#firebaseui-auth-container', uiConfig)
  }

  @Emit()
  close () {
    return 0
  }
}
</script>
