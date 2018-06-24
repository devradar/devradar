<template>
  <v-container>
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
      <div id="blips" v-for="blip in blips" v-bind:key="blip.id">
        <a class="blip" rel="tooltip" v-bind:href="blip.link" target="_blank" v-bind:data-category="blip.category" v-bind:data-status="blip.status" v-bind:data-changed="blip.changed" v-bind:title="blip.title"></a>
      </div>
      <div class="q1"><h3>Cloud Technologies</h3>
        <ul v-for="blip in blips" v-bind:key="blip.id">
          <li v-if="blip.category === 'cloud'">{{blip.title}}</li>
        </ul>
      </div>
      <div class="q2"><h3>Tools</h3></div>
      <div class="q3"><h3>Datascience</h3></div>
      <div class="q4"><h3>Backend</h3></div>

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
  }),
  methods: {
    arrangeBlips () {
      function getDomWidth (domClass) {
        console.log(domClass)
        return document.getElementsByClassName(domClass)[0].clientWidth
      }
      const blips = document.getElementsByClassName('blip')
      for (const b of blips) {
        const bWidth = b.clientWidth
        const category = b.dataset.category
        const status = b.dataset.status
        console.log(category, status)

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
          case 'tools':
            quadrant = 1
            break
          case 'cloud':
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
        var radarx = (getDomWidth('radar') / 2) // TODO: maybe use height?
        var radary = (getDomWidth('radar') / 2)

        var rad = radius - width / 2
        var angle = (quadrant - 1) * Math.PI / 2 + Math.PI / 4

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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// Area (blip) colors
$q1: #0096A4;
$q2: #7DB58D;
$q3: #EC7632;
$q4: #A13F52;

.radar {
  .xline {
    content: '';
    width: 110%;
    height: 1px;
    background: rgba(lighten(black, 55%), .4);
    position: absolute;
    left: -5%;
    top: 50%;
    z-index: 100;
  }
  .yline {
    content: '';
    height: 110%;
    width: 1px;
    background: rgba(lighten(black, 55%), .4);
    position: absolute;
    left: 50%;
    top: -5%;
    z-index: 100;
  }
}

.radar {
  width: 60em;
  height: 60em;
  margin: 0 auto;
  margin-top: 4rem;
  background: lighten(black, 95%);
  border-radius: 50%;
  position: relative;
  margin-bottom: 4em;
}

.radar {
  .q1 {
    color: $q1;
    left: -3em;
    top: 0;
    position: absolute;
  }
  .q2 {
    color: $q2;
    right: -3em;
    top: 0;
    position: absolute;
  }
  .q3 {
    color: $q3;
    left: -3em;
    bottom: 0;
    position: absolute;
  }
  .q4 {
    color: $q4;
    right: -3em;
    bottom: 0;
    position: absolute;
  }
}

.q1 {
  z-index: 100;
  header {
    background: $q1;
    color: white;
  }
  ul {
    li {
      a {
        color: $q1;
      }
    }
  }
}

.q2 {
  z-index: 100;
  header {
    background: $q2;
    color: white;
  }
  ul {
    li {
      a {
        color: $q2;
      }
    }
  }
}

.q3 {
  z-index: 100;
  header {
    background: $q3;
    color: white;
  }
  ul {
    li {
      a {
        color: $q3;
      }
    }
  }
}

.q4 {
  z-index: 100;
  header {
    background: $q4;
    color: white;
  }
  ul {
    li {
      a {
        color: $q4;
      }
    }
  }
}

.radar {
  &:before {
    content: 'Hold';
    font-size: .6em;
    text-transform: uppercase;
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    text-align: center;
  }
}

.adopt {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: 35%;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  border: 2px solid white;
  background: lighten(black, 85%);
  z-index: 3;
  &:before {
    content: 'Adopt';
    font-size: .6em;
    text-transform: uppercase;
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    text-align: center;
  }
}

.trial {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: 20%;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: 2px solid white;
  background: lighten(black, 90%);
  z-index: 2;
  &:before {
    content: 'Trial';
    font-size: .6em;
    text-transform: uppercase;
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    text-align: center;
  }
}

.assess {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: 10%;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  border: 2px solid white;
  background: lighten(black, 92%);
  &:before {
    content: 'Assess';
    font-size: .6em;
    text-transform: uppercase;
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    text-align: center;
  }
}

.blip {
  display: block;
  width: 16px;
  height: 16px;
  border: 1px solid white;
  &:hover {
    animation: waves .1s ease-in-out 1 forwards;
  }
  border-radius: 50%;
  background: $q1;
  position: relative;
  top: 0;
  left: 0;
  z-index: 100;
  q1 {
    background: $q1;
  }
  q2 {
    background: $q2;
  }
  q3 {
    background: $q3;
  }
  q4 {
    background: $q4;
  }
}

</style>
