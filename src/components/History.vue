<template>
  <v-container
    fluid
    grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 v-for="blip in blips" v-bind:key="blip.id">
        <v-card>
          <v-container fluid grid-list-lg>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                  <span class="headline"><a v-bind:href="blip.link" target="_blank">{{blip.title}}</a></span>
              </v-flex>
              <v-flex xs12 sm6 text-xs-right>
                <v-chip small disabled color="cyan" text-color="white">
                  <v-avatar class="cyan darken-4">
                    <v-icon dark>domain</v-icon>
                  </v-avatar>
                  {{blip.category}}
                </v-chip>
                <v-chip small disabled color="green" text-color="white">
                  <v-avatar class="green darken-4">
                    {{['hold', 'assess', 'trial', 'adopt'].indexOf(blip.status) + 1}}
                  </v-avatar>
                  {{blip.status}}
                </v-chip>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-title>
            <div>
              <span class="grey--text">Number 10</span><br>
              <span>Whitehaven Beach</span><br>
              <span>Whitsunday Island, Whitsunday Islands</span>
            </div>
          </v-card-title>
          <v-card-text>
            {{blip}}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small flat color="primary darken-3" icon><v-icon>delete</v-icon></v-btn>
            <v-btn small flat color="primary darken-3" icon ><v-icon>edit</v-icon></v-btn>
            <v-btn small flat color="primary darken-3" icon><v-icon>history</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import NewBlib from './NewBlib'

export default {
  components: { NewBlib },
  computed: {
    blips () {
      return this.$store.getters.blips
    }
  },
  data: () => ({
  })
}
</script>

<style lang="scss" scoped>
.headline a {
  text-decoration: none;
  color: black;
}
</style>
