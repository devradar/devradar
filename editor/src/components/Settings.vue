<template>
      <v-container grid-list-lg>
        <v-layout row>
          <v-flex xs10>
              <span class="headline">
                Content
              </span>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-form v-model="contentIsValid">
              <v-textarea
                name="content-toml"
                rows="16"
                color="primary"
                v-if="showToml"
                label="TOML"
                :rules="validateToml"
                @keydown.tab.prevent="tabber($event)"
                append-icon="code"
                @click:append="showToml = !showToml"
                v-model="contentToml"
              ></v-textarea>
              <v-textarea
                name="content-encoded"
                rows="8"
                color="primary"
                v-else
                label="Encoded"
                readonly
                append-icon="code"
                @click:append="showToml = !showToml"
                @focus="$event.target.select()"
                v-model="contentEncoded"
              ></v-textarea>
            </v-form>
          </v-flex>
        </v-layout>
        <v-layout row wrap justify-space-between>
          <v-flex xs8 sm4 lg3 xl2>
            <v-btn
            @click.end="downloadToml()">
              <v-icon left>save</v-icon>
              Download as toml
            </v-btn>
          </v-flex>
          <v-flex xs9 sm4 lg3 xl2>
            <v-upload-btn
            @file-update="uploadToml"
            color="grey lighten-3"
            title="Upload from file">
              <template slot="icon-left">
                <v-icon left>cloud_upload</v-icon>
              </template>
            </v-upload-btn>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs5 sm3 lg1 xl1>
            <v-btn
            :disabled="!contentIsValid"
            @click.end="loadContent()"
            color="primary">
              Save
            </v-btn>
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

function stripIds (blip) {
  blip.changes.map(c => {
    delete c.id
    return c
  })
  delete blip.id
  return blip
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
    ]
  }),
  computed: {
    blipsClean () {
      return this.$store.getters.blipsClean
        .map(stripIds)
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
        this.$store.dispatch('setBlips', obj.blips) // TODO: use individual blip adds
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
