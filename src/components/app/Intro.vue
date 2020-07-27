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
          data-cy="intro-step"
          :class="{ 'z-10': [0,7].includes(tour.currentStep) }"
        >
          <template>
            <div slot="actions">
              <v-btn color="primary" small class="ma-1"
                v-if="[2,12].includes(index)"
                data-cy="intro-next-step">Next Step</v-btn>
               <v-btn color="primary" small class="ma-1"
                v-if="[6,8].includes(index)"
                @click="$store.dispatch('intro/next')" data-cy="intro-next-step">Next Step</v-btn>
              <v-btn color="secondary" outlined x-small class="ma-1"
                @click="tour.stop" data-cy="intro-skip-tutorial">Stop</v-btn>
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

<style lang="scss">
@import '../../assets/responsive.scss';

.z-10 {
  z-index: 10 !important;
}
@include larger($breakpoint-lg) {
  .v-step {
    max-width: 640px !important;
    min-width: 480px !important;
    min-height: 130px !important;
    font-size: 1.6rem !important;
  }
}
</style>
