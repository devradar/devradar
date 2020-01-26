<template>
  <v-dialog
    v-model="isLoading"
    hide-overlay
    persistent
    width="300"
  >
    <v-card
      color="accent"
      data-cy="loadingDialog"
      dark
    >
      <v-card-text>
        Loading radar..
        <v-progress-linear
          indeterminate
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
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
