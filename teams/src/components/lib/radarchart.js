// modified by Andreas Offenhaeuser to make ES6 compatible for Vue

// taken from https://gist.github.com/nbremer/6506614 on 2019-07-10 under [MIT license](https://gist.github.com/nbremer/6506614#file-block-L2)
// Original header/attribution by Nadieh Bremer:
// Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
// I only made some additions and aesthetic adjustments to make the chart look better
// (of course, that is only my point of view)
// Such as a better placement of the titles at each line end,
// adding numbers that reflect what each circular level stands for
// Not placing the last level and slight differences in color
//
// For a bit of extra information check the blog about it:
// http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html

function rad2cart (radius, angle) {
  return {
    x: (1 - radius * Math.sin(angle)),
    y: (1 - radius * Math.cos(angle))
  }
}
function value2pixelPos (value, index, cfg) {
  const { x, y } = rad2cart(parseFloat(value) / cfg.maxValue, index * cfg.radians / cfg.elementCount)
  return {
    x: cfg.w / 2 * x,
    y: cfg.h / 2 * y
  }
}
function drawCircles (element, cfg, allAxis) {
  const radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2)
  for (let j = 0; j < cfg.levels - 1; j++) {
    let levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels)
    element.selectAll('.levels')
      .data(allAxis)
      .enter()
      .append('svg:line')
      .attr('x1', function (d, i) { return levelFactor * rad2cart(1, i * cfg.radians / cfg.elementCount).x })
      .attr('y1', function (d, i) { return levelFactor * rad2cart(1, i * cfg.radians / cfg.elementCount).y })
      .attr('x2', function (d, i) { return levelFactor * rad2cart(1, (i + 1) * cfg.radians / cfg.elementCount).x })
      .attr('y2', function (d, i) { return levelFactor * rad2cart(1, (i + 1) * cfg.radians / cfg.elementCount).y })
      .attr('class', 'line')
      .style('stroke', 'grey')
      .style('stroke-opacity', '0.75')
      .style('stroke-width', '0.3px')
      .attr('transform', 'translate(' + (cfg.w / 2 - levelFactor) + ', ' + (cfg.h / 2 - levelFactor) + ')')
  }
}

// Text indicating at what % each level is
function drawTextLabels (element, cfg) {
  const radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2)
  for (let j = 0; j < cfg.levels; j++) {
    let levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels)
    element.selectAll('.levels')
      .data([1]) // dummy data
      .enter()
      .append('svg:text')
      .attr('x', function (d) { return levelFactor * rad2cart(1, 0).x })
      .attr('y', function (d) { return levelFactor * rad2cart(1, 0).y })
      .attr('class', 'legend')
      .style('font-family', 'sans-serif')
      .style('font-size', '10px')
      .attr('transform', 'translate(' + (cfg.w / 2 - levelFactor + cfg.ToRight) + ', ' + (cfg.h / 2 - levelFactor) + ')')
      .attr('fill', '#737373')
      .text(((j + 1) * cfg.maxValue / cfg.levels))
  }
}

function drawAxis (element, cfg, allAxis) {
  const total = allAxis.length
  const axis = element.selectAll('.axis')
    .data(allAxis)
    .enter()
    .append('g')
    .attr('class', 'axis')

  axis.append('line')
    .attr('x1', cfg.w / 2)
    .attr('y1', cfg.h / 2)
    .attr('x2', function (d, i) { return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)) })
    .attr('y2', function (d, i) { return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)) })
    .attr('class', 'line')
    .style('stroke', 'grey')
    .style('stroke-width', '1px')

  axis.append('text')
    .attr('class', 'legend')
    .text(function (d) { return d })
    .style('font-family', 'sans-serif')
    .style('font-size', '14px')
    .attr('text-anchor', 'middle')
    .attr('dy', '1.5em')
    .attr('transform', function (d, i) { return 'translate(0, -10)' })
    .attr('x', function (d, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total) })
    .attr('y', function (d, i) { return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total) })
}

export default {
  draw: function (d3, id, d, options) {
    const cfg = {
      radius: 5,
      w: 600,
      h: 600,
      factor: 1,
      factorLegend: 0.85,
      levels: 3,
      maxValue: 10,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      ToRight: 5,
      TranslateX: 80,
      TranslateY: 30,
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      color: d3.scaleOrdinal(d3.schemeCategory10) // d3.scale.category10()
    }

    if (typeof options !== 'undefined') {
      for (let i in options) {
        if (typeof options[i] !== 'undefined') {
          cfg[i] = options[i]
        }
      }
    }

    cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function (i) { return d3.max(i.map(function (o) { return o.value })) }))
    const allAxis = d[0].map(i => i.axis)
    const total = allAxis.length
    cfg.elementCount = total
    d3.select(id).select('svg').remove()

    const g = d3.select(id)
      .append('svg')
      .attr('width', cfg.w + cfg.ExtraWidthX)
      .attr('height', cfg.h + cfg.ExtraWidthY)
      .append('g')
      .attr('transform', 'translate(' + cfg.TranslateX + ',' + cfg.TranslateY + ')')

    var tooltip

    // draw axis + circles
    drawCircles(g, cfg, allAxis)
    drawTextLabels(g, cfg)
    drawAxis(g, cfg, allAxis)

    let series = 0
    let dataValues = []
    // draw polygons
    d.forEach(function (y, x) {
      dataValues = []
      g.selectAll('.nodes')
        .data(y, function (j, i) {
          const { x, y } = value2pixelPos(j.value, i, cfg)
          dataValues.push([x, y])
        })
      dataValues.push(dataValues[0])
      g.selectAll('.area')
        .data([dataValues])
        .enter()
        .append('polygon')
        .attr('class', 'radar-chart-serie' + series)
        .style('stroke-width', '2px')
        .style('stroke', cfg.color(series))
        .attr('points', function (d) {
          var str = ''
          for (var pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + ',' + d[pti][1] + ' '
          }
          return str
        })
        .style('fill', function (j, i) { return cfg.color(series) })
        .style('fill-opacity', cfg.opacityArea)
        .on('mouseover', function (d) {
          const z = 'polygon.' + d3.select(this).attr('class')
          g.selectAll('polygon')
            .transition(200)
            .style('fill-opacity', 0.1)
          g.selectAll(z)
            .transition(200)
            .style('fill-opacity', 0.7)
        })
        .on('mouseout', function () {
          g.selectAll('polygon')
            .transition(200)
            .style('fill-opacity', cfg.opacityArea)
        })
      series++
    })

    // draw dots
    series = 0
    d.forEach(function (y, x) {
      g.selectAll('.nodes')
        .data(y).enter()
        .append('svg:circle')
        .attr('class', 'radar-chart-serie' + series)
        .attr('r', cfg.radius)
        .attr('alt', function (j) { return Math.max(j.value, 0) })
        .attr('cx', function (j, i) {
          dataValues.push([
            cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
          ])
          return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total))
        })
        .attr('cy', function (j, i) {
          return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
        })
        .attr('data-id', function (j) { return j.axis })
        .style('fill', cfg.color(series)).style('fill-opacity', 0.9)
        .on('mouseover', function (d) {
          const newX = parseFloat(d3.select(this).attr('cx')) - 10
          const newY = parseFloat(d3.select(this).attr('cy')) - 5

          tooltip
            .attr('x', newX)
            .attr('y', newY)
            .text(d.value)
            .transition(200)
            .style('opacity', 1)

          const z = 'polygon.' + d3.select(this).attr('class')
          g.selectAll('polygon')
            .transition(200)
            .style('fill-opacity', 0.1)
          g.selectAll(z)
            .transition(200)
            .style('fill-opacity', 0.7)
        })
        .on('mouseout', function () {
          tooltip
            .transition(200)
            .style('opacity', 0)
          g.selectAll('polygon')
            .transition(200)
            .style('fill-opacity', cfg.opacityArea)
        })
        .append('svg:title')
        .text(function (j) { return Math.max(j.value, 0) })

      series++
    })
    // Tooltip
    tooltip = g.append('text')
      .style('opacity', 0)
      .style('font-family', 'sans-serif')
      .style('font-size', '13px')
  }
}
