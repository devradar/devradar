<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
                <v-layout row>
                  <v-flex xs6 class="text-xs-center">
                    <v-btn v-on:click="onLogin('twitter')"
                    data-cy="user-login" mx-auto>Login using Twitter</v-btn>
                  </v-flex>
                  <v-flex xs6 class="text-xs-center">
                    <v-btn v-on:click="onLogin('github')"
                    data-cy="admin-login" mx-auto>Login using GitHub</v-btn>
                  </v-flex>
                  <v-flex xs6 class="text-xs-center">
                    <v-btn v-on:click="onLogin('google')"
                    mx-auto>Login using Google</v-btn>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <span>user: {{ user }}</span>
                </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { User } from '@/types/domain'

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
    this.$store.dispatch('user/oauthLogin', { provider })
  }
}
</script>
