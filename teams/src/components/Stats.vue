<template>
  <v-container grid-list-md>
    <v-layout row wrap v-if="hasItems">
      <v-flex xs12>
        <h6 class="title">Blips by Category</h6>
        <svg class="chart" id="categories" viewBox="0 0 800 500">
        </svg>
      </v-flex>
      <v-flex xs12>
        <h6 class="title">Blips by Level</h6>
        <svg class="chart" id="levels" viewBox="0 0 800 500">
        </svg>
      </v-flex>
    </v-layout>
    <v-layout v-else justify-space-around>
      <v-flex xs12>
      <v-card>
        <v-alert
          :value="true"
          type="info"
        >
          <span class="alert">Head to the <router-link to="/settings">Settings</router-link> and add configure your team first</span>
        </v-alert>
      </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import * as d3 from 'd3'
import d3Tip from 'd3-tip'

// d3 sample from https://codesandbox.io/s/blazing-pine-9vjw1
function barchart (selector, data, options = { yLabel: 'Count', xLabel: 'Category' }) {
  const height = 400
  const width = 800
  const margin = { top: 30, right: 60, bottom: 30, left: 60 }
  const keys = data.map(e => e.key)

  //  Defining the scales for the axes here
  const x = d3
    .scaleBand()
    .domain([...keys])
    .range([margin.left, width - margin.right])
    .padding(0.3)

  const y = d3
    .scaleLinear()
    .domain([0, 50])
    .range([height - margin.bottom, margin.top])

  //  Defining the actual axes here
  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y)

  const chart = d3
    .select(selector)
    .attr('width', width)
    .attr('height', height)

  // add tooltip
  const tip = d3Tip()
    .attr('class', 'd3-tip')
    .html(e => e.value.toFixed(2) + ' %')
    .offset([-10, 0])
  chart.call(tip)

  chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .style('font-size', '16px')
    .call(xAxis)

  chart
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.bottom})`)
    .style('font-size', '16px')
    .call(yAxis)

  chart
    .selectAll('.bar')
    .data(data)
    .join('rect')
    .attr('x', d => {
      return x(d.key)
    })
    .attr('y', d => {
      return y(d.value) + margin.bottom
    })
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.value) - margin.bottom)
    .attr('class', 'd3-bar')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  chart
    .append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.top + 20)
    .style('font-size', '20px')
    .style('text-anchor', 'middle')
    .text(options.xLabel)

  chart
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', 0)
    .style('font-size', '20px')
    .text(options.yLabel)
}

function dataToPercentage (data) {
  const sum = data
    .reduce((p, c) => {
      p += c.value
      return p
    }, 0)
  const pct = data
    .map(e => {
      e.value /= sum
      e.value *= 100
      return e
    })
  return pct
}
export default {
  computed: {
    ...mapGetters([
      'team',
      'devs',
      'hasItems',
      'items'
    ]),
    stats () {
      const masterCategories = this.team.payload.meta.categories
      const masterLevels = this.team.payload.meta.levels
      const blips = this.items
        .map(e => e.payload.blips)
        .reduce((p, c) => p.concat(c), [])
      let categories = blips
        .reduce((p, c) => {
          if (p[c.category]) {
            p[c.category]++
          } else {
            p[c.category] = 1
          }
          return p
        }, {})
      categories = Object.keys(categories)
        .map(e => ({ value: categories[e], key: masterCategories[e] }))
      let levels = blips
        .reduce((p, c) => {
          if (p[c.level]) {
            p[c.level]++
          } else {
            p[c.level] = 1
          }
          return p
        }, {})
      levels = Object.keys(levels)
        .map(e => ({ value: levels[e], key: masterLevels[e] }))
      return { categories, levels }
    }
  },
  data: () => ({
  }),
  methods: {
  },
  mounted: function () {
    if (this.hasItems) {
      barchart('#categories', dataToPercentage(this.stats.categories), { yLabel: 'Count', xLabel: 'Category' })
      barchart('#levels', dataToPercentage(this.stats.levels), { yLabel: 'Count', xLabel: 'Level' })
    }
  }
}
</script>

<style lang='scss'>
.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.d3-bar {
  fill: #0DBD0D;
  padding-top: 0px;
}
.d3-bar:hover {
  fill: #ff7700;
}
.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
  font-family: "Roboto", sans-serif;
}

/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  content: "\25BC";
  position: absolute;
  text-align: center;
}

/* Style northward tooltips differently */
.d3-tip.n:after {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}

.alert {
  font-size: 1.5rem;
  a {
    color: white;
  }
}
</style>
