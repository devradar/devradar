<template>
  <v-container fluid class="pa-0">
    <v-tabs
      v-model="tab"
      centered
      background-color="accent"
      slider-color="black"
      @change="tabChange"
      v-if="isLoaded"
    >
      <v-tab>
        <v-icon left>track_changes</v-icon>
        Chart
      </v-tab>
      <v-tab>
        <v-icon left>list</v-icon>
        History
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <radar3 :radarId="radarId"></radar3>
      </v-tab-item>
      <v-tab-item>
        <list></list>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import List from './List.vue'
import Radar3 from './Radar3.vue'
import { RadarTabState } from '@/types/domain'

@Component({
  components: {
    Radar3,
    List
  },
  computed: {
    activeTabName () {
      return RadarTabState[this.tab]
    },
    ...mapGetters('blips', [
      'isLoaded'
    ])
  }
})
export default class Radar extends Vue {
  @Prop({ default: '' })
  radarId: string
  tab: number = 0

  // computed
  activeTabName: RadarTabState
  isLoaded: boolean

  tabChange (newTab: number) {
    console.log(newTab, this.activeTabName)
  }
}
</script>

<style lang="scss" scoped>
.v-tab--active {
  color: black !important;
}
</style>
