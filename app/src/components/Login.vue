<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" lg="4">
        <v-card>
          <v-card-text>
            <v-row justify="center">
              <v-col cols="12" class="login-col login-twitter">
                <v-btn v-on:click="onLogin('twitter')"
                data-cy="user-login" mx-auto>
                <v-icon left>mdi-twitter</v-icon>Login using Twitter</v-btn>
              </v-col>
              <v-col cols="12" class="login-col login-github">
                <v-btn v-on:click="onLogin('github')"
                data-cy="admin-login" mx-auto>
                <v-icon left>mdi-github</v-icon>Login using GitHub</v-btn>
              </v-col>
              <v-col cols="12" class="login-col login-google">
                <v-btn v-on:click="onLogin('google')"
                mx-auto>
                <v-icon left>mdi-google</v-icon>Login using Google</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { User } from '@/types/domain'
import appConfig from '../config'
import { backend } from '../store'

@Component({
  computed: {
    user () {
      return (this.$store.getters.user || {}).uid
    }
  }
})

export default class NewChange extends Vue {
  // computed
  user: User

  public onLogin (provider) {
    if (appConfig.isUnderTest || appConfig.backend.project === 'devradar-e2e') { // use mocked login in test mode
      console.warn('Started stubbed login process')
      backend.test.login()
    } else {
      this.$store.dispatch('user/oauthLogin', { provider })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-col {
  text-align: center;
}
</style>
