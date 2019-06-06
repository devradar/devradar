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
            <v-btn color="none" icon>
              <v-icon>code</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-textarea
              name="content-encoded"
              box rows="8"
              label="Encoded"
              append-outer-icon="attach_file"
              @click:append-outer="copyContent()"
              @focus="$event.target.select()"
              v-model="contentEncoded"
            ></v-textarea>
          </v-flex>
        </v-layout>
        <v-layout row justify-end>
          <v-flex xs2>
            <v-btn color="none" outline
            @click.end="download()">
              <v-icon left>save</v-icon>
              Download as toml
            </v-btn>
          </v-flex>
          <v-flex xs2>
            <v-upload-btn
            @file-update="update"
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
    &nbsp;
    <v-card>
      <v-container fluid grid-list-lg>
        <v-layout row>
          <v-flex xs12>
            <span class="headline">
              Meta data
            </span>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>

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
    contentEncoded: ''
  }),
  computed: {
    blips () {
      return this.$store.getters.blipsArray
    },
    meta () {
      return this.$store.getters.meta
    }
  },
  methods: {
    copyContent () {
      const b = this.contentEncoded
      const success = copy(b)
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
      const string = JSON.stringify(obj)
      this.contentEncoded = lzs.compressToEncodedURIComponent(string)
    },
    // move content from view to vuex
    loadContent () {
      const string = lzs.decompressFromEncodedURIComponent(this.contentEncoded)
      try {
        const obj = JSON.parse(string)
        this.$store.dispatch('setBlips', obj.blips)
        this.$store.dispatch('setMeta', obj.meta)
        this.$store.dispatch('showSnackbar', 'updated local blips + config')
      } catch (e) {
        console.error('Error occured trying to decompress content', e)
      }
    },
    update (file) {
      const reader = new FileReader()
      if (file) {
        reader.addEventListener('load', () => {
          this.contentEncoded = reader.result
          this.$store.dispatch('showSnackbar', 'file upload successful')
        }, false)
        reader.readAsText(file)
      }
    },
    downloadToml () {
      saveAs('hello.txt', this.contentToml)
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
