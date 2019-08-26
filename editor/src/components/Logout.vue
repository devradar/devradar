<template>
  <v-container>
  </v-container>
</template>

<script lang="ts">
import firebase from 'firebase/app'
import 'firebase/auth'
import { Component, Vue } from 'vue-property-decorator'

@Component({
})
export default class Logout extends Vue {
  mounted () {
    firebase.auth().signOut()
      .then(() => {
        this.$router.replace('/')
      })
  }
}
</script>
