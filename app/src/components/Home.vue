<template>
  <v-container fluid>
    <v-container class="full-height-width-view ml-10 align-items-center">
      <v-container class="intro-radar-container">
        <img src="heading_radar.png" class="intro-radar-img" />
      </v-container>
      <v-container class="full-height-width-perc justify-space-around">
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
    </v-container>
    <v-container class="align-items-center">
      <v-container >
        <v-row align="center">
          <v-col>
            <img src="frameworks_mixed_screenshot.png" class="intro-frameworks-img" />
          </v-col>
          <v-col class="frameworks-text" cols=6>
            Track skills of different categories like <b>Frameworks, Tools, Platforms, Techniques, or custom</b> ones. <br />
            Keep track of your whole suite of knowledge in one single glance.
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <v-container class="align-items-center">
      <v-container fluid>
        <v-row align="center" align-content="center" justify="center">
          <v-col cols=4 lg=4 md=6 sm=12 xs=12>
            <v-container class="card-container">
              <v-card light raised height="400">
                <v-card-title class="card-title center-content">
                  <v-icon x-large>home</v-icon>
                  Serverless
                </v-card-title> 
                <v-card-text class="card-text center-content">
                  Host your own instance on Google Firebase with automatically integrated authentication, sophisticaed user management and full web-based blip editing.
                </v-card-text>

                <v-card-actions class="center-content">
                  <v-btn dark class="intro-button text-underlined">Start now</v-btn>
                </v-card-actions>
              </v-card>
            </v-container>
          </v-col>
          <v-col cols=4 lg=4 md=6 sm=12 xs=12>
            <v-container class="card-container">
              <v-card light raised height="400">
                <v-card-title class="card-title center-content">
                  <v-icon x-large>home</v-icon>
                  Serverless
                </v-card-title>
                <v-card-text class="card-text center-content">
                  Host your own instance on Google Firebase with automatically integrated authentication, sophisticaed user management and full web-based blip editing.
                </v-card-text>

                <v-card-actions class="center-content">
                  <v-btn dark class="intro-button text-underlined">Start now</v-btn>
                </v-card-actions>
              </v-card>
            </v-container>
          </v-col>
          <v-col cols=4 lg=4 md=6 sm=12 xs=12>
            <v-container class="card-container">
              <v-card light raised height="400">
                <v-card-title class="card-title center-content">
                  <v-icon x-large>home</v-icon>
                  Serverless
                </v-card-title>
                <v-card-text class="card-text center-content">
                  Host your own instance on Google Firebase with automatically integrated authentication, sophisticaed user management and full web-based blip editing.
                </v-card-text>

                <v-card-actions class="center-content">
                  <v-btn dark class="intro-button text-underlined">Start now</v-btn>
                </v-card-actions>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-container>
</template>


<style lang="scss">
.full-height-width-view {
  height: calc(100vh - 100px);
  width: 100vw;
}

.full-height-width-perc {
  height: 80%;
  width: 100%;
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

.frameworks-text {
  font-size: 1.5em;
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
  height: 35vw;
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
  font-size: 1.25em;
}

.card-container {
  width: 400px !important;
}

.center-card-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.card-title {
  font-size: 1.75em !important;
}

.card-text {
  margin-bottom: 10px;
  font-size: 1.1em !important;
  text-align: center;
}

</style>