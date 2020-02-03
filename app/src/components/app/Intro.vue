  <template>
  <v-tour name="intro" :steps="steps" :options="{ highlight: false }">
    <template slot-scope="tour">
      <transition name="fade">
        <!-- eslint-disable vue/no-use-v-if-with-v-for -->
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
          :highlight="tour.highlight"
        >
          <template>
            <div slot="actions">
              <button class="btn btn-primary" v-if="index === 2">Next Step</button>
              <button @click="tour.stop" class="btn btn-primary">Skip Tutorial</button>
            </div>
          </template>
        </v-step>
      </transition>
    </template>
  </v-tour>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters('intro', [
      'steps'
    ])
  }
})
export default class App extends Vue {
  // computed
  steps: any[]

  mounted () {
    this.$store.dispatch('intro/setTourObject', this) // make sure the vuex statemachine has access to to the $tours object
  }
}
</script>
