  <template>
  <v-tour name="intro" :steps="steps" :options="{ highlight: true }">
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
    console.log('introcomp: mounted -> set tour')
    this.$store.dispatch('intro/setTourObject', this)
  }
}
</script>
