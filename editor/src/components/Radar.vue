<template>
  <v-container id="radar-container">
    <new-blip></new-blip>
    <div class="radar" ref="radar">
      <div id="blips">
        <router-link
          v-for="blip in blips"
          v-bind:key="blip.index"
          class="blip blip--hidden"
          :to="{ name: 'List', params: {search: blip.title}}"
          :data-category="blip.category"
          :data-state="blip.state"
          :data-changed="blip.changed"
          :title="blip.title"
          slot="activator"
        >
          <span
            >{{blip.index}}</span>
        </router-link>
      </div>
      <div :class="'q' + (ix+1)" v-for="(category, ix) in meta.categories" :key="ix"><h3>{{category}}</h3>
        <ul>
          <li
            v-for="blip in blipsByCategory[ix]"
            v-bind:key="blip.id"
          >
            <router-link
            :to="{ name: 'List', params: {search: blip.title}}"
            >
              <span class="blip-number">{{blip.index}}</span>
              {{blip.title | limitString($config.blips.titleCutOff)}}
              <span class="blip-state">{{meta.states[blip.state]}}</span>
              </router-link>
            </li>
        </ul>
      </div>
      <div class="adopt"><span class="state">{{meta.states[3]}}</span></div>
      <div class="trial"><span class="state">{{meta.states[2]}}</span></div>
      <div class="assess"><span class="state">{{meta.states[1]}}</span></div>
      <div class="hold"><span class="state">{{meta.states[0]}}</span></div>
    </div>
  </v-container>
</template>

<script>
import NewBlip from './NewBlip'
import { getPseudoRand } from '../util'

export default {
  components: { NewBlip },
  computed: {
    blips () {
      const b = JSON.parse(JSON.stringify(this.$store.getters.blipsWithIndex))
      return b
        .filter(b => b.state >= 0 && b.state <= 3)
        .map(b => {
          b.index = b.index + 1 // offset index by one for human display
          return b
        })
    },
    blipsByCategory () {
      return this.blips
        .reduce((p, c) => {
          const cat = c.category
          if (p[cat]) {
            p[cat].push(c)
          } else {
            p[cat] = [c]
          }
          return p
        }, {})
    },
    meta () {
      return this.$store.getters.meta
    }
  },
  data: () => ({
    previousRadarSize: 0 // help detect resize due to SCSS breakpoints in this.handleResize()
  }),
  methods: {
    arrangeBlips () {
      function getDomWidth (domClass) {
        return document.getElementsByClassName(domClass)[0].clientWidth
      }
      const blips = document.getElementsByClassName('blip')
      for (let b of blips) {
        const bWidth = b.clientWidth
        const category = parseInt(b.dataset.category)
        const state = parseInt(b.dataset.state)

        // Different radiuses depending on blips
        let width, radius
        switch (state) {
          case 0:
            radius = (getDomWidth('radar') - bWidth) / 2
            width = (getDomWidth('radar') - bWidth) / 2 - (getDomWidth('assess') - bWidth) / 2
            break
          case 1:
            radius = (getDomWidth('assess') - bWidth) / 2
            width = (getDomWidth('assess') - bWidth) / 2 - (getDomWidth('trial') - bWidth) / 2
            break
          case 2:
            radius = (getDomWidth('trial') - bWidth) / 2
            width = (getDomWidth('trial') - bWidth) / 2 - (getDomWidth('adopt') - bWidth) / 2
            break
          case 3:
            radius = (getDomWidth('adopt') - bWidth) / 2
            width = radius = (getDomWidth('adopt') - bWidth) / 2
            break
        }

        // Different quadrants depending on area
        const quadrant = category + 1

        // Calculate things
        const radarx = (getDomWidth('radar') / 2) // TODO: maybe use height?
        const radary = (getDomWidth('radar') / 2)

        let rad = radius - width / 2
        let angle = (quadrant - 1) * Math.PI / 2 + Math.PI / 4
        rad += (Math.sqrt(getPseudoRand(b.title)) - 0.5) * width / 2 * 0.9
        angle += (getPseudoRand(b.title) - 0.5) * (Math.PI / 2) * 0.9

        let x = rad * Math.cos(angle) + radarx
        let y = -rad * Math.sin(angle) + radary // use negative values to go up instead of down on x/y pane

        // offset blip size
        x -= (bWidth / 2)
        y -= (bWidth / 2)

        // Now position the blip
        b.style.left = `${x}px`
        b.style.top = `${y}px`

        // add class for color and make visible
        b.classList.add(`blip--q${quadrant}`)
        b.classList.remove('blip--hidden')
      }
    },
    handleResize () {
      const radar = document.getElementsByClassName('radar')[0]
      if (radar.clientWidth !== this.previousRadarSize) {
        this.previousRadarSize = radar.clientWidth
        this.arrangeBlips()
      }
    }
  },
  mounted: function () {
    this.$store.subscribe((mutation, state) => {
      if (['setBlips', 'addBlip', 'exchangeBlip', 'deleteBlip'].indexOf(mutation.type) > -1) {
        setTimeout(() => this.arrangeBlips(), 50) // delay because blobs aren't in DOM yet
      }
    })
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/radar.scss';
</style>
