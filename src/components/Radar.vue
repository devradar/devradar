<template>
  <v-container id="radar-container">
    <new-blip></new-blip>
    <div class="radar" ref="radar">
      <div id="blips">
        <router-link
          v-for="blip in blips"
          v-bind:key="blip.id"
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
      <div :class="'q' + (ix+1)" v-for="(category, ix) in $config.categories" :key="ix"><h3>{{category}}</h3>
        <ul>
          <li
            v-for="blip in blipsByCategory[category]"
            v-bind:key="blip.id"
          >
            <router-link
            :to="{ name: 'List', params: {search: blip.title}}"
            >
              <span class="blip-number">{{blip.index}}</span>
              {{blip.title | limitString($config.blips.titleCutOff)}}
              <span class="blip-state">{{blip.state}}</span>
              </router-link>
            </li>
        </ul>
      </div>
      <div class="adopt"><span class="state">{{$config.states[3]}}</span></div>
      <div class="trial"><span class="state">{{$config.states[2]}}</span></div>
      <div class="assess"><span class="state">{{$config.states[1]}}</span></div>
      <div class="hold"><span class="state">{{$config.states[0]}}</span></div>
    </div>
  </v-container>
</template>

<script>
import NewBlip from './NewBlip'

export default {
  components: { NewBlip },
  computed: {
    blips () {
      return this.$store.getters.blipsArray
        .filter(b => this.$config.states.slice(0, 4).indexOf(b.state) > -1)
    },
    blipsByCategory () {
      return this.$store.getters.blipsArray
        .filter(b => this.$config.states.slice(0, 4).indexOf(b.state) > -1)
        .reduce((p, c) => {
          const cat = c.category
          if (p[cat]) {
            p[cat].push(c)
          } else {
            p[cat] = [c]
          }
          return p
        }, {})
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
      // generate hash from string
      function getHash (string) {
        let h = 0
        for (const char of string) {
          h = ((h << 5) - h) + char.charCodeAt(0)
          h |= 0
        }
        return h
      }
      // create 0..1 pseudo random from string
      function getPseudoRand (string) {
        const h = getHash(string)
        // convert signed int32 space to 0..1 float
        return (h + Math.pow(2, 31)) / Math.pow(2, 32)
      }
      const blips = document.getElementsByClassName('blip')
      for (let b of blips) {
        const bWidth = b.clientWidth
        const category = b.dataset.category
        const state = b.dataset.state

        // Different radiuses depending on blips
        let width, radius
        const states = this.$config.states
        switch (state) {
          case states[0]:
            radius = (getDomWidth('radar') - bWidth) / 2
            width = (getDomWidth('radar') - bWidth) / 2 - (getDomWidth('assess') - bWidth) / 2
            break
          case states[1]:
            radius = (getDomWidth('assess') - bWidth) / 2
            width = (getDomWidth('assess') - bWidth) / 2 - (getDomWidth('trial') - bWidth) / 2
            break
          case states[2]:
            radius = (getDomWidth('trial') - bWidth) / 2
            width = (getDomWidth('trial') - bWidth) / 2 - (getDomWidth('adopt') - bWidth) / 2
            break
          case states[3]:
            radius = (getDomWidth('adopt') - bWidth) / 2
            width = radius = (getDomWidth('adopt') - bWidth) / 2
            break
        }

        // Different quadrants depending on area
        let quadrant
        const categories = this.$config.categories
        switch (category) {
          case categories[0]:
            quadrant = 1
            break
          case categories[1]:
            quadrant = 2
            break
          case categories[2]:
            quadrant = 3
            break
          case categories[3]:
            quadrant = 4
            break
        }

        // Calculate things
        const radarx = (getDomWidth('radar') / 2) // TODO: maybe use height?
        const radary = (getDomWidth('radar') / 2)

        let rad = radius - width / 2
        let angle = (quadrant - 1) * Math.PI / 2 + Math.PI / 4
        rad += (Math.sqrt(getPseudoRand(b.title + state)) - 0.5) * width / 2 * 0.9
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
