<template>
    <v-card>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 sm6>
              <span class="headline" v-if="!isEditMode">
                <a :href="blip.link" target="_blank">{{blip.title | limitString($config.blips.titleCutOff)}}</a>
                <v-btn icon @click.stop="copyUrl(blip)"><v-icon>link</v-icon></v-btn>
              </span>
              <v-text-field
              v-model="tempBlip.title"
              v-if="isEditMode"
              label="Title"
              required
              ></v-text-field>
              <v-text-field
              v-model="tempBlip.link"
              v-if="isEditMode"
              label="Link"
              required
              ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 text-xs-right>
            <v-chip small disabled class="bold">
              <v-avatar class="primary">
                <v-icon dark>domain</v-icon>
              </v-avatar>
              <span>{{meta.categories[blip.category]}}</span>
            </v-chip>
            <v-chip small disabled class="bold" @click.stop="addChange(blip)">
              <v-avatar class="primary">
                {{blip.state}}
              </v-avatar>
              {{meta.states[blip.state]}}
            </v-chip>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-title>
        <span v-if="!isEditMode" v-html="markdown(blip.description)"></span>
        <v-textarea
          v-model="tempBlip.description"
          v-if="isEditMode"
          label="Description"
          ></v-textarea>
      </v-card-title>
      <div v-for="change in blip.changes" :key="change.id">
        <v-divider></v-divider>
        <v-subheader>
          <span class="subheading">{{change.date}}</span>
            <v-chip small disabled class="bold">
              <v-avatar color="primary">
                {{change.newState}}
              </v-avatar>
              {{meta.states[change.newState]}}
            </v-chip>
          <v-btn icon
          v-if="isEditMode && blip.changes.length > 1"
          @click.stop="deleteChange(blip, change)"><v-icon>delete</v-icon></v-btn>
          </v-subheader>
        <v-card-text class="change-text" v-html="markdown(change.text)">
        </v-card-text>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon
        v-if="!isEditMode && userCanEdit"
        @click.stop="editBlip()"><v-icon>edit</v-icon></v-btn>
        <v-btn icon
        v-if="!isEditMode && userCanEdit"
        @click.stop="addChange()"><v-icon>playlist_add</v-icon></v-btn>
        <v-btn icon
        v-if="isEditMode"
        @click.stop="saveBlip()"><v-icon>done</v-icon></v-btn>
        <v-btn icon
        v-if="isEditMode"
        @click.stop="cancelEditBlip()"><v-icon>clear</v-icon></v-btn>
        <v-btn icon
        v-if="isEditMode && !isDeleteMode"
        @click.stop="isDeleteMode = true"><v-icon>delete</v-icon></v-btn>
        <v-btn icon
        color="error"
        v-if="isEditMode && isDeleteMode"
        @click.stop="deleteBlip()"><v-icon>delete</v-icon></v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
import copy from 'clipboard-copy'
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
export default {
  computed: {
    userCanEdit () {
      return this.$store.getters.userCanEdit
    },
    meta () {
      return this.$store.getters.meta
    }
  },
  props: {
    blip: Object
  },
  data: function () {
    return {
      isEditMode: false,
      tempBlip: {},
      isDeleteMode: false,
      showChangeDialog: false,
      blipForChange: null
    }
  },
  methods: {
    deleteBlip () {
      this.$store.dispatch('deleteBlip', this.blip)
    },
    addChange () {
      if (!this.userCanEdit) return
      this.$emit('addChange', this.blip.id)
    },
    editBlip () {
      this.tempBlip = { ...this.blip }
      this.isEditMode = true
    },
    saveBlip () {
      const updatedBlip = this.tempBlip
      updatedBlip.changes = this.blip.changes // update in case changes were deleted
      this.isEditMode = false
      this.$store.dispatch('updateBlip', updatedBlip)
      this.isDeleteMode = false
    },
    cancelEditBlip () {
      this.isEditMode = false
      this.isDeleteMode = false
    },
    deleteChange (blip, change) {
      this.$store.dispatch('deleteChange', { blip, change })
    },
    copyUrl () {
      const b = this.blip
      let url = `${window.location.origin}/#/${this.$config.routes.find(r => r.view === 'List').rootPath}/${b.title}`
      url = url.replace(/([^:]\/)\/+/g, '$1') // remove potential duplicate //, except http(s)://
      const success = copy(url)
      if (success) {
        this.$store.dispatch('showSnackbar', 'Skill URL copied to clipboard')
      } else {
        console.error(success)
      }
    },
    markdown (string = '') {
      if (!string || string.length === 0) return ''
      return md.render(string)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/common.scss';

.headline a {
  text-decoration: none;
  color: black;
}
.subheading {
  margin-right: 1vw;
}
.change-text {
  margin-left: 1vw;
}
.bold {
  font-weight: bold;
}
.v-chip .v-avatar {
  color: #fff !important;
}
.v-chip {
  color: #666 !important;
}
</style>
