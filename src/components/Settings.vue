<template>
  <v-container
    fluid
    grid-list-lg>
    <v-card>
      <v-container fluid grid-list-lg>
        <v-layout row justify-space-between>
          <v-flex xs10>
              <span class="headline">
                Content
              </span>
          </v-flex>
          <v-flex xs1>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                  <v-btn
                  color="none"
                  icon
                  @click="showToml = !showToml"
                  v-on="on"
                  >
                    <v-icon>code</v-icon>
                  </v-btn>
              </template>
              <span>Toggle TOML and encoded view</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-textarea
              name="content-toml"
              rows="8"
              color="secondary"
              v-if="showToml"
              label="TOML"
              @keydown.tab.prevent="tabber($event)"
              append-outer-icon="attach_file"
              @click:append-outer="copyToClipboard(contentToml)"
              v-model="contentToml"
            ></v-textarea>
            <v-textarea
              name="content-encoded"
              rows="8"
              color="secondary"
              v-else
              label="Encoded"
              readonly
              append-outer-icon="attach_file"
              @click:append-outer="copyToClipboard(contentEncoded)"
              @focus="$event.target.select()"
              v-model="contentEncoded"
            ></v-textarea>
          </v-flex>
        </v-layout>
        <v-layout row justify-end>
          <v-flex xs2>
            <v-btn color="none" outline
            @click.end="downloadToml()">
              <v-icon left>save</v-icon>
              Download as toml
            </v-btn>
          </v-flex>
          <v-flex xs2>
            <v-upload-btn
            @file-update="uploadToml"
            color="none"
            title="Upload from file"
            outline>
              <template slot="icon-left">
                <v-icon left>cloud_upload</v-icon>
              </template>
            </v-upload-btn>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs1>
            <v-btn
            @click.end="loadContent()"
            color="secondary">
              <v-icon left>send</v-icon>
              Update
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
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
    showToml: true
  }),
  computed: {
    blips () {
      return this.$store.getters.blipsArray
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
        blips: this.blips
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
