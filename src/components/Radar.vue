<template>
  <v-container fluid class="pa-0 height-100">
    <v-tabs
      v-model="tab"
      centered
      background-color="accent"
      slider-color="black"
      @change="tabChange"
      v-if="isLoaded"
    >
      <v-tab data-cy="radar-tab-radar">
        <v-icon left>track_changes</v-icon>
        Radar View
      </v-tab>
      <v-tab data-tour-diary="true" data-cy="radar-tab-diary">
        <v-icon left>list</v-icon>
        Skill Diary
      </v-tab>
      <v-tab data-cy="radar-tab-settings">
        <v-icon left>settings</v-icon>
        Config
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <radar3 :radarId="radarId"></radar3>
      </v-tab-item>
      <v-tab-item>
        <list :radarId="radarId"></list>
      </v-tab-item>
      <v-tab-item>
        <settings :radarId="radarId"></settings>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import List from './radar/List.vue'
import Radar3 from './radar/Radar3.vue'
import Settings from './radar/Settings.vue'
import router from '../router'
import { RadarTabState } from '@/types/domain'

@Component({
  components: {
    Radar3,
    List,
    Settings
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
    // console.log(newTab, this.activeTabName)
    switch (newTab) {
      case 0:
        router.replace({ path: `/@${this.radarId}` })
        break
      case 1:
        router.replace({ path: `/@${this.radarId}/history` })
        break
      case 2:
        router.replace({ path: `/@${this.radarId}/settings` })
        break
    }
  }

  activateTabFromRoute () {
    if (this.$route.params.mode === 'history') {
      this.tab = 1
    } else if (this.$route.params.mode === 'settings') {
      this.tab = 2
    }
  }

  locationHashChange () {
    this.activateTabFromRoute()
  }

  mounted () {
    this.activateTabFromRoute()
    // hack to force vue.js to react to a URL change that is being triggered by the d3 radar elements via <a href>
    window.addEventListener('hashchange', this.locationHashChange)
  }

  beforeDestroy () {
    // cleanup hack before leaving the component
    window.removeEventListener('hashchange', this.locationHashChange)
  }
}
</script>

<style lang="scss" scoped>
.v-tab--active {
  color: black !important;
}
.height-100 {
  height: 100%;
}
</style>
