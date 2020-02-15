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
      <v-card-text v-if="useFirebaseAuth">
        <section id="firebaseui-auth-container"></section>
      </v-card-text>
      <v-card-text v-if="!useFirebaseAuth || showMockLogin">
        <v-layout row>
          <v-flex xs6 class="text-xs-center">
            <v-btn mx-auto
            @click="dummyLogin()">Login as Rick (Testmode)</v-btn>
          </v-flex>
          <v-flex xs6 class="text-xs-center">
            <v-btn mx-auto
            @click="dummyLogin('morty')">Login as Morty (Testmode)</v-btn>
          </v-flex>
        </v-layout>
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
import appConfig from '@/config'
import { backend } from '@/store'
// import { LoginState } from '../types/domain'

@Component({
  computed: {
    useFirebaseAuth () {
      return appConfig.backend.type === 'firebase'
    },
    showMockLogin () {
      return appConfig.backend.project === 'devradar-e2e'
    }
  }
})
export default class LoginModal extends Vue {
  @PropSync('visible', { type: Boolean })
  isVisible!: boolean

  // computed
  useFirebaseAuth: boolean

  public mounted () {
    if (this.useFirebaseAuth) {
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
      ui.reset() // make sure the UI works after login/logout cycle for another login
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
      ui.start('#firebaseui-auth-container', uiConfig)
    }
  }

  dummyLogin (user: string) {
    backend.test.login(user)
    this.close()
  }

  @Emit()
  close () {
    this.isVisible = false
    return true
  }
}
</script>
