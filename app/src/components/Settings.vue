<template>
  <v-dialog v-model="$parent.settingsModalVisible" max-width="960px">
    <v-card>
      <v-card-title>
        <span class="headline">devradar settings</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-card-title>Backup / Restore</v-card-title>
          <v-row justify="space-around">
            <v-col cols="10" md="4" class="text-center">
              <v-card-text>Download radar as TOML file</v-card-text>
              <v-btn
                @click.end="downloadToml()">
                <v-icon left>mdi-content-save</v-icon>
                Download
              </v-btn>
            </v-col>
            <v-col cols="10" md="4" class="text-center">
              <v-card-text>Upload existing radar</v-card-text>
              <v-file-input
              label="Select TOML file from disk"
              prepend-icon="mdi-file"
              accept=".toml"
              v-model="uploadFile"></v-file-input>
              <v-btn
                :disabled="!uploadFile"
                @click.end="uploadToml(uploadFile)">
                <v-icon left>mdi-upload</v-icon>
                Upload
              </v-btn>
            </v-col>
            <v-col cols="10" md="4" class="text-center">
              <v-card-text>Copy TOML content to clipboard</v-card-text>
              <v-btn
                @click.end="copyToClipboard(contentToml)">
                <v-icon left>mdi-paperclip</v-icon>
                Copy
              </v-btn>
            </v-col>
          </v-row>
          <v-card-title>Radar metadata</v-card-title>
          <v-row justify="space-around" align="center">
            <v-col cols="6" md="2">
              <v-card-subtitle>Title</v-card-subtitle>
            </v-col>
            <v-col cols="6" md="2">
              <v-btn icon color="secondary"
                :disabled="!tmpTitleDirty"
                @click="saveMeta('title')">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6" md="3">
              <v-text-field v-model="tmpTitle"
                persistent-hint hint="Radar title"
                @change="tmpTitleDirty = true"
                single-line required :rules="rules.title"></v-text-field>
            </v-col>
            <v-col cols="5" class="d-none d-md-flex">
            </v-col>
          </v-row>
          <v-row justify="space-around" align="center">
            <v-col cols="6" md="2">
              <v-card-subtitle>Alias</v-card-subtitle>
              <v-card-text>devradar.io/[alias]</v-card-text>
            </v-col>
            <v-col cols="6" md="2">
              <v-btn icon color="secondary"
                :disabled="!tmpAliasDirty || tmpAliasErrors.length > 0"
                @click="saveAlias()">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6" md="3">
              <v-text-field v-model="tmpAlias"
                persistent-hint hint="devradar alias (must be unique)"
                :error-messages="tmpAliasErrors"
                single-line required :rules="rules.alias"></v-text-field>
            </v-col>
            <v-col cols="5" class="d-none d-md-flex">
            </v-col>
          </v-row>
          <v-row justify="space-around" align="center">
            <v-col cols="6" md="2">
              <v-card-subtitle>Levels</v-card-subtitle>
            </v-col>
            <v-col cols="6" md="2">
              <v-btn icon color="secondary"
                :disabled="!tmpLevelsDirty"
                @click="saveMeta('levels')">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field v-model="tmpLevels[0]"
                persistent-hint hint="Outermost level"
                @change="tmpLevelsDirty = true"
                single-line required :rules="rules.level"></v-text-field>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field v-model="tmpLevels[1]"
                persistent-hint hint="Second level"
                @change="tmpLevelsDirty = true"
                single-line required :rules="rules.level"></v-text-field>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field v-model="tmpLevels[2]"
                persistent-hint hint="Third level"
                @change="tmpLevelsDirty = true"
                single-line required :rules="rules.level"></v-text-field>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field v-model="tmpLevels[3]"
                persistent-hint hint="Innermost level"
                @change="tmpLevelsDirty = true"
                single-line required :rules="rules.level"></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="space-around" align="center">
            <v-col cols="6" md="2">
              <v-card-subtitle>Categories</v-card-subtitle>
            </v-col>
            <v-col cols="6" md="2">
              <v-btn icon color="secondary"
                :disabled="!tmpCategoriesDirty"
                @click="saveMeta('categories')">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field v-model="tmpCategories[0]"
                persistent-hint hint="First category"
                @change="tmpCategoriesDirty = true"
                single-line required :rules="rules.category"></v-text-field>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field v-model="tmpCategories[1]"
                persistent-hint hint="Second category"
                @change="tmpCategoriesDirty = true"
                single-line required :rules="rules.category"></v-text-field>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field v-model="tmpCategories[2]"
                persistent-hint hint="Third category"
                @change="tmpCategoriesDirty = true"
                single-line required :rules="rules.category"></v-text-field>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field v-model="tmpCategories[3]"
                persistent-hint hint="Fourth category"
                @change="tmpCategoriesDirty = true"
                single-line required :rules="rules.category"></v-text-field>
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
import { Component, Vue, Emit, Watch } from 'vue-property-decorator'
import copy from 'clipboard-copy'
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
      'meta', 'radarAlias', 'radarId'
    ]),
    ...mapGetters('user', [
      'userCanEdit'
    ]),
    blipsClean () {
      return this.$store.getters['blips/blipsClean']
        .map(stripIds)
    }
  },
  watch: {
    blipsClean () {
      this.reload()
    },
    meta () {
      this.reload()
    }
  }
})
export default class Settings extends Vue {
  // computed
  meta: Meta
  blipsClean: Blip[]
  userCanEdit: boolean
  radarAlias: string
  radarId: string

  // local data
  contentToml: string = ''
  uploadFile: any = null
  rules: any = {
    level: [val => (val || '').length > 0 || 'Level name cannot be empty'],
    category: [val => (val || '').length > 0 || 'Category name cannot be empty'],
    title: [val => (val || '').length > 0 || 'Title cannot be empty'],
    alias: [val => this.aliasAvailable(val) || 'Alias must be unique'] // TODO: implement uniqueness check
  }
  tmpLevels: string[] = []
  tmpLevelsDirty: boolean = false
  tmpCategories: string[] = []
  tmpCategoriesDirty: boolean = false
  tmpTitle: string = ''
  tmpTitleDirty: boolean = false
  tmpAlias: string = ''
  tmpAliasDirty: boolean = false
  tmpAliasErrors: string[] = []

  copyToClipboard (content) {
    const success = copy(content)
    if (success) {
      this.$store.dispatch('comm/showSnackbar', 'content copied to clipboard')
    } else {
      console.error(success) // eslint-disable-line no-console
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
      console.error('Error occured trying to decompress content', e) // eslint-disable-line no-console
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

  saveMeta (type) {
    let content
    switch (type) {
      case 'categories':
        content = this.tmpCategories
        this.tmpCategoriesDirty = false
        break
      case 'levels':
        content = this.tmpLevels
        this.tmpLevelsDirty = false
        break
      case 'title':
        content = this.tmpTitle
        this.tmpTitleDirty = false
        break
      default:
        console.error('Unknown type to save to metadata detected:', type) // eslint-disable-line no-console
        return
    }
    const newData = {}
    newData[type] = content
    const meta = Object.assign(this.meta, newData)

    this.$store.dispatch('blips/setMeta', meta)
    this.$store.dispatch('comm/showSnackbar', `updated ${type} metadata`)
  }

  saveAlias () {
    this.$store.dispatch('blips/setRadarAlias', { alias: this.tmpAlias, radarId: this.radarId })
    this.$store.dispatch('comm/showSnackbar', `updated your devradar alias to: ${this.tmpAlias}`)
    this.tmpAliasDirty = false
  }

  reload () {
    this.tmpLevels = Array.from(this.meta.levels)
    this.tmpCategories = Array.from(this.meta.categories)
    this.tmpTitle = this.meta.title
    this.tmpAlias = this.radarAlias
    this.generateToml()
  }

  aliasAvailable (value: string) {
    return true
  }
  @Watch('tmpAlias')
  async tmpAliasKeydown (newValue: string) {
    this.tmpAliasDirty = true
    this.tmpAliasErrors = []
    if (!/^[a-zA-Z0-9-_ ]+$/.test(newValue)) {
      this.tmpAliasErrors.push('Invalid character detected (a-z A-Z 0-9 -_ only)')
    }
    const isAvailable = await this.$store.dispatch('blips/isRadarAliasAvailable', newValue)
    if (!isAvailable) {
      this.tmpAliasErrors.push(`Alias already in use: ${newValue}`)
    }
  }

  @Emit()
  close () {
    return 0
  }

  mounted () {
    this.reload()
  }
  @Watch('radarAlias')
  radarAliasUpdate () {
    this.reload()
  }
}
</script>

<style lang="scss" scoped>

</style>
