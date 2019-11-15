<template>
  <v-container fluid>
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
          <v-col class="intro-buttons" lg=4 md=8 sm=10 xs=12>
            <v-btn 
              dark 
              href="/login"
              class="intro-button text-underlined">Get Started
            </v-btn>
            <v-btn 
              dark 
              href="http://devradar.io/howto"
              target="_blank"
              class="intro-button">Learn More
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
  </v-container>
</template>


<style lang="scss">
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

@media (max-width: 1099px) {  
  .intro-radar-container {
    display: flex;
    justify-content: center;
    position: relative;

    margin-top: 20px;
    margin-bottom: 20px;
  }

  .intro-radar-img {
    width: 55vw;
  }
}

@media (min-width: 1100px) {
  .intro-radar-container {
    width: 75vw;
    height: 80vh;
    position: absolute;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .intro-radar-img {
    object-fit: contain;
    max-width: 120%;
    max-height: 110%;
    width: auto;
    height: auto;
    
    position: absolute;
    bottom: -30vh;
    right: -15vw;
  }
}

@media (min-width: 1500px) {
  .intro-radar-container {
    width: 75vw;
    height: 75vh;
    position: absolute;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .intro-radar-img {
    object-fit: contain;
    max-width: 130%;
    max-height: 120%;
    width: auto;
    height: auto;
    
    position: absolute;
    bottom: -25vh;
    right: -10vw;  
  }
}

@media (min-width: 1700px) {
  .intro-radar-container {
    width: 75vw;
    max-height: 75vh;
    position: absolute;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .intro-radar-img {
    object-fit: contain;
    max-width: 130%;
    max-height: 120%;
    width: auto;
    height: auto;
    
    position: absolute;
    bottom: -25vh;
    right: -10vw;
  }
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

.intro-button {
    margin-top: 20px;
}

@media (max-width: 520px) {
  .intro-heading {
    font-size: 9vw;
    line-height: 125%;
  }
  
  .intro-heading-spacing {
    margin-bottom: 0;
  }
  
  .intro-text {
    font-size: 1em;
  }

  .intro-listing {
    font-size: 0.9em;
  }
}

@media (min-width: 521px) and (max-width: 1099px) {
  .intro-heading {
    font-size: 7vw;
    line-height: 125%;
  }
}

</style>