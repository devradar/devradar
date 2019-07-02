<template>
  <v-container>
    <svg class='chart' viewBox='0 0 800 600'>
    </svg>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
// d3 sample from https://codesandbox.io/s/blazing-pine-9vjw1
export default {
  computed: {
  },
  data: () => ({
    test: [
      {
        'key': 'A',
        'value': 20
      },
      {
        'key': 'B',
        'value': 40
      },
      {
        'key': 'C',
        'value': 80
      },
      {
        'key': 'D',
        'value': 55
      },
      {
        'key': 'E',
        'value': 70
      }
    ]
  }),
  methods: {
  },
  mounted: function () {
    console.log('draw')
    function getKeys (array) {
      return array.map(arrObj => {
        return arrObj.category
      })
    }

    const height = 500
    const width = 800
    const margin = { top: 30, right: 60, bottom: 30, left: 60 }

    const data = [
      { category: 'A', value: 20 },
      { category: 'B', value: 40 },
      { category: 'C', value: 80 },
      { category: 'D', value: 55 },
      { category: 'E', value: 70 }
    ]

    const keys = getKeys(data)

    //  Defining the scales for the axes here
    const x = d3
      .scaleBand()
      .domain([...keys])
      .range([margin.left, width - margin.right])

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top])

    //  Defining the actual axes here
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    const chart = d3
      .select('.chart')
      .attr('width', width)
      .attr('height', height)

    chart
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)

    chart
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.bottom})`)
      .call(yAxis)

    chart
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => {
        return x(d.category)
      })
      .attr('y', d => {
        return y(d.value)
      })
      .attr('width', x.bandwidth() * 0.8)
      .attr('height', d => height - y(d.value))
      .style('fill', '#0ddd0d')

    chart
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .style('font-size', '32px')
      .style('text-anchor', 'middle')
      .text('Distribution Among Categories')

    chart
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.top)
      .style('font-size', '16px')
      .style('text-anchor', 'middle')
      .text('Categories')

    chart
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left / 4)
      .text('Values')
  }
}
</script>

<style lang='scss' scoped>

</style>
