<template>
  <v-container id="radar-container">
    <div id="chart"></div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Blip } from '@/types/domain'
import { SkillradarChart, SkillradarOptions, SkillradarData } from '../lib/skillradar'
import * as d3 from 'd3'

@Component({
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
  radarConfig: SkillradarOptions = {
    radius: 300,
    maxValue: 4,
    levels: 4,
    color: d3.scaleOrdinal(['#0DBD0D', '#ff7700', '#11aadd', '#cc0033'])
  }
  constructor () {
    super()
    this.chart = new SkillradarChart(this.radarConfig)
  }

  public renderChart () {
    if (this.blips.length) {
      const data: SkillradarData = {
        items: this.blips,
        levels: this.meta.levels
      }

      // Call function to draw the Radar chart
      // Will expect that data is in %'s
      this.chart.draw('#chart', data)
    }
  }

  mounted () {
    this.renderChart()
  }
}
</script>

<style lang="scss">
#chart {
  max-width: 600px;
}
.blipIndex, .gridLabel {
  cursor: default;
}
.tooltip {
  font-size: 20px;
}
.tooltipText {
  fill: #fff;
}
.tooltipRectangle {
  fill: #333;
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
  }
  .gridCircle {
    fill: #111;
    fill-opacity: 0.7;
    stroke: #fafafa;
    stroke-width: 1;
  }
}
</style>
