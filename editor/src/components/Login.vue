<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
                <v-layout row>
                  <v-flex xs6 class="text-xs-center">
                    <v-btn v-on:click="onLogin('twitter')" mx-auto>Login using Twitter</v-btn>
                  </v-flex>
                  <v-flex xs6 class="text-xs-center">
                    <v-btn v-on:click="onLogin('github')" mx-auto>Login using GitHub</v-btn>
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

<script>
export default {
  data: () => ({
  }),
  computed: {
    user () {
      return (this.$store.getters.user || {}).uid
    }
  },
  methods: {
    onLogin (provider) {
      this.$store.dispatch('oauthLogin', { provider })
    }
  },
  mounted: function () {
  }
}
</script>
