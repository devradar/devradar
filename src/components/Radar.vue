<template>
  <v-container id="radar-container">
    <div>
      <new-blib></new-blib>
      <v-btn
      v-on:click="arrangeBlips()">
        Arrange
      </v-btn>
    </div>
    <div class="radar" ref="radar">
      <div class="xline"></div>
      <div class="yline"></div>
      <div id="blips">
        <a v-for="blip in blips" v-bind:key="blip.id" class="blip blip--hidden" rel="tooltip" v-bind:href="blip.link" target="_blank" v-bind:data-category="blip.category" v-bind:data-status="blip.status" v-bind:data-changed="blip.changed" v-bind:title="blip.title">
          <span>{{blip.index}}</span>
        </a>
      </div>
      <div class="q1"><h3>Cloud Technologies</h3>
        <ul>
          <li v-for="blip in blips" v-bind:key="blip.id" v-if="blip.category === 'cloud'"><a v-bind:href="blip.link"><span class="blip-number">{{blip.index}}</span>{{blip.title}}</a></li>
        </ul>
      </div>
      <div class="q2"><h3>Tools</h3>
        <ul>
          <li v-for="blip in blips" v-bind:key="blip.id" v-if="blip.category === 'tools'"><a v-bind:href="blip.link"><span class="blip-number">{{blip.index}}</span>{{blip.title}}</a></li>
        </ul>
      </div>
      <div class="q3"><h3>Backend</h3>
        <ul>
          <li v-for="blip in blips" v-bind:key="blip.id" v-if="blip.category === 'backend'"><a v-bind:href="blip.link"><span class="blip-number">{{blip.index}}</span>{{blip.title}}</a></li>
        </ul>
      </div>
      <div class="q4"><h3>Datascience</h3>
        <ul>
          <li v-for="blip in blips" v-bind:key="blip.id" v-if="blip.category === 'datascience'"><a v-bind:href="blip.link"><span class="blip-number">{{blip.index}}</span>{{blip.title}}</a></li>
        </ul>
      </div>

      <div class="adopt"></div>
      <div class="trial"></div>
      <div class="assess"></div>
      <div class="hold"></div>
    </div>
  </v-container>
</template>

<script>
import NewBlib from './NewBlib'

export default {
  components: { NewBlib },
  computed: {
    blips () {
      return this.$store.getters.loadedBlips
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
        const category = b.dataset.category
        const status = b.dataset.status

        // Different radiuses depending on blips
        let width, radius
        switch (status) {
          case 'hold':
            radius = (getDomWidth('radar') - bWidth) / 2
            width = (getDomWidth('radar') - bWidth) / 2 - (getDomWidth('assess') - bWidth) / 2
            break
          case 'assess':
            radius = (getDomWidth('assess') - bWidth) / 2
            width = (getDomWidth('assess') - bWidth) / 2 - (getDomWidth('trial') - bWidth) / 2
            break
          case 'trial':
            radius = (getDomWidth('trial') - bWidth) / 2
            width = (getDomWidth('trial') - bWidth) / 2 - (getDomWidth('adopt') - bWidth) / 2
            break
          case 'adopt':
            radius = (getDomWidth('adopt') - bWidth) / 2
            width = radius = (getDomWidth('adopt') - bWidth) / 2
            break
        }

        // Different quadrants depending on area
        let quadrant
        switch (category) {
          case 'cloud':
            quadrant = 1
            break
          case 'tools':
            quadrant = 2
            break
          case 'backend':
            quadrant = 3
            break
          case 'datascience':
            quadrant = 4
            break
        }

        // Calculate things
        const radarx = (getDomWidth('radar') / 2) // TODO: maybe use height?
        const radary = (getDomWidth('radar') / 2)

        let rad = radius - width / 2
        let angle = (quadrant - 1) * Math.PI / 2 + Math.PI / 4
        rad += (Math.sqrt(Math.random()) - 0.5) * width * 0.9
        angle += (Math.random() - 0.5) * (Math.PI / 2) * 0.9

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
      if (mutation.type === 'setBlips') {
        setTimeout(() => this.arrangeBlips(), 50) // delay because blobs aren't in DOM yet
      }
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/radar.scss';
</style>
