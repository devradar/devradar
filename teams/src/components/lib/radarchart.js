// based on http://bl.ocks.org/nbremer/21746a9668ffdf6d8242 on 2019-07-31 under MIT license
//  modified by Andreas Offenhaeuser to make ES6 and d3 v5 compatible

const chart = { }
chart.draw = function (d3, id, data, options) {
  chart._d3 = d3
  const cfg = {
    radius: 5,
    w: 600,
    h: 600,
    factor: 1,
    factorLegend: 0.85,
    levels: 3,
    maxValue: 10,
    opacityArea: 0.5,
    transitionDurationMs: 500,
    margin: {
      top: 100,
      right: 200,
      bottom: 50,
      left: 60
    },
    color: d3.scaleOrdinal(d3.schemeCategory10)
  }

  if (options) {
    for (let i in options) {
      if (options[i]) {
        cfg[i] = options[i]
      }
    }
  }

  cfg.maxValue = Math.max(cfg.maxValue, ...data.items.map(e => e.values).flat()) // (lower) limit maxValue by data
  cfg.elementCount = data.axis.length
  cfg.radius = Math.min(cfg.w / 2, cfg.h / 2)

  // ### helpers ###
  // scale level 0..4 to pixels
  const rScale = d3.scaleLinear()
    .range([0, cfg.radius])
    .domain([0, cfg.maxValue])
  // (interpolate) a line from polar coordinates
  const radarLine = d3.lineRadial()
    .curve(d3.curveCardinalClosed.tension(0.5)) // smoothen https://github.com/d3/d3-shape/blob/v1.3.4/README.md#curves (use closed curves only)
    .radius(function (d) { return rScale(d) })
    .angle(function (d, i) { return i * 2 * Math.PI / cfg.elementCount })
  // convert single polar coordinates used in data point placement
  const pol2xy = (value, i) => {
    return {
      x: rScale(value) * Math.cos(i * 2 * Math.PI / cfg.elementCount - Math.PI / 2),
      y: rScale(value) * Math.sin(i * 2 * Math.PI / cfg.elementCount - Math.PI / 2)
    }
  }

  // create a reference object with radar center being 0,0
  d3.select(id).select('svg').remove()
  const g = d3.select(id)
    .append('svg')
    .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
    .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + (cfg.w / 2 + cfg.margin.left) + ',' + (cfg.h / 2 + cfg.margin.top) + ')')

  // #############
  // ###  Grid ###
  // #############
  const gridWrapper = g.append('g').attr('class', 'gridWrapper')

  // background circles
  gridWrapper.selectAll('.levels')
    .data(d3.range(1, (cfg.levels + 1)).reverse())
    .enter()
    .append('circle')
    .attr('class', 'gridCircle')
    .attr('r', function (d, i) { return cfg.radius / cfg.levels * d })
    .style('fill', '#CDCDCD')
    .style('stroke', '#fafafa')
    .style('stroke-width', 3)
    .style('fill-opacity', 0.3)

  // circle label
  gridWrapper.selectAll('.gridLabel')
    .data(d3.range(1, (cfg.levels + 1)))
    .enter().append('text')
    .attr('class', 'gridLabel')
    .attr('width', '30px')
    .attr('text-anchor', 'middle')
    .attr('x', 4)
    .attr('y', function (d) { return -d * cfg.radius / cfg.levels })
    .attr('dy', '1em')
    .style('font-size', '12px')
    .attr('fill', '#333')
    .text((d, i) => i + 1)

  // labels + axis
  const axisWrapper = gridWrapper.selectAll('.axis')
    .data(data.axis)
    .enter()
    .append('g')
    .attr('class', 'axis')

  // axis grid
  axisWrapper.append('line')
    .attr('x1', (d, i) => pol2xy(cfg.maxValue * 0.99, i).x)
    .attr('y1', (d, i) => pol2xy(cfg.maxValue * 0.99, i).y)
    .attr('x2', (d, i) => pol2xy(cfg.maxValue * 1.04, i).x)
    .attr('y2', (d, i) => pol2xy(cfg.maxValue * 1.04, i).y)
    .attr('class', 'line')
    .style('stroke', '#999')
    .style('stroke-width', '2px')

  // axis labels
  axisWrapper.append('text')
    .attr('class', 'legend')
    .style('font-size', '11px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d, i) => pol2xy(cfg.maxValue * 1.15, i).x)
    .attr('y', (d, i) => pol2xy(cfg.maxValue * 1.15, i).y)
    .text(d => d)

  // ###################
  // ### Data points ###
  // ###################
  const radarWrapper = g.selectAll('.radarWrapper')
    .data(data.items)
    .enter().append('g')
    .attr('class', 'radarWrapper')
    .attr('data-index', (d, i) => i)

  // Tooltip
  const tooltip = g.append('text')
    .style('opacity', 0)
    .style('font-family', 'sans-serif')
    .style('font-size', '13px')

  // data points
  radarWrapper.selectAll('.radarCircle')
    .data(function (d, i) { return d.values })
    .enter().append('circle')
    .attr('class', 'radarCircle')
    .attr('r', 3)
    .attr('cx', (d, i) => pol2xy(d, i).x) // Math.cos(angleSlice*i - Math.PI/2)
    .attr('cy', (d, i) => pol2xy(d, i).y)
    .style('fill', function (d, i) { // https://stackoverflow.com/questions/38233003/d3-js-v4-how-to-access-parent-groups-datum-index/38235820
      const lineIx = this.parentNode.getAttribute('data-index')
      return cfg.color(lineIx)
    })

  // filled area
  radarWrapper
    .append('path')
    .attr('class', 'radarArea')
    .attr('d', (d, i) => radarLine(d.values))
    .style('fill', (d, i) => cfg.color(i))
    .style('fill-opacity', cfg.opacityArea)
    .style('stroke-width', 2)
    .style('stroke', (d, i) => cfg.color(i))
    .on('mouseover', function () {
    // Dim all blobs
      d3.selectAll('.radarArea')
        .transition().duration(cfg.transitionDurationMs)
        .style('fill-opacity', 0.1)
      // Bring back the hovered over blob
      d3.select(this)
        .transition().duration(cfg.transitionDurationMs)
        .style('fill-opacity', 0.7)
    })
    .on('mousemove', function (d) {
      const newX = d3.mouse(this)[0] - 10
      const newY = d3.mouse(this)[1] - 10

      tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(d.name)
        .transition().duration(cfg.transitionDurationMs)
        .style('opacity', 1)
    })
    .on('mouseout', function () {
    // Bring back all blobs
      d3.selectAll('.radarArea')
        .transition().duration(cfg.transitionDurationMs)
        .style('fill-opacity', cfg.opacityArea)
      tooltip.transition().duration(cfg.transitionDurationMs)
        .style('opacity', 0)
    })
}
export default chart
