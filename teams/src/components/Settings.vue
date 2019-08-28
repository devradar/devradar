<template>
  <v-stepper v-model="stepperCount">
    <v-stepper-header>
      <v-stepper-step :complete="stepperCount > 1" step="1">Import team radars</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="stepperCount > 2" step="2">Select blips</v-stepper-step>

    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <import-items @isComplete="val => isComplete(1, val)"></import-items>
        <v-flex xs12 text-xs-right>
          <v-btn
          :disabled="true"
          @click="stepperCount--"
          ripple>
            Back
          </v-btn>
          <v-btn
          :disabled="!canProgress"
          @click="() => stepperCount++ && stepperComplete++"
          ripple color="primary">
            Next
          </v-btn>
        </v-flex>
      </v-stepper-content>

      <v-stepper-content step="2">
        <select-blips @isComplete="val => isComplete(2, val)"></select-blips>
        <v-flex xs12 text-xs-right>
          <v-btn
          @click="stepperCount--"
          ripple>
            Back
          </v-btn>
          <router-link :to="canProgress ? {name: 'Spider'} : { name: null }">
            <v-btn
            :disabled="!canProgress"
            ripple color="primary">
              Next
            </v-btn>
          </router-link>
        </v-flex>
      </v-stepper-content>
    </v-stepper-items>

  </v-stepper>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ImportItems from './settings/ImportItems.vue'
import SelectBlips from './settings/SelectBlips.vue'

@Component({
  components: {
    ImportItems,
    SelectBlips
  }
})
export default class Settings extends Vue {
  public stepperCount: number = 1
  public stepperComplete: number = 0
  get canProgress (): boolean {
    return this.stepperComplete >= this.stepperCount
  }

  public isComplete (step: number, value: boolean) {
    if (step === this.stepperCount) {
      if (value) {
        this.stepperComplete = step
      } else {
        this.stepperComplete = step - 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
