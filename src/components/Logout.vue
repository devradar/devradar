<template>
  <v-container>
    <h1>BYE</h1>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data: () => ({
  }),
  computed: {
  },
  methods: {
  },
  mounted: function () {
    firebase.auth().signOut()
      .then(() => {
        this.$router.replace('/')
      })
  }
}
</script>
