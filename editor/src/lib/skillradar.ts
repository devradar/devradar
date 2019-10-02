import { Blip } from '@/types/domain';
import * as d3 from 'd3'
import { getPseudoRand } from '../util'

export interface SkillradarOptions {
  levelCount?: number;
  radius?: number;
  elementCount?: number;
  blipRadius?: number;
  blipRadiusHoverPercentage?: number;
  opacityArea?: number;
  transitionDurationMs?: number;
  titleCutOff?: number;
}

export interface SkillradarData {
  items: Blip[];
  levels: string[];
}

export interface CoordPolar {
  angle: number;
  radius: number;
}

export interface CoordCarthesian {
  x: number;
  y: number;
}
export class SkillradarChart {
  public config: SkillradarOptions

  private chartArea: d3.Selection<SVGGElement, unknown, HTMLElement, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private legends: d3.Selection<SVGGElement, unknown, HTMLElement, any>[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

  public constructor (options: SkillradarOptions) {
    const cfg: SkillradarOptions = {
      radius: 300,
      opacityArea: 0.5,
      transitionDurationMs: 500,
      blipRadius: 13,
      blipRadiusHoverPercentage: 1.5,
      titleCutOff: 20
    }

    if (options) {
      for (const i in options) {
        if (options[i]) {
          cfg[i] = options[i]
        }
      }
    }
    this.config = cfg
  }

  public drawChart (id: string, data: SkillradarData) {
    const cfg = this.config
    cfg.elementCount = data.items.length
    cfg.levelCount = data.levels.length

    // create a reference object with radar center being 0,0
    d3.select(id).select('svg').remove()
    const g = d3.select(id)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${2 * cfg.radius} ${2 * cfg.radius}`)
      .attr('class', 'radar-chart')
      .append('g')
      .attr('transform', 'translate(' + (cfg.radius) + ',' + (cfg.radius) + ')')
    this.chartArea = g
    let tooltip // eslint-disable-line prefer-const, // drawn at the end to be placed on top
    // #############
    // ###  Grid ###
    // #############
    const gridWrapper = g.append('g').attr('class', 'gridWrapper')

    // background circles
    gridWrapper.selectAll('.gridCircle')
      .data(d3.range(0, cfg.levelCount))
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d: number) => this.level2radius(d))

    // circle label
    gridWrapper.selectAll('.gridLabel')
      .data(d3.range(0, cfg.levelCount))
      .enter().append('text')
      .attr('class', 'gridLabel')
      .attr('text-anchor', 'middle')
      .attr('x', 4)
      .attr('y', (d: number) => -this.level2radius(d))
      .attr('dy', '1.5em')
      .text((d: number) => data.levels[d])

    // ###################
    // ### Data points ###
    // ###################
    const radarWrapper = g.selectAll('.radarWrapper') // eslint-disable-line @typescript-eslint/no-unused-vars
      .data(data.items)
      .enter().append('a')
      .attr('href', (d: Blip) => `#/list/${d.title}`)
      .append('g')
      .attr('class', 'blip')
      .attr('data-index', (d: Blip) => d.index)
      .attr('transform', (d: Blip) => 'translate(' + this.rad2xy(this.blip2rad(d)).x + ',' + this.rad2xy(this.blip2rad(d)).y + ')')
      .on('mouseover', function () {
        const { title, index } = d3.select(this).data()[0] as Blip
        d3.select(this).select('.blipCircle')
          .transition().duration(cfg.transitionDurationMs)
          .attr('r', cfg.blipRadius * cfg.blipRadiusHoverPercentage)
        d3.select(this).select('.blipIndex')
          .transition().duration(cfg.transitionDurationMs)
          .attr('opacity', 0)
        const tooltipWidth = title.length * 12 + 20

        tooltip
          .attr('transform', this.attributes['transform'].value)
          .select('.tooltipText')
          .text(title)
        tooltip
          .select('.tooltipRectangle')
          .attr('width', tooltipWidth)
          .attr('x', -tooltipWidth / 2)
        tooltip
          .transition().duration(cfg.transitionDurationMs)
          .attr('visibility', 'visible')
          .attr('opacity', 1)

        d3.selectAll('.legendEntry')
          .classed('grayed', true)
        const legendEntry = d3.selectAll('.legendEntry').filter(`[data-index='${index}']`)
        legendEntry
          .classed('highlight', true)
          .classed('grayed', false)
      })
      .on('mouseout', function () {
        // Bring back all blobs
        d3.selectAll('.blipCircle')
          .transition().duration(cfg.transitionDurationMs)
          .attr('r', cfg.blipRadius)
        d3.select(this).select('.blipIndex')
          .transition().duration(cfg.transitionDurationMs)
          .attr('opacity', 1)
        tooltip
          .transition().duration(cfg.transitionDurationMs)
          .attr('opacity', 0)
          .attr('visibility', 'hidden')
        
        d3.selectAll('.legendEntry')
          .classed('highlight', false)
          .classed('grayed', false)
      })

    // blip circle
    radarWrapper
      .append('circle')
      .attr('r', 13)
      .attr('class', function (d: Blip) {
        return `blipCircle blipCircle-level-${d.level} blipCircle-category-${d.category}`
      })
    // blip number
    radarWrapper
      .append('text')
      .attr('class', 'blipIndex')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .text((d: Blip) => d.index + 1)

    // ###################
    // ###   Tooltip   ###
    // ###################
    tooltip = g
      .append('g')
      .attr('visibility', 'hidden')
      .attr('class', 'tooltip')
      .attr('opacity', 0)
    
    tooltip
      .append('rect')
      .attr('class', 'tooltipRectangle')
      .attr('height', '1.5em')
      .attr('y', '-2.5em')
      .attr('rx', 5) // corner radius
      .attr('anchor', 'middle')

    tooltip
      .append('text')
      .attr('class', 'tooltipText')
      .attr('text-anchor', 'middle')
      .text('hello world')
      .attr('y', '-1.5em')
      .attr('width', 100)
  }

  public drawLegend (id: string, data: SkillradarData, filterFn: (b: Blip) => boolean) {
    const blips = data.items
      .filter(filterFn)
      .sort((a: Blip, b: Blip) => {
        if (a.category === b.category) {
          return a.title > b.title ? 1 : -1
        }
        return a.category - b.category
      })
    const cfg = this.config
    
    d3.select(id).select('svg').remove()
    const g = d3.select(id)
      .append('svg')
      .attr('height', cfg.radius*2)
      .append('g')
      .attr('class', 'radar-legend')
    this.legends[id] = g

    // ####################
    // ### Legend Group ###
    // ####################
    const legendWrapper = g.selectAll('.legendWrapper') // eslint-disable-line @typescript-eslint/no-unused-vars
      .data(blips)
      .enter().append('a')
      .attr('href', (d: Blip) => `#/list/${d.title}`)
      .append('g')
      .attr('data-title', (d: Blip) => d.title)
      .attr('data-index', (d: Blip) => d.index)
      .attr('class', (d: Blip) => `legendEntry legendEntry-category-${d.category} legendEntry-level-${d.level}`)
      .on('mouseover', function () {
        const { index } = d3.select(this).data()[0] as Blip
        const blip = d3.selectAll('.blip').filter(`[data-index='${index}']`)
        blip.select('.blipCircle')
          .transition().duration(cfg.transitionDurationMs)
          .attr('r', cfg.blipRadius * cfg.blipRadiusHoverPercentage)
        blip.select('.blipIndex')
          .transition().duration(cfg.transitionDurationMs)
          .attr('opacity', 0)

        d3.selectAll('.legendEntry')
          .classed('grayed', true)
        d3.select(this)
          .classed('highlight', true)
          .classed('grayed', false)
      })
      .on('mouseout', function () {
        d3.selectAll('.blipCircle')
          .transition().duration(cfg.transitionDurationMs)
          .attr('r', cfg.blipRadius)
        d3.selectAll('.blipIndex')
          .transition().duration(cfg.transitionDurationMs)
          .attr('opacity', 1)
        d3.selectAll('.legendEntry')
          .classed('highlight', false)
          .classed('grayed', false)
      })
    const legendYoffset = (d: Blip, i: number) => `${(i + 1) * 2}em` // can not move <g> by em units so move individual elements
    legendWrapper
      .append('text')
      .attr('class', 'legendTitle')
      .attr('text-anchor', 'left')
      .attr('y', legendYoffset)
      .attr('x', '2em')
      .text((d: Blip) => this.limitString(d.title, cfg.titleCutOff))
    
    legendWrapper
      .append('text')
      .attr('class', 'legendIndex')
      .attr('text-anchor', 'middle')
      .attr('y', legendYoffset)
      .attr('x', '1em')
      .text((d: Blip) => d.index + 1)
  }
  public blip2rad (blip: Blip): CoordPolar {
    const categoryCount = 4
    let width: number
    if (blip.level === this.config.levelCount - 1) {
      width = this.level2radius(blip.level)
    } else {
      width = this.level2radius(blip.level) - this.level2radius(blip.level + 1)
    }
    const radialSegment = 2 * Math.PI / categoryCount
    return {
      angle: -blip.category * radialSegment + Math.PI / 4 + (getPseudoRand(blip.title) - 0.5) * radialSegment * 0.9,
      radius: this.level2radius(blip.level) - width/2 - (Math.sqrt(getPseudoRand(blip.title)) - 0.5) * width / 2 * 0.9
    }
  }
  public rad2xy ({ angle, radius}: CoordPolar): CoordCarthesian {
    return {
      x: radius * Math.cos(angle),
      y: -radius * Math.sin(angle)
    }
  }
  private level2radius (level: number): number {
    const levelCount = this.config.levelCount
    const radius = this.config.radius
    const innerFactor = 1.3
    const outerFactor = 1
    const factor = (level / levelCount) * (innerFactor - outerFactor) + outerFactor
    return radius / levelCount * (levelCount - level) * factor
  }
  private limitString (str: string, length: number): string {
    if (str.length > length) {
      return str.slice(0, length - 2) + '..'
    }
    return str
  }
}
