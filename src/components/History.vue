<template>
  <v-container
    fluid
    grid-list-lg>
    <new-blib v-if="edit"></new-blib>
    <v-btn
        @click="edit = !edit"
        color="secondary"
        fab
        fixed
        bottom
        left
    >
    <v-icon>edit</v-icon>
    </v-btn>
    <v-layout row wrap>
      <v-flex xs12 v-for="blip in blips" v-bind:key="blip.id">
        <v-card>
          <v-container fluid grid-list-lg>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                  <span class="headline">
                    <a v-bind:href="blip.link" target="_blank">{{blip.title}}</a>
                    <v-btn icon v-if="edit" v-on:click="deleteBlip(blip.id)"><v-icon>delete</v-icon></v-btn>
                    <v-btn icon v-if="edit" v-on:click="editBlip(blip.id)"><v-icon>edit</v-icon></v-btn>
                    <v-btn icon v-if="edit" v-on:click="addHistory(blip.id)"><v-icon>add</v-icon></v-btn>
                    <v-btn icon disabled></v-btn>
                  </span>
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
            <span class="body-2">{{blip.description}}</span>
          </v-card-title>
          <div v-for="change in blip.changes" v-bind:key="change.id">
            <v-subheader>
              <span class="subheading">{{ new Date(change.date.seconds*1000).toISOString().split('T')[0] }}</span>
              </v-subheader>
            <v-card-text>
              {{change.text}}
            </v-card-text>
          </div>
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
      const blips = this.$store.getters.blips
      return blips
    }
  },
  data: () => ({
    edit: false
  }),
  methods: {
    deleteBlip (blipId) {
      console.log('delete blip', blipId)
    },
    addHistory (blipId) {

    },
    editBlip (blipId) {

    }
  }
}
</script>

<style lang="scss" scoped>
.headline a {
  text-decoration: none;
  color: black;
}
</style>
