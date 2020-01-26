<template>
  <v-dialog
  v-model="isVisible"
  max-width="960px"
  eager
  @input="close()"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Login</span>
      </v-card-title>
      <v-card-text>
        <section id="firebaseui-auth-container"></section>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit, PropSync } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
// import { LoginState } from '../types/domain'

@Component
export default class LoginModal extends Vue {
  @PropSync('visible', { type: Boolean })
  isVisible!: boolean

  public mounted () {
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
    // this.$store.commit('users/setLoginState', LoginState.LOGIN_PENDING)
    ui.start('#firebaseui-auth-container', uiConfig)
  }

  @Emit()
  close () {
    return true
  }
}
</script>
