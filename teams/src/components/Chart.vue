<template>
  <v-container>
    <h1>Blips by Category</h1>
    <svg class="chart" id="categories" viewBox="0 0 800 600">
    </svg>
    <h1>Blips by State</h1>
    <svg class="chart" id="states" viewBox="0 0 800 600">
    </svg>
  </v-container>
</template>

<script>
import * as d3 from 'd3'

// d3 sample from https://codesandbox.io/s/blazing-pine-9vjw1
function barchart (selector, data, options = { yLabel: 'Count', xLabel: 'Category' }) {
  const height = 500
  const width = 960
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
    .domain([0, 100])
    .range([height - margin.bottom, margin.top])

  //  Defining the actual axes here
  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y)

  const chart = d3
    .select(selector)
    .attr('width', width)
    .attr('height', height)

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
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', d => {
      return x(d.key)
    })
    .attr('y', d => {
      return y(d.value)
    })
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.value))
    .style('fill', '#0ddd0d')

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

export default {
  computed: {
    stats () {
      const items = JSON.parse(JSON.stringify(this.$store.getters.devs)).concat(JSON.parse(JSON.stringify(this.$store.getters.team)))
      const blips = items
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
        .map(e => ({ value: categories[e], key: e }))
      let states = blips
        .reduce((p, c) => {
          const state = c.changes.sort((a, b) => a.date < b.date)[0].newState
          if (p[state]) {
            p[state]++
          } else {
            p[state] = 1
          }
          return p
        }, {})
      states = Object.keys(states)
        .map(e => ({ value: states[e], key: e }))
      return { categories, states }
    }
  },
  data: () => ({
  }),
  methods: {
  },
  mounted: function () {
    barchart ('#categories', this.stats.categories, { yLabel: 'Count', xLabel: 'Category' })
    barchart ('#states', this.stats.states, { yLabel: 'Count', xLabel: 'State' })
  }
}
</script>

<style lang='scss' scoped>

</style>
