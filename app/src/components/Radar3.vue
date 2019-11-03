<template>
  <v-container grid-list fluid
    class="radarcontainer">
    <settings
      @close="settingsModalClose"></settings>
    <v-btn
      :dark="darkMode"
      fab bottom right fixed
      @click="settingsModalVisible = true"
      color="primary"
    >
      <v-icon>mdi-settings</v-icon>
    </v-btn>
    <v-row justify="space-around">
      <v-col cols="3" xl="2" class="d-none d-sm-flex">
        <div id="legendwest" class="radarlegend"></div>
      </v-col>
      <v-col cols="11" sm="6" class="text-center z-10">
        <div id="radarchart" class="d-inline"></div>
      </v-col>
      <v-col cols="3" xl="2" class="d-none d-sm-flex">
        <div id="legendeast" class="radarlegend"></div>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-col cols="5" class="d-flex d-sm-none">
        <div id="legendwest-small" class="radarlegend"></div>
      </v-col>
      <v-col cols="2"></v-col>
      <v-col cols="5" class="d-flex d-sm-none">
        <div id="legendeast-small" class="radarlegend"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Blip, Meta } from '@/types/domain'
import Settings from './Settings.vue'
import { SkillradarChart, SkillradarOptions, SkillradarData } from '../lib/skillradar'
import appConfig from '../config'

@Component({
  components: {
    Settings
  },
  computed: {
    blips () {
      return this.$store.getters['blips/blipsWithIndex']
    },
    meta () {
      return this.$store.getters['blips/meta']
    }
  }
})
export default class Radar3 extends Vue {
  blips: Blip[]
  chart: SkillradarChart
  meta: Meta
  darkMode: boolean = appConfig.theme.dark
  settingsModalVisible: boolean = false

  radarConfig: SkillradarOptions = {
    radius: 300,
    dark: this.darkMode
  }
  constructor () {
    super()
    this.chart = new SkillradarChart(this.radarConfig)
  }

  public renderChart () {
    const data: SkillradarData = {
      items: this.blips,
      levels: this.meta.levels,
      categories: this.meta.categories
    }
    // Call function to draw the Radar chart
    // Will expect that data is in %'s
    this.chart.drawChart('#radarchart', data)
    this.chart.drawLegend('#legendeast', data, (blip: Blip) => blip.category < 2, 'down')
    this.chart.drawLegend('#legendwest', data, (blip: Blip) => blip.category >= 2, 'up')
    this.chart.drawLegend('#legendeast-small', data, (blip: Blip) => blip.category < 2, 'down')
    this.chart.drawLegend('#legendwest-small', data, (blip: Blip) => blip.category >= 2, 'up')
  }

  mounted () {
    this.renderChart()
  }

  settingsModalClose () {
    this.settingsModalVisible = false
    this.renderChart()
  }

  @Watch('blips')
  onPropertyChanged(value: Blip[], oldValue: Blip[]) {
    this.renderChart()
  }
}
</script>

<style lang="scss">
#radarchart {
  max-width: 600px;
}
#legendeast {
  padding: 0 0 0 2rem;
}
#legendwest {
  padding: 0 2rem 0 0;
}
.radarcontainer {
  padding: 1rem 4rem !important;
  margin: 0;
}
.z-10 {
  z-index: 10;
}
// to be moved into radarchart component

.radar-chart {
  .tooltip {
    font-size: 20px;
    .tooltipText {
      fill: #fff;
      cursor: default;
    }
    .tooltipRectangle {
      fill: #333;
      &.dark {
        fill: #ddd;
      }
    }
  }
  .blip {
    .blipCircle {
      stroke: #fff;
    }
    .blipCircle-category-0 {
      fill: #0DBD0D;
    }
    .blipCircle-category-1 {
      fill: #ff7700;
    }
    .blipCircle-category-2 {
      fill: #11aadd;
    }
    .blipCircle-category-3 {
      fill: #cc0033;
    }
    .blipIndex {
      fill: #fff;
      font-size: 16px;
    }
  }

  .gridWrapper {
    .gridLabel {
      font-size: 24px;
      width: 30px;
      fill: #fff;
      cursor: default;
    }
    .gridCircle {
      fill: #444;
      fill-opacity: 1;
      stroke: #fafafa;
      stroke-width: 3;
    }
  }
}

.radar-legend {
  cursor: default;
  .category-0 {
    fill: #0DBD0D;
  }
  .category-1 {
    fill: #ff7700;
  }
  .category-2 {
    fill: #11aadd;
  }
  .category-3 {
    fill: #cc0033;
  }
  .legendCircle {
    fill: none;
  }
  .highlight {
    font-weight: bolder;
  }
  .grayed {
    fill: #888;
    transition: fill 500ms;
  }
  .legendEntry {
    font-size: 20px;
    transition: fill 500ms;
  }
  .legendCategory {
    font-size: 30px;
    font-weight: bold;
    text-transform: uppercase;
  }
  .legendDecorator {
    fill: none;
    stroke: #333;
    stroke-width: 1px;
    stroke-dasharray: 1.5;
    &.dark {
      stroke: #ddd;
    }
  }
  .legendLevel {
    fill: #333;
    text-transform: uppercase;
    font-size: 16px;
    &.dark {
      fill: #ddd;
    }
  }
}
</style>
