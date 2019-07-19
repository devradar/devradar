<template>
  <v-container grid-list-md>
    <v-layout row wrap v-if="hasItems">
      <v-flex xs9>
        <h6 class="title">Radar Chart</h6>
        <div id="chart"></div>
      </v-flex>
      <v-flex xs3>
        <v-list>
          <v-subheader inset>Blips</v-subheader>
          <v-list-tile
            v-for="(item, index) in selectedBlips"
            :key="item.title"
            avatar
          >

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn
              @click="itemDone(index)"
              v-if="index >= activeItemIx"
              :disabled="index !== activeItemIx"
              icon ripple>
                <v-icon>check_box_outline_blank</v-icon>
              </v-btn>
              <v-icon v-else>check_box</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
    <v-layout v-else justify-space-around>
      <v-flex xs12>
      <v-card>
        <v-alert
          :value="true"
          type="info"
        >
          <span class="alert">Head to the <router-link to="/">Settings</router-link> and add configure your team first</span>
        </v-alert>
      </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="hasItems">
      <v-chip
        outline
        color="black"
        v-for="blip in selectedBlips"
        :key="blip.title">
        {{blip.title}}
      </v-chip>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import * as d3 from 'd3'
import RadarChart from './lib/radarchart'

export default {
  computed: {
    ...mapGetters([
      'team',
      'devs',
      'hasItems',
      'selectedBlips',
      'items'
    ])
  },
  data: () => ({
  }),
  methods: {
    isSelectedBlip (blip) {
      return !!this.selectedBlips.find(e => e.title.toLowerCase() === blip.title.toLowerCase())
    }
  },
  mounted: function () {
    if (this.hasItems) {
      const w = 500
      const h = 500

      // helper for data collection
      const formatBlips = e => ({
        axis: e.title,
        value: e.state
      })
      const addMissingBlips = e => {
        const existingBlips = e.map(o => o.axis.toLowerCase())
        const missing = this.selectedBlips
          .filter(s => existingBlips.indexOf(s.title.toLowerCase()) === -1)
          .map(s => ({ axis: s.title, value: 0 }))
        return e.concat(missing)
      }
      // Data
      const d = this.items
        .map(item => item.payload.blips
          .filter(this.isSelectedBlip)
          .map(formatBlips)
        )
        .map(addMissingBlips)

      // Options for the Radar chart, other than default
      const mycfg = {
        w: w,
        h: h,
        maxValue: 3,
        levels: 3,
        ExtraWidthX: 300
      }

      // Call function to draw the Radar chart
      // Will expect that data is in %'s
      RadarChart.draw(d3, '#chart', d, mycfg)

      /// /////////////////////////////////////////
      /// //////// Initiate legend ////////////////
      /// /////////////////////////////////////////
      const colorscale = d3.scaleOrdinal(d3.schemeCategory10)
      const legendTitles = this.items.map(e => e.title)

      const svg = d3.select('#chart')
        .selectAll('svg')
        .append('svg')
        .attr('width', w + 300)
        .attr('height', h)

      // Create the title for the legend
      svg.append('text')
        .attr('class', 'title')
        .attr('transform', 'translate(90,0)')
        .attr('x', w)
        .attr('y', 15)
        .attr('font-size', '12px')
        .attr('fill', '#404040')
        .text('Team setup')

      // Initiate Legend
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('height', 100)
        .attr('width', 200)
        .attr('transform', 'translate(90,20)')

      // Create colour squares
      legend.selectAll('rect')
        .data(legendTitles)
        .enter()
        .append('rect')
        .attr('x', w + 5)
        .attr('y', (d, i) => i * 20 + 10)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', colorscale)

      // Create text next to squares
      legend.selectAll('text')
        .data(legendTitles)
        .enter()
        .append('text')
        .attr('x', w + 18)
        .attr('y', (d, i) => i * 20 + 19)
        .attr('font-size', '11px')
        .attr('fill', '#737373')
        .text(d => d)
    }
  }
}
</script>

<style lang='scss'>

</style>
