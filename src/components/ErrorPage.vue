<template>
  <v-container fluid px-12>
    <h1 class="display-2">Welcome to the World of Errors</h1>
    <h2 class="headline">{{ errorCode ? errorCode + ' — ' : '' }}{{ errorMessage }}</h2>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  computed: {
    errorMessage () {
      switch (this.errorCode) {
        case '404':
          return 'No radar found at this location :('
        default:
          return 'Unspecified error (⊙＿⊙\')'
      }
    }
  }
})
export default class App extends Vue {
  @Prop({ default: '' })
  errorCode: string

  // computed
  errorMessage: string
}
</script>

<style lang="scss" scoped>
</style>
