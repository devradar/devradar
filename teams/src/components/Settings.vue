<template>
  <v-stepper v-model="stepperCount">
    <v-stepper-header>
      <v-stepper-step :complete="stepperCount > 1" step="1">Import team radars</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="stepperCount > 2" step="2">Map categories</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">Select blips</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <import-items></import-items>
        <v-btn
        @click="stepperCount++"
        ripple color="primary">
          Next
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <map-categories></map-categories>
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
import MapCategories from './settings/MapCategories.vue'
export default {
  data: () => ({
    stepperCount: 0
  }),
  computed: {
  },
  methods: {
  },
  components: {
    ImportItems,
    MapCategories
  }
}
</script>

<style lang="scss" scoped>

</style>
