<template>
  <v-container grid-list-md>
    <v-layout row wrap v-if="hasItems">
      <v-flex xs8>
        <h6 class="title">Radar Chart</h6>
        <div id="chart"></div>
      </v-flex>
      <v-flex xs4>
        <v-data-table
          :headers="headers"
          :items="selectedBlips"
          class="elevation-1"
          hide-actions
          :pagination.sync="pagination"
        >
          <template v-slot:items="props">
            <td>
              <v-btn
              @click="toggleBlipVisibility( props.item)"
              icon ripple>
                <v-icon v-if="!isVisibleBlip( props.item)">check_box_outline_blank</v-icon>
                <v-icon v-else>check_box</v-icon>
              </v-btn>
            </td>
            <td>{{ props.item.title }}</td>
            <td class="text-xs-right">{{ team.payload.meta.categories[props.item.category] }}</td>
            <td class="text-xs-right">{{ team.payload.meta.levels[props.item.level] }}</td>
          </template>
        </v-data-table>
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
    ]),
    headers () {
      return [
        { text: 'Visible', value: 'visible' },
        { text: 'Skill', value: 'title' },
        { text: 'Category', value: 'category' },
        { text: 'Level', value: 'level' }
      ]
    }
  },
  data: () => ({
    hiddenBlips: [],
    pagination: {
      sortBy: 'category',
      rowsPerPage: -1
    }
  }),
  methods: {
    isSelectedBlip (blip) {
      return !!this.selectedBlips.find(e => e.title.toLowerCase() === blip.title.toLowerCase())
    },
    isVisibleBlip (blip) {
      return !this.hiddenBlips.find(e => e.title === blip.title)
    },
    toggleBlipVisibility (blip) {
      const ix = this.hiddenBlips.findIndex(e => e.title === blip.title)
      if (ix > -1) {
        this.hiddenBlips.splice(ix, 1)
      } else {
        this.hiddenBlips.push(blip)
      }
      this.renderChart()
    },
    renderChart () {
      if (this.hasItems) {
        const w = 500
        const h = 500

        // helper for data collection
        const formatBlips = e => ({
          axis: e.title,
          value: e.level + 1
        })
        const addMissingBlips = e => {
          const existingBlips = e.map(o => o.axis.toLowerCase())
          const missing = this.selectedBlips
            .filter(this.isVisibleBlip)
            .filter(s => existingBlips.indexOf(s.title.toLowerCase()) === -1)
            .map(s => ({ axis: s.title, value: 0.5 }))
          return e.concat(missing)
        }
        const sortByAxis = e => e.sort((a, b) => a.axis > b.axis)

        const data = {
          axis: this.selectedBlips
            .filter(this.isVisibleBlip)
            .map(e => e.title)
            .sort((a, b) => a > b),
          levels: ['Adopt', 'Trial', 'Assess', 'Hold'],
          items: this.items
            .map(item => item.payload.blips
              .filter(this.isSelectedBlip)
              .filter(this.isVisibleBlip)
              .map(formatBlips)
            )
            .map(addMissingBlips)
            .map(sortByAxis)
            .map((item, ix) => ({ values: item.map(e => e.value), name: this.items[ix].title }))
        }

        // const data = {
        //   axis: ['a', 'b', 'c'],
        //   items: [{
        //     name: 'blup',
        //     values: [1,2,3,4,5]
        //   },
        //   {
        //     name: 'bert',
        //     values: [4,2,5,2,1]
        //   }]
        // }
        // Options for the Radar chart, other than default
        const mycfg = {
          w: w,
          h: h,
          maxValue: 4,
          levels: 4,
          ExtraWidthX: 300
        }

        // Call function to draw the Radar chart
        // Will expect that data is in %'s
        RadarChart.draw(d3, '#chart', data, mycfg)

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
  },
  mounted: function () {
    this.renderChart()
  }
}
</script>

<style lang='scss'>

.blip-list {
  cursor: default;
}
</style>
