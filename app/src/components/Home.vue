<template>
  <v-container fluid>
    <login></login>
    <v-container class="full-height-width-view align-items-col margin-left-10">
        <v-row >
          <v-col class="intro-heading-spacing" lg=12 md=12 sm=12 xs=12>
            <h1 class="intro-heading">Competence Management <br /> for developers</h1>
          </v-col>
        </v-row>
        <v-container class="intro-radar-container">
          <img src="heading_radar.png" class="intro-radar-img" />
        </v-container>
        <v-row>
          <v-col class="intro-text" lg=5 md=6 sm=10 xs=12>
            Manage your competences as an individual or use devradar to create a team wide skill matrix.
          </v-col>
        </v-row>
        <v-row>
          <v-col class="intro-listing-container" lg=4 md=8 sm=10 xs=12>
            <ul class="intro-listing">
              <li>Manage skills via web UI</li>
              <li>View all skills in a list or radar view</li>
              <li>Import/Export via .toml files</li>
              <li>Overlay your teams devradars</li>
            </ul>
          </v-col>
        </v-row>
        <v-row row>
          <v-col lg=4 md=8 sm=10 xs=12>
            <v-btn
              dark
              href="/login"
              class="intro-button green-bottom-border">Get Started
            </v-btn>
            <v-btn
              dark
              href="http://docs.devradar.io/howto"
              target="_blank"
              class="intro-button green-bottom-border">Learn More
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Login from '@/components/Login.vue'

@Component({
  components: { Login }
})
export default class App extends Vue {

}
</script>

<style lang="scss">
@import '../assets/responsive.scss';

.margin-left-10 {
  margin-left: 10px !important;
}

.full-height-width-view {
  height: 100%;
  width: 100%;
}

.align-items-col {
  display: flex;
  flex-direction: column;
}

.align-items-center {
  display: flex;
  align-items: center;
}

.center-content {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.intro-heading-spacing {
  margin-bottom: 3vw;
}

.intro-listing {
  list-style-type: none ;
  padding-left: 0 !important;
}

.intro-listing li::before {
  content: "| ";
  width: 25px;
  height: 25px;
  padding-right: 10px;
}

.green-bottom-border:hover::after {
    content: '';
    width: 80%;
    position: absolute;
    left: 10%;
    bottom: 1px;

    border-width: 0 0 1px;
    border-style: solid;
    border-color: #27db2b;
}

.intro-heading {
  font-size: 5vw;
  line-height: 125%;
}

.intro-text {
  font-size: 1.25em;
}

.intro-button {
    margin-right: 10px;
    margin-top: 20px;
}

@include larger($breakpoint-sm) {
.intro-radar-container {
    width: 80vw;
    height: 80vh;
    position: absolute;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .intro-radar-img {
    object-fit: contain;
    max-width: 130%;
    max-height: 120%;
    min-width: 80%;
    min-height: 80%;
    width: auto;
    height: auto;

    position: absolute;
    bottom: -25vh;
    right: -15vw;
  }
}

@include between($breakpoint-md, $breakpoint-lg) {
  .intro-radar-container {
    width: 75vw;
    height: 75vh;
  }
}

@include between($breakpoint-sm, $breakpoint-md) {
  .intro-heading {
    font-size: 5.8vw;
  }

  .intro-radar-container {
    width: 70vw;
    height: 70vh;
  }

  .intro-radar-img {
    max-width: 120%;
    max-height: 110%;
    min-width: 70%;
    min-height: 70%;
  }
}

@include smaller($breakpoint-sm) {
  .intro-heading {
    font-size: 7vw;
  }

  .intro-heading-spacing {
    margin-bottom: 0;
  }

  .intro-text {
    font-size: 1.1em;
  }

  .intro-listing {
    font-size: 1em;
  }

  .intro-radar-container {
    display: flex;
    justify-content: center;
    position: relative;

    margin-top: 20px;
    margin-bottom: 20px;
  }

  .intro-radar-img {
    width: 55vw;
    height: 55vw;
  }
}
</style>
