<template>
  <v-container grid-list-lg>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-title><h3 class="headline">Team setup</h3></v-card-title>
          <v-list two-line subheader>
            <v-subheader inset>Team competences</v-subheader>

            <v-list-tile
              v-for="item in items"
              :key="item.title"
              avatar
            >
              <v-list-tile-avatar>
                <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon ripple>
                  <v-icon>publish</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-subheader inset>
              Developer Skills
              <v-btn icon ripple>
                <v-icon>add</v-icon>
              </v-btn>
            </v-subheader>

            <v-list-tile
              v-for="item in items2"
              :key="item.title"
              avatar
            >
              <v-list-tile-avatar>
                <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon ripple>
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple>
                  <v-icon>publish</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import copy from 'clipboard-copy'
import lzs from 'lz-string'
import UploadButton from 'vuetify-upload-button'
import TOML from '@iarna/toml'

function saveAs (filename, text) {
  var element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export default {
  data: () => ({
    contentToml: '',
    showToml: true,
    contentIsValid: false,
    validateToml: [
      v => {
        try {
          TOML.parse(v)
          return true
        } catch (e) {
          return e.toString()
        }
      }
    ],
    items: [
      { icon: 'explore', iconClass: 'secondary lighten-1 white--text', title: 'teamradar.toml', subtitle: 'Galactic Federation Technology Stack ' }
    ],
    items2: [
      { icon: 'person', iconClass: 'primary white--text', title: 'andreas.toml', subtitle: 'Andreas\'s tech skills' },
      { icon: 'person', iconClass: 'primary white--text', title: 'oli.toml', subtitle: 'Oliver Schwarz' }
    ]
  }),
  computed: {
    blipsClean () {
      return this.$store.getters.blipsClean
    },
    meta () {
      return this.$store.getters.meta
    },
    contentEncoded () {
      const json = TOML.parse(this.contentToml)
      const str = JSON.stringify(json)
      return lzs.compressToEncodedURIComponent(str)
    }
  },
  methods: {
    copyToClipboard (content) {
      const success = copy(content)
      if (success) {
        this.$store.dispatch('showSnackbar', 'content copied to clipboard')
      } else {
        console.error(success)
      }
    },
    fetchContent () {
      const obj = {
        meta: this.meta,
        blips: this.blipsClean
      }
      const str = TOML.stringify(obj)
      this.contentToml = str
    },
    // move content from view to vuex
    loadContent () {
      try {
        const obj = TOML.parse(this.contentToml)
        this.$store.dispatch('setBlips', obj.blips)
        this.$store.dispatch('setMeta', obj.meta)
        this.$store.dispatch('showSnackbar', 'updated local blips + config')
      } catch (e) {
        console.error('Error occured trying to decompress content', e)
      }
    },
    uploadToml (file) {
      const reader = new FileReader()
      if (file) {
        reader.addEventListener('load', () => {
          this.contentToml = reader.result
          this.$store.dispatch('showSnackbar', 'file upload successful')
        }, false)
        reader.readAsText(file)
      }
    },
    downloadToml () {
      saveAs(`devradar-${this.meta.title.replace(/[^a-zA-Z0-9 _-]/g, '')}.toml`, this.contentToml)
    },
    tabber (event) {
      const text = this.contentToml
      const originalSelectionStart = event.target.selectionStart
      const textStart = text.slice(0, originalSelectionStart)
      const textEnd = text.slice(originalSelectionStart)

      this.contentToml = `${textStart}  ${textEnd}`
      event.target.value = this.contentToml // required to make the cursor stay in place.
      event.target.selectionEnd = event.target.selectionStart = originalSelectionStart + 2
    }
  },
  mounted () {
    this.fetchContent()
  },
  components: {
    'v-upload-btn': UploadButton
  }
}
</script>

<style lang="scss" scoped>
div.upload-btn {
  padding: 0px;
}
</style>
