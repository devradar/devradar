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
          :items="skills"
          class="elevation-1"
          hide-actions
          must-sort
          :pagination.sync="pagination"
          item-key="title"
          @update:pagination="updatePagination"
        >
          <template v-slot:items="props">
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
import Sortable from 'sortablejs'
import RadarChart from './lib/radarchart'

const sortFunctionCurry = (sortBy, inverted) => {
  return (a, b) => {
    // TODO: use toLowerCase() in case argument is a string for case-insensitive sort
    if (a[sortBy] < b[sortBy]) {
      return inverted ? -1 : 1
    } else {
      return inverted ? 1 : -1
    }
  }
}
export default {
  computed: {
    ...mapGetters([
      'team',
      'devs',
      'hasItems',
      'selectedBlipTitles',
      'items'
    ]),
    headers () {
      return [
        { text: 'Skill', value: 'title' },
        { text: 'Category', value: 'category' },
        { text: 'Level', value: 'level' }
      ]
    }
  },
  data: () => ({
    pagination: {
      sortBy: 'category',
      rowsPerPage: -1
    },
    skills: []
  }),
  methods: {
    isSelectedBlip (blip) {
      return !!this.selectedBlipTitles.find(e => e.toLowerCase() === blip.title.toLowerCase())
    },
    renderChart () {
      if (this.hasItems && this.skills.length) {
        const w = 500
        const h = 500

        // helper for data collection
        const formatBlips = e => ({
          axis: e.title,
          value: e.level + 1
        })
        const addMissingBlips = e => {
          const existingBlips = e.map(o => o.axis.toLowerCase())
          const missing = this.selectedBlipTitles
            .filter(s => existingBlips.indexOf(s.toLowerCase()) === -1)
            .map(s => ({ axis: s, value: 0 }))
          return e.concat(missing)
        }

        const data = {
          axis: this.skills
            .map(e => e.title),
          levels: ['Adopt', 'Trial', 'Assess', 'Hold'],
          items: this.items
            .map(item => item.payload.blips
              .filter(this.isSelectedBlip)
              .map(formatBlips)
            )
            .map(addMissingBlips)
            .map(item => { // recreate order from this.skills (table sort)
              item.sort((a, b) => {
                const aIx = this.skills.findIndex(s => s.title === a.axis)
                const bIx = this.skills.findIndex(s => s.title === b.axis)
                if (aIx > bIx) return 1
                return -1
              })
              return item
            })
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
    },
    updatePagination (obj) {
      this.skills
        .sort(sortFunctionCurry(this.pagination.sortBy, !this.pagination.descending))
      this.renderChart()
    },
    reorderSkills ({ newIndex, oldIndex }) {
      this.renderChart()
    }
  },
  mounted: function () {
    if (this.hasItems) {
      const blips = this.selectedBlipTitles
        .map(title => {
          const devHits = this.devs
            .flatMap(item => item.payload.blips)
            .filter(blip => blip.title === title)
          const teamHit = this.team.payload.blips
            .find(blip => blip.title === title)
          if (teamHit) return teamHit // prioritize matching team blip
          return devHits
            .sort((a, b) => a.level < b.level)[0]
        })
      this.skills = blips
        .sort(sortFunctionCurry(this.pagination.sortBy, !this.pagination.descending)) // sort by existing pagination
    }
    this.renderChart()
    const table = document.querySelector('.v-datatable tbody')
    Sortable.create(table, {
      onEnd: ({ newIndex, oldIndex }) => {
        const row = this.skills.splice(oldIndex, 1)[0]
        this.skills.splice(newIndex, 0, row)
        this.reorderSkills({ newIndex, oldIndex })
      }
    })
  }
}
</script>

<style lang='scss'>

.blip-list {
  cursor: default;
}
</style>
