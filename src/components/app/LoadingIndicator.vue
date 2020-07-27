<template>
  <v-overlay v-model="isLoading">
    <v-progress-circular
      data-cy="loadingDialog"
      indeterminate
      size="100"
      width="13"
      color="accent"
    ></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import appConfig from '@/config'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters('blips', [
      'isLoading'
    ])
  }
})
export default class App extends Vue {
  darkMode: boolean = appConfig.theme.dark
  // computed
  isLoading: boolean
}
</script>
