<template>
  <v-container
    fluid
    grid-list-lg>
    <v-snackbar
      v-model="copiedSnackbar"
      color="success"
      :timeout="2000"
      >
      <v-icon dark>link</v-icon> URL copied
    </v-snackbar>
    <new-blip></new-blip>
    <new-change @submit="submitChange" @cancel="cancelChange" @close="cancelChange"></new-change>
    <v-layout row wrap>
      <v-flex xs6 sm4 md5>
        <v-text-field
          v-model="searchTitle"
          label="Search.."
          @input="searchUpdated"
          :append-icon="searchTitle ? 'clear' : ''"
          :append-icon-cb="searchClear"
          prepend-icon="search"
        >
        </v-text-field>
      </v-flex>
      <v-flex xs12 v-for="blip in filteredBlips" :key="blip.id">
        <v-card>
          <v-container fluid grid-list-lg>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                  <span class="headline" v-if="!isEditMode(blip)">
                    <a :href="blip.link" target="_blank">{{blip.title | limitString($config.blips.titleCutOff)}}</a>
                    <v-btn icon @click.stop="copyUrl(blip)"><v-icon>link</v-icon></v-btn>
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
                <v-chip small disabled color="green" text-color="white" @click.stop="showChangeDialog = !showChangeDialog">
                  <v-avatar class="green darken-4">
                    {{$config.states.indexOf(blip.status) + 1}}
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
          <div v-for="change in blip.changes" :key="change.id">
            <v-subheader>
              <span class="subheading">{{change.date}}</span>
                <v-chip small disabled>
                  <v-avatar>
                    {{$config.states.indexOf(change.newStatus) + 1}}
                  </v-avatar>
                  {{change.newStatus}}
                </v-chip>
              <v-btn icon
              v-if="isEditMode(blip)"
              @click.stop="deleteChange(blip, change)"><v-icon>delete</v-icon></v-btn>
              </v-subheader>
            <v-card-text>
              {{change.text}}
            </v-card-text>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon
            v-if="!isEditMode(blip)"
            @click.stop="editBlip(blip)"><v-icon>edit</v-icon></v-btn>
            <v-btn icon
            v-if="!isEditMode(blip)"
            @click.stop="addChange(blip)"><v-icon>playlist_add</v-icon></v-btn>
            <v-btn icon
            v-if="isEditMode(blip)"
            @click.stop="saveBlip(editBlips[blip.id])"><v-icon>done</v-icon></v-btn>
            <v-btn icon
            v-if="isEditMode(blip)"
            @click.stop="cancelEditBlip(blip)"><v-icon>clear</v-icon></v-btn>
            <v-btn icon
            v-if="isEditMode(blip) && !isDeleteMode(blip)"
            @click.stop="setDeleteMode(blip, true)"><v-icon>delete</v-icon></v-btn>
            <v-btn icon
            color="red"
            v-if="isEditMode(blip) && isDeleteMode(blip)"
            @click.stop="deleteBlip(blip)"><v-icon>delete</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import NewBlip from './NewBlip'
import NewChange from './NewChange'
import router from '../router'
import copy from 'clipboard-copy'

export default {
  components: { NewBlip, NewChange },
  computed: {
    blips () {
      const blips = this.$store.getters.blips
      return blips
    },
    filteredBlips () {
      const blips = this.blips
      return Object.keys(this.blips)
        .filter(id => new RegExp(this.searchTitle, 'i').exec(blips[id].title))
        .map(id => blips[id])
        .map(b => {
          b.changes = b.changes.sort((a, b) => a.date < b.date)
          return b
        })
        .sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase())
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
      showChangeDialog: false,
      editMode: [],
      searchTitle: this.search,
      blipForChange: null,
      copiedSnackbar: false
    }
  },
  methods: {
    deleteBlip (blip) {
      this.$store.dispatch('deleteBlip', blip)
    },
    addChange (blip) {
      this.blipForChange = blip
      this.showChangeDialog = true
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
      else router.replace({name: 'blips'})
    },
    searchClear () {
      this.searchTitle = ''
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
    },
    submitChange ({blip, change}) {
      this.$store.dispatch('addChange', {blip, change})
      this.showChangeDialog = false
      this.blipForChange = null
    },
    cancelChange (change) {
      this.blipForChange = null
      this.showChangeDialog = false
    },
    deleteChange (blip, change) {
      this.$store.dispatch('deleteChange', {blip, change})
    },
    copyUrl (blip) {
      const success = copy(`${window.location.origin}/#/blips/${blip.title}`)
      if (success) {
        this.copiedSnackbar = true
      } else {
        console.error(success)
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
