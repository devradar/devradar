<template>
  <v-container>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
})
export default class Logout extends Vue {
  async mounted () {
    await this.$store.dispatch('user/logout')
    this.$router.replace('/')
  }
}
</script>
