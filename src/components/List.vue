<template>
  <v-container
    fluid
    grid-list-lg>
    <new-blip></new-blip>
    <v-icon>edit</v-icon>
    <v-layout row wrap>
      <v-flex xs6 sm4 md3>
          <v-icon>search</v-icon>
          <v-text-field
            v-model="searchTitle"
            label="Search.."
            v-on:input="searchUpdated"
          ></v-text-field>
      </v-flex>
      <v-flex xs12 v-for="blip in filteredBlips" v-bind:key="blip.id">
        <v-card>
          <v-container fluid grid-list-lg>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                  <span class="headline" v-if="!isEditMode(blip)">
                    <a v-bind:href="blip.link" target="_blank">{{blip.title | limitString($config.blips.titleCutOff)}}</a>
                  </span>
                  <v-text-field
                  v-model="editBlips[blip.id].title"
                  v-if="isEditMode(blip)"
                  label="Title"
                  required
                  ></v-text-field>
                  <v-text-field
                  v-model="editBlips[blip.id].link"
                  v-if="isEditMode(blip)"
                  label="Link"
                  required
                  ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 text-xs-right>
                <v-chip small disabled color="cyan" text-color="white">
                  <v-avatar class="cyan darken-4">
                    <v-icon dark>domain</v-icon>
                  </v-avatar>
                  <span>{{blip.category}}</span>
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
            <span class="body-2" v-if="!isEditMode(blip)">{{blip.description}}</span>
            <v-text-field
              multi-line
              v-model="editBlips[blip.id].description"
              v-if="isEditMode(blip)"
              label="Description"
              ></v-text-field>
          </v-card-title>
          <div v-for="change in blip.changes" v-bind:key="change.id">
            <v-subheader>
              <span class="subheading">{{ new Date(change.date.seconds*1000).toISOString().split('T')[0] }}</span>
              </v-subheader>
            <v-card-text>
              {{change.text}}
            </v-card-text>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon
            v-if="!isEditMode(blip)"
            v-on:click="editBlip(blip)"><v-icon>edit</v-icon></v-btn>
            <v-btn icon
            v-if="!isEditMode(blip)"
            v-on:click="addHistory(blip)"><v-icon>playlist_add</v-icon></v-btn>
            <v-btn icon
            v-if="isEditMode(blip)"
            v-on:click="saveBlip(editBlips[blip.id])"><v-icon>done</v-icon></v-btn>
            <v-btn icon
            v-if="isEditMode(blip)"
            v-on:click="cancelEditBlip(blip)"><v-icon>clear</v-icon></v-btn>
            <v-btn icon
            v-if="isEditMode(blip) && !isDeleteMode(blip)"
            v-on:click="setDeleteMode(blip, true)"><v-icon>delete</v-icon></v-btn>
            <v-btn icon
            color="red"
            v-if="isEditMode(blip) && isDeleteMode(blip)"
            v-on:click="deleteBlip(blip)"><v-icon>delete</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import NewBlip from './NewBlip'
import router from '../router'

export default {
  components: { NewBlip },
  computed: {
    blips () {
      const blips = this.$store.getters.blips
      return blips
    },
    filteredBlips () {
      if (!this.searchTitle) return this.blips
      const blips = this.blips
      return Object.keys(this.blips)
        .filter(id => new RegExp(this.searchTitle, 'i').exec(blips[id].title))
        .map(id => blips[id])
    }
  },
  props: {
    search: String
  },
  data: function () {
    return {
      edit: false,
      editBlips: {},
      deleteMode: [],
      editMode: [],
      searchTitle: this.search
    }
  },
  methods: {
    deleteBlip (blip) {
      this.$store.dispatch('deleteBlip', blip)
    },
    addHistory (blip) {
    },
    editBlip (blip) {
      this.editBlips[blip.id] = {...blip}
      this.editMode.push(blip.id)
    },
    saveBlip (blip) {
      const updatedBlip = blip
      this.editMode = this.editMode.filter(id => id !== blip.id)
      delete this.editBlips[blip.id]
      this.$store.dispatch('updateBlip', updatedBlip)
      this.setDeleteMode(blip, false) // deactivate potential delete mode
    },
    cancelEditBlip (blip) {
      this.editMode = this.editMode.filter(id => id !== blip.id)
      delete this.editBlips[blip.id]
      this.setDeleteMode(blip, false) // deactivate potential delete mode
    },
    isEditMode (blip) {
      return this.editMode.indexOf(blip.id) >= 0
    },
    searchUpdated () {
      if (this.searchTitle) router.replace({name: 'blips', params: {search: this.searchTitle}})
    },
    isDeleteMode (blip) {
      return this.deleteMode.indexOf(blip.id) >= 0
    },
    setDeleteMode (blip, isActive) {
      if (isActive) {
        this.deleteMode.push(blip.id)
      } else {
        this.deleteMode = this.deleteMode.filter(id => id !== blip.id)
      }
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
