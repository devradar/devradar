<template>
    <v-card data-cy="blip">
      <v-container>
        <v-row justify="space-around">
          <v-col cols="12" sm="6">
              <v-card-title class="headline" :class="{ dark: darkMode }" v-if="!isEditMode">
                <a v-if="blip.link && blip.link.length > 0" :href="blip.link" target="_blank" data-cy="blip-title">{{blip.title | limitString(blipTitleCutOff)}}</a>
                <span v-else data-cy="blip-title">{{blip.title | limitString(blipTitleCutOff)}}</span>
              </v-card-title>
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
          </v-col>
          <v-col cols="12" sm="6">
            <v-row>
              <v-col cols="12" style="text-align: right; padding: 6px !important;">
                <v-chip
                  class="bold"
                  color="primary"
                  @click.stop="addChange(blip)"
                >
                  <v-avatar
                    left
                  >
                    {{blip.level + 1}}
                  </v-avatar>
                  {{meta.levels[blip.level]}}
                </v-chip>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="text-align: right; padding: 6px !important;">
                <v-chip
                  class="bold"
                  color="primary"
                >
                  <v-avatar left>
                    <v-icon>domain</v-icon>
                  </v-avatar>
                  {{meta.categories[blip.category]}}
                </v-chip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text>
        <span v-if="!isEditMode" v-html="markdown(blip.description)"></span>
        <v-textarea
          v-model="tempBlip.description"
          v-if="isEditMode"
          label="Description"
          ></v-textarea>
      </v-card-text>
      <div v-for="change in blip.changes" :key="change.id">
        <v-divider></v-divider>
        <v-subheader>
          <span class="title">{{change.date}}</span>
            <v-chip
              :color="darkMode ? 'white' : 'black'"
              outlined
            >
              <v-avatar
                left
              >
                {{change.newLevel + 1}}
              </v-avatar>
              {{meta.levels[change.newLevel]}}
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
        data-cy="blip-edit-button"
        @click.stop="editBlip()"><v-icon>edit</v-icon></v-btn>
        <v-btn icon
        v-if="!isEditMode && userCanEdit"
        data-cy="blip-change-button"
        @click.stop="addChange()"><v-icon>playlist_add</v-icon></v-btn>
        <v-btn icon
        v-if="isEditMode"
        @click.stop="saveBlip()"><v-icon>done</v-icon></v-btn>
        <v-btn icon
        v-if="isEditMode"
        @click.stop="cancelEditBlip()"><v-icon>clear</v-icon></v-btn>
        <v-btn icon
        v-if="isEditMode && !isDeleteMode"
        data-cy="blip-delete-button1"
        @click.stop="isDeleteMode = true"><v-icon>delete</v-icon></v-btn>
        <v-btn icon
        color="error"
        v-if="isEditMode && isDeleteMode"
        data-cy="blip-delete-button2"
        @click.stop="deleteBlip()"><v-icon>delete</v-icon></v-btn>
      </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import MarkdownIt from 'markdown-it'
import appConfig from '@/config'
import { Blip as IBlip, Meta } from '@/types/domain'

const md = new MarkdownIt()
@Component({
  computed: {
    userCanEdit () {
      return this.$store.getters['user/userCanEdit']
    },
    meta () {
      return this.$store.getters['blips/meta']
    }
  }
})
export default class Blip extends Vue {
  isEditMode = false
  tempBlip: IBlip
  isDeleteMode = false
  showChangeDialog = false
  blipForChange: IBlip
  blipTitleCutOff: number = appConfig.blips.titleCutOff
  darkMode: boolean = appConfig.theme.dark

  // computed
  userCanEdit: boolean
  meta: Meta
  @Prop()
  blip: IBlip

  deleteBlip () {
    this.$store.dispatch('blips/deleteBlip', this.blip)
  }

  addChange () {
    if (!this.userCanEdit) return
    this.$emit('addChange', this.blip.id)
  }

  editBlip () {
    this.tempBlip = { ...this.blip }
    this.isEditMode = true
  }

  saveBlip () {
    const updatedBlip = this.tempBlip
    updatedBlip.changes = this.blip.changes // update in case changes were deleted
    this.isEditMode = false
    this.$store.dispatch('blips/updateBlip', updatedBlip)
    this.isDeleteMode = false
  }

  cancelEditBlip () {
    this.isEditMode = false
    this.isDeleteMode = false
  }

  deleteChange (blip, change) {
    this.$store.dispatch('blips/deleteChange', { blip, change })
  }

  markdown (string = '') {
    if (!string || string.length === 0) return ''
    return md.render(string)
  }
}
</script>

<style lang="scss" scoped>
.subheading {
  margin-right: 1vw;
}
.change-text {
  margin-left: 1vw;
}
.bold {
  font-weight: bold;
}
.v-chip {
  margin: 0 1rem;
}
</style>
