<template>
  <v-dialog v-model="$parent.settingsModalVisible">
    <v-card>
      <v-card-title>
        <span class="headline">devradar settings</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-card-title>Content</v-card-title>
          <v-row justify="space-around">
            <v-col cols="10" sm="6" md="4">
              <v-btn
                @click.end="downloadToml()">
                <v-icon left>mdi-content-save</v-icon>
                Download
              </v-btn>
            </v-col>
            <v-col cols="10" sm="6" md="4">
              <v-upload-btn
                @file-update="uploadToml"
                color="grey lighten-3"
                large
                title="Upload">
                  <template slot="icon-left">
                    <v-icon left>mdi-upload</v-icon>
                  </template>
              </v-upload-btn>
            </v-col>
            <v-col cols="10" sm="6" md="4">
              <v-btn
                @click.end="copyToClipboard(contentToml)">
                <v-icon left>mdi-paperclip</v-icon>
                Copy
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import copy from 'clipboard-copy'
import UploadButton from 'vuetify-upload-button'
import TOML from '@iarna/toml'
import { mapGetters } from 'vuex'
import { Blip, Meta } from '@/types/domain'

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

@Component({
  computed: {
    ...mapGetters('blips', [
      'meta'
    ]),
    ...mapGetters('user', [
      'userCanEdit'
    ]),
    blipsClean () {
      return this.$store.getters['blips/blipsClean']
        .map(stripIds)
    }
  },
  components: {
    'v-upload-btn': UploadButton
  },
  watch: {
    blipsClean () {
      this.generateToml()
    }
  }
})
export default class Settings extends Vue {
  contentToml: string = ''
  // computed
  meta: Meta
  blipsClean: Blip[]
  userCanEdit: boolean
  
  copyToClipboard (content) {
    const success = copy(content)
    if (success) {
      this.$store.dispatch('comm/showSnackbar', 'content copied to clipboard')
    } else {
      console.error(success)
    }
  }

  generateToml () {
    const obj: any = {
      meta: this.meta,
      blips: this.blipsClean
    }
    const str = TOML.stringify(obj) as string
    this.contentToml = str
  }

  // move content from view to vuex
  loadContent () {
    try {
      const obj = TOML.parse(this.contentToml)
      this.$store.dispatch('blips/setMeta', obj.meta)
      this.$store.dispatch('blips/setBlips', obj.blips)
      this.$store.dispatch('comm/showSnackbar', 'updated local blips + config')
    } catch (e) {
      console.error('Error occured trying to decompress content', e)
      this.$store.dispatch('comm/showSnackbar', 'error while trying to read uploaded file')
    }
  }

  uploadToml (file) {
    const reader = new FileReader()
    if (file) {
      reader.addEventListener('load', () => {
        this.contentToml = reader.result.toString()
        this.$store.dispatch('comm/showSnackbar', 'file upload successful')
        this.loadContent()
      }, false)
      reader.readAsText(file)
    }
  }

  downloadToml () {
    saveAs(`devradar-${this.meta.title.replace(/[^a-zA-Z0-9 _-]/g, '')}.toml`, this.contentToml)
  }

  mounted () {
    this.generateToml()
  }

  @Emit()
  close () {
    return 0
  }
  
}
</script>

<style lang="scss" scoped>
label.upload-btn {
  margin: 8px;
  color: black !important;
}
</style>
