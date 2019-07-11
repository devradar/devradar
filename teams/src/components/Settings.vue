<template>
  <v-stepper v-model="stepperCount">
    <v-stepper-header>
      <v-stepper-step :complete="stepperCount > 1" step="1">Import team radars</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="stepperCount > 2" step="2">Match blips</v-stepper-step>

    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <import-items @isComplete="val => val ? isComplete(2) : isComplete(1)"></import-items>
        <v-btn
        :disabled="!canProgress"
        @click="stepperCount++"
        ripple color="primary">
          Next
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-btn
        @click="stepperCount++"
        ripple color="primary">
          Next
        </v-btn>
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

export default {
  data: () => ({
    stepperCount: 1,
    stepperComplete: 0 // needs to be 2 to switch stepperCount from 1->2
  }),
  computed: {
    canProgress () {
      return this.stepperComplete > this.stepperCount
    }
  },
  methods: {
    isComplete (value) {
      this.stepperComplete = value
    }
  },
  components: {
    ImportItems
  }
}
</script>

<style lang="scss" scoped>

</style>
