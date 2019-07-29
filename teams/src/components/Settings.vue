<template>
  <v-stepper v-model="stepperCount">
    <v-stepper-header>
      <v-stepper-step :complete="stepperCount > 1" step="1">Import team radars</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="stepperCount > 2" step="2">Match blips</v-stepper-step>

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
          @click="stepperCount++"
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
          <v-btn
          :disabled="!canProgress"
          @click="stepperCount++"
          ripple color="primary">
            Next
          </v-btn>
        </v-flex>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-btn
        @click="stepperCount++"
        ripple color="primary">
          Next
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>

  </v-stepper>
</template>

<script>
import ImportItems from './settings/ImportItems.vue'
import SelectBlips from './settings/SelectBlips.vue'

export default {
  data: () => ({
    stepperCount: 1,
    stepperComplete: 0 // needs to be 1 to switch stepperCount from 1->2
  }),
  computed: {
    canProgress () {
      return this.stepperComplete >= this.stepperCount
    }
  },
  methods: {
    isComplete (step, value) {
      if (step === this.stepperCount) {
        if (value) {
          this.stepperComplete = step
        }
      }
    }
  },
  components: {
    ImportItems,
    SelectBlips
  }
}
</script>

<style lang="scss" scoped>

</style>
