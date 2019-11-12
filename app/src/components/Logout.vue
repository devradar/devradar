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
    console.log('logoff')
    firebase.auth().signOut()
      .then(() => {
        console.log('logoff done')
        this.$router.replace('/')
      })
  }
}
</script>
