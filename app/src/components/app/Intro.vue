<template>
  <v-tour name="intro" :steps="steps" :options="{ highlight: true }">
    <template slot-scope="tour">
      <transition name="fade">
        <v-step
          v-if="tour.currentStep === index"
          v-for="(step, index) of tour.steps"
          :key="index"
          :step="step"
          :previous-step="tour.previousStep"
          :next-step="tour.nextStep"
          :stop="tour.stop"
          :is-first="tour.isFirst"
          :is-last="tour.isLast"
          :labels="tour.labels"
        >
          <template>
            <div slot="actions">
              <button @click="tour.stop" class="btn btn-primary">Stop intro</button>
            </div>
          </template>
        </v-step>
      </transition>
    </template>
  </v-tour>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component()
export default class App extends Vue {
  steps: any[] = [
    {
      target: '[data-cy="app-nav-static-login"]',
      content: `Start your <strong>devradar journey</strong>!`
    },
    {
      target: '[data-cy="blip-new-button"]',
      content: 'Create a new skill entry'
    },
    {
      target: '[data-v-step="2"]',
      content: 'Try it, you\'ll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.',
      params: {
        placement: 'top'
      }
    }
  ]

  mounted () {
    this.$tours.intro.start()
  }
}
</script>
