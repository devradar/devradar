import { Blip } from '@/types/domain'
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
  legendCategorySpacingEms?: number;
  legendCategoryOffsetEms?: number;
  dark?: boolean;
  tooltipWidth?: number;
}

export interface SkillradarData {
  items: Blip[];
  levels: string[];
  categories: string[];
}

export interface CoordPolar {
  angle: number;
  radius: number;
}

export interface CoordCarthesian {
  x: number;
  y: number;
}

export interface BlipExtended extends Blip {
  detailsUrl?: string;
}

// wrap (existing) text within a svg <text> element by adding <tspan> attributes once maxLength is reached
function textWrap (textElm, maxLength) {
  textElm.each(function () {
    const elm = d3.select(this)
    const rootX = elm.attr('x')
    const rootY = elm.attr('y')
    const words = elm.text().split(/\s+/).reverse()
    const lineHeight = 1.1
    elm
      .append('tspan')
      .attr('x', rootX)
      .attr('y', rootY)
    let line = []
    let lineNumber = 0
    let tspan = elm.text(null)
    let word = words.pop()
    while (word) {
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > maxLength) {
        const lastWord = line.pop() // remove last element from line
        tspan.text(line.join(' '))
        line = [lastWord]
        tspan = textElm.append('tspan')
          .attr('x', rootX)
          .attr('y', rootY)
          .attr('dy', ++lineNumber * lineHeight + 'em')
      }
      word = words.pop()
    }
  })
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
      titleCutOff: 13,
      legendCategorySpacingEms: 8,
      legendCategoryOffsetEms: 2,
      dark: false,
      tooltipWidth: 320
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

  public drawChart (id: string, data: SkillradarData) : void {
    const cfg = this.config
    cfg.elementCount = data.items.length
    cfg.levelCount = data.levels.length

    const darkClass = cfg.dark ? 'dark' : ''
    // create a reference object with radar center being 0,0
    d3.select(id).select('svg').remove()
    const g = d3.select(id)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `-5 -5 ${2 * cfg.radius + 10} ${2 * cfg.radius + 10}`)
      .attr('class', `radar-chart ${darkClass}`)
      .style('overflow', 'visible')
      .append('g')
      .attr('transform', 'translate(' + (cfg.radius) + ',' + (cfg.radius) + ')')
    this.chartArea = g
    // drawn at the end to be placed on top
    let tooltip // eslint-disable-line prefer-const
    let isOverTooltip = false
    let isOverBlip = false
    // #############
    // ###  Grid ###
    // #############
    const gridWrapper = g.append('g').attr('class', `gridWrapper ${darkClass}`)

    // background circles
    gridWrapper.selectAll('.gridCircle')
      .data(d3.range(0, cfg.levelCount))
      .enter()
      .append('circle')
      .attr('class', `gridCircle ${darkClass}`)
      .attr('r', (d: number) => this.level2radius(d))

    // circle label
    gridWrapper.selectAll('.gridLabel')
      .data(d3.range(0, cfg.levelCount))
      .enter().append('text')
      .attr('class', (d: number) => `gridLabel label-${d} ${darkClass}`)
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
      .attr('href', (d: BlipExtended) => d.detailsUrl || '')
      .append('g')
      .attr('class', `blip ${darkClass}`)
      .attr('data-index', (d: BlipExtended) => d.index)
      .attr('transform', (d: BlipExtended) => 'translate(' + this.rad2xy(this.blip2rad(d)).x + ',' + this.rad2xy(this.blip2rad(d)).y + ')')
      .on('mouseover', function () {
        isOverBlip = true
        const blip = d3.select(this).data()[0] as BlipExtended
        d3.select(this).select('.blipCircle')
          .transition().duration(cfg.transitionDurationMs)
          .attr('r', cfg.blipRadius * cfg.blipRadiusHoverPercentage)
        d3.select(this).select('.blipIndex')
          .transition().duration(cfg.transitionDurationMs)
          .attr('opacity', 0)

        tooltip
          .attr('transform', (this.attributes as any).transform.value)
          .select('.tooltipTitle')
          .text(blip.title)
          .attr('class', `tooltipTitle category-${blip.category}`)

        const sortedChanges = blip.changes
          .sort((a, b) => a.date < b.date ? 1 : -1)
        const newLevel = sortedChanges[0].newLevel
        let prevLevel = null
        if (sortedChanges.length > 1) {
          prevLevel = sortedChanges[1].newLevel
        }
        tooltip
          .select('.tooltipLevel')
          .text(`${prevLevel !== null ? data.levels[prevLevel] + ' —' : '🔰'} ${data.levels[newLevel]}`)
        tooltip
          .select('.tooltipText')
          .text(sortedChanges[0].text.replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/gm, '$1'))
          .call(textWrap, cfg.tooltipWidth * 0.9)
        tooltip
          .select('.tooltipDate')
          .text(sortedChanges[0].date)
        tooltip
          .select('.tooltipRectangle')
          .attr('height', tooltip.select('.tooltipText').node().getBoundingClientRect().height + 60)
        tooltip
          .transition().duration(cfg.transitionDurationMs)
          .attr('visibility', 'visible')
          .attr('opacity', 1)

        d3.selectAll('.legendEntry')
          .classed('grayed', true)
        const legendEntry = d3.selectAll('.legendEntry').filter(`[data-index='${blip.index}']`)
        legendEntry
          .classed('highlight', true)
          .classed('grayed', false)
      })
      .on('mouseout', function () {
        isOverBlip = false
      })

    function deactivateTooltip () {
      if (isOverBlip || isOverTooltip) {
        return
      }
      // Bring back all blobs
      d3.selectAll('.blipCircle')
        .transition().duration(cfg.transitionDurationMs)
        .attr('r', cfg.blipRadius)
      d3.selectAll('.blipIndex')
        .transition().duration(cfg.transitionDurationMs)
        .attr('opacity', 1)
      tooltip
        .transition().duration(cfg.transitionDurationMs)
        .attr('opacity', 0)
        .attr('visibility', 'hidden')

      d3.selectAll('.legendEntry')
        .classed('highlight', false)
        .classed('grayed', false)
    }
    g.on('mouseover', deactivateTooltip)
    // blip circle
    radarWrapper
      .append('circle')
      .attr('r', 13)
      .attr('class', function (d: BlipExtended) {
        return `blipCircle blipCircle-level-${d.level} blipCircle-category-${d.category} ${darkClass}`
      })
    // blip number
    radarWrapper
      .append('text')
      .attr('class', `blipIndex ${darkClass}`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .text((d: BlipExtended) => d.index + 1)

    // ###################
    // ###   Tooltip   ###
    // ###################
    tooltip = g
      .append('g')
      .attr('visibility', 'hidden')
      .attr('class', `tooltip ${darkClass}`)
      .attr('opacity', 0)

    tooltip
      .append('rect')
      .attr('class', `tooltipRectangle ${darkClass}`)
      .attr('height', cfg.tooltipWidth)
      .attr('width', cfg.tooltipWidth)
      .attr('anchor', 'start')

    tooltip
      .append('text')
      .attr('class', `tooltipTitle ${darkClass}`)
      .attr('text-anchor', 'start')
      .attr('y', 20)
      .attr('x', 14)
      .attr('width', cfg.tooltipWidth * 0.9)
    tooltip
      .append('text')
      .attr('class', `tooltipDate ${darkClass}`)
      .attr('text-anchor', 'start')
      .attr('y', 42)
      .attr('x', 14)
      .attr('width', cfg.tooltipWidth * 0.6)
    tooltip
      .append('text')
      .attr('class', `tooltipLevel ${darkClass}`)
      .attr('text-anchor', 'end')
      .attr('y', 42)
      .attr('x', cfg.tooltipWidth - 20)
      .attr('width', cfg.tooltipWidth * 0.4)
    tooltip
      .append('text')
      .attr('class', `tooltipText ${darkClass}`)
      .attr('text-anchor', 'start')
      .attr('y', 70)
      .attr('x', 14)
      .attr('width', cfg.tooltipWidth * 0.8)
    tooltip.on('mouseover', function () {
      isOverTooltip = true
    }).on('mouseout', function () {
      isOverTooltip = false
    })
  }

  public drawLegend (id: string, data: SkillradarData, filterFn: (b: Blip) => boolean, direction: string) : void {
    const cfg = this.config
    const darkClass = cfg.dark ? 'dark' : ''
    const blips = data.items
      .filter(filterFn)
      .sort((a: Blip, b: Blip) => {
        if (a.category === b.category) {
          return a.title > b.title ? 1 : -1
        }
        if (direction === 'up') {
          return b.category - a.category
        }
        return a.category - b.category
      })
    const categories = blips.map((b: Blip) => b.category)
    const categoriesDistinct = categories.reduce((p: number[], c: number) => {
      if (!p.includes(c)) {
        p.push(c)
      }
      return p
    }, [])
    const levelMaxLength = Math.max(...data.levels.map((l: string) => l.length))

    // find legend width/height
    const legendTitleCharWidth = 8
    const legendTitleCharHeight = 16

    // can not move <g> by em units so move individual elements
    const legendYoffset = (categoryNumber: number, entryNumber: number) => {
      return (entryNumber * 2 + categoryNumber * cfg.legendCategorySpacingEms + cfg.legendCategoryOffsetEms) * legendTitleCharHeight
    }

    const maxLegendHeight = legendYoffset(2, blips.length)

    d3.select(id).select('svg').remove()
    const g = d3.select(id)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .style('overflow', 'visible')
      .attr('viewBox', `0 0 ${0.9 * cfg.radius} ${maxLegendHeight}`)
      .append('g')
      .attr('class', `radar-legend ${darkClass}`)
    this.legends[id] = g

    // ####################
    // ### Legend Group ###
    // ####################
    const legendWrapper = g.selectAll('.legendWrapper') // eslint-disable-line @typescript-eslint/no-unused-vars
      .data(blips)
      .enter().append('a')
      .attr('href', (d: BlipExtended) => d.detailsUrl || '')
      .append('g')
      .attr('data-title', (d: BlipExtended) => d.title)
      .attr('data-index', (d: BlipExtended) => d.index)
      .attr('class', (d: BlipExtended) => `legendEntry category-${d.category} level-${d.level} ${darkClass}`)
      .on('mouseover', function () {
        const { index } = d3.select(this).data()[0] as BlipExtended
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

    legendWrapper
      .append('polyline')
      .attr('class', `legendDecorator ${darkClass}`)
      .attr('points', (d: BlipExtended, i: number) => {
        const category = categories[i]
        const categoryNumber = categoriesDistinct.indexOf(category)
        const y = legendYoffset(categoryNumber, i + 1) + 2
        const x0 = 1 * legendTitleCharWidth
        const x1 = cfg.titleCutOff * legendTitleCharWidth + 2 * legendTitleCharHeight + (levelMaxLength + 2) * legendTitleCharWidth + cfg.legendCategoryOffsetEms * legendTitleCharHeight
        return `${x0 - 3},${y - 3} ${x0},${y} ${x1},${y} ${x1 + 3},${y + 3}`
      })

    legendWrapper
      .append('text')
      .attr('class', `legendTitle ${darkClass}`)
      .attr('text-anchor', 'left')
      .attr('y', (d: BlipExtended, i: number) => {
        const category = categories[i]
        const categoryNumber = categoriesDistinct.indexOf(category)
        return legendYoffset(categoryNumber, i + 1)
      })
      .attr('x', 2 * legendTitleCharHeight)
      .text((d: BlipExtended) => this.limitString(d.title, cfg.titleCutOff))

    legendWrapper
      .append('text')
      .attr('class', `legendIndex ${darkClass}`)
      .attr('text-anchor', 'middle')
      .attr('y', (d: BlipExtended, i: number) => {
        const category = categories[i]
        const categoryNumber = categoriesDistinct.indexOf(category)
        return legendYoffset(categoryNumber, i + 1)
      })
      .attr('x', 1 * legendTitleCharHeight)
      .text((d: BlipExtended) => d.index + 1)

    legendWrapper
      .append('text')
      .attr('class', `legendLevel ${darkClass}`)
      .attr('text-anchor', 'end')
      .attr('y', (d: BlipExtended, i: number) => {
        const category = categories[i]
        const categoryNumber = categoriesDistinct.indexOf(category)
        return legendYoffset(categoryNumber, i + 1)
      })
      .attr('x', (cfg.titleCutOff + levelMaxLength + 9) * legendTitleCharWidth) // no clue how to get rid of the magic 8; TODO: come up with a better way for calculating text width/height than magic numbers
      .text((d: BlipExtended) => data.levels[d.level])

    g.selectAll('.legendCategory')
      .data(categoriesDistinct)
      .enter().append('text')
      .attr('class', (d: number) => `legendCategory category-${d} ${darkClass}`)
      .attr('text-anchor', 'left')
      .attr('y', (d: number, i: number) => {
        // figure out how many entries have been printed "above" this category heading
        const previousEntries = blips
          .filter((b: Blip) => {
            if (direction === 'up') {
              return b.category > d
            }
            return b.category < d
          })
        return legendYoffset(i, previousEntries.length)
      })
      .attr('x', '0em')
      .text((d: number) => data.categories[d])
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
    const pseudoString = blip.title.repeat(parseInt(blip.id)) // increase entropy to quick-fix https://github.com/devradar/devradar/issues/16
    return {
      angle: -blip.category * radialSegment + Math.PI / 4 + (getPseudoRand(pseudoString) - 0.5) * radialSegment * 0.9,
      radius: this.level2radius(blip.level) - width / 2 - (Math.sqrt(getPseudoRand(pseudoString)) - 0.5) * width / 2 * 0.9
    }
  }

  public rad2xy ({ angle, radius }: CoordPolar): CoordCarthesian {
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
