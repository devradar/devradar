<template>
  <v-container fluid>
    <v-container class="intro-radar-container">
      <img src="heading_radar.png" class="intro-radar-img" />
    </v-container>
    <v-container class="full-height-width">
      <v-row>
        <v-row >
          <v-col cols=12 class="intro-heading-spacing">
            <h1 class="intro-heading">Competence Management <br /> for developers</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row row>
              <v-col class="intro-text" cols=6 lg=4 md=6 sm=8 xs=12>
                Manage your skills as an individual using the devradar editor or track competence management within your team by using both the editor and the devradar teams app.
              </v-col>
            </v-row>
            <v-row row>
              <v-col class="intro-listing-container" cols=8>
                <ul class="intro-listing">
                  <li>Manage skills via web UI</li>
                  <li>View all skills in a list or radar view</li>
                  <li>Import/Export via .toml files</li>
                  <li>Overlay your teams devradars</li>
                </ul>
              </v-col>
            </v-row>
            <v-row row>
              <v-col class="intro-buttons" cols=8>
                <v-btn dark class="intro-button text-underlined">Get Started</v-btn>
                <v-btn dark class="intro-button">Learn More</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-row>
    </v-container>
    <v-container class="full-height-width">
      <v-row row>
        <v-col>
          <img src="frameworks_screenshot.png" class="intro-frameworks-img" />
        </v-col>
        <v-col class="intro-listing-container" cols=6>
          Manage your skills as an individual using the devradar editor or track competence management within your team by using both the editor and the devradar teams app.
        </v-col>
      </v-row>
    </v-container>
    <v-container class="full-height-width">
      <v-row row>
        <v-col cols=4>
          <v-card light >
            <v-card-title>
              Free Personal Radar
            </v-card-title>
            <v-card-text>
              Free Personal Radar

              <v-btn dark class="intro-button text-underlined">Get Started</v-btn>
                <v-btn dark class="intro-button">Learn More</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols=4>
          <v-card light >
            <v-card-title>
              Free Personal Radar
            </v-card-title>
            <v-card-text>
              Loading radar..
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols=4>
          <v-card light >
            <v-card-title>
              Free Personal Radar
            </v-card-title>
            <v-card-text>
              Loading radar..
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>


<style lang="scss">
.full-height-width {
  height: 100vh;
  width: 100vw;
}

.intro-heading-spacing {
  
}

.intro-radar-container {
  position: absolute;
  right: -50vw;
}

.intro-radar-img {
  height: 50vw;
  position: relative;
  bottom: 0;
}

.intro-frameworks-img {
  height: 25vw;
  position: relative;

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

.intro-button {
  margin-right: 10px;
}

.text-underlined:after {
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
  line-height: 100%;
}

.intro-text {
  font-size: 1.5rem;
}

</style>