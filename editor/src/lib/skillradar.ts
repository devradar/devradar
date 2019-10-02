import { ScaleOrdinal } from 'd3';
import { Blip } from '@/types/domain';
import * as d3 from 'd3'
import { getPseudoRand } from '../util'

export interface SkillradarOptions {
  levelCount?: number;
  radius?: number;
  elementCount?: number;
  blipRadius?: number;
  blipRadiusHoverPercentage?: number;
  maxValue?: number;
  opacityArea?: number;
  transitionDurationMs?: number;
  color?: ScaleOrdinal<number | string, number | string>;
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

  private chartArea: d3.Selection<SVGGElement, unknown, HTMLElement, any>

  public constructor (options: SkillradarOptions) {
    const cfg: SkillradarOptions = {
      radius: 300,
      maxValue: 10,
      opacityArea: 0.5,
      transitionDurationMs: 500,
      blipRadius: 13,
      blipRadiusHoverPercentage: 1.5,
      color: d3.scaleOrdinal(d3.schemeCategory10)
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
      angle: blip.category * radialSegment + Math.PI / 4 + (getPseudoRand(blip.title) - 0.5) * radialSegment * 0.9,
      radius: this.level2radius(blip.level) - width/2 // -  (Math.sqrt(getPseudoRand(blip.title)) - 0.5) * width / 2 * 0.9
    }
  }
  public rad2xy ({ angle, radius}: CoordPolar): CoordCarthesian {
    return {
      x: radius * Math.cos(angle),
      y: -radius * Math.sin(angle)
    }
  }
  private level2radius = (level: number): number => {
    const levelCount = this.config.levelCount
    const radius = this.config.radius
    const innerFactor = 1.3
    const outerFactor = 1
    const factor = (level / levelCount) * (innerFactor - outerFactor) + outerFactor
    return radius / levelCount * (levelCount - level) * factor
  }
  
  public draw (id: string, data: SkillradarData) {
    console.log(data)
    const cfg = this.config
    cfg.elementCount = data.items.length
    cfg.levelCount = data.levels.length

    // create a reference object with radar center being 0,0
    d3.select(id).select('svg').remove()
    const g = d3.select(id)
      .attr('class', 'svg-container')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${2 * cfg.radius} ${2 * cfg.radius}`)
      .attr('class', 'svg-content')
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
      .enter().append('g')
      .attr('class', 'blip')
      .attr('transform', (d: Blip) => 'translate(' + this.rad2xy(this.blip2rad(d)).x + ',' + this.rad2xy(this.blip2rad(d)).y + ')')
      .on('mouseover', function () {
        const { category, level, title } = d3.select(this).data()[0] as Blip
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
}
