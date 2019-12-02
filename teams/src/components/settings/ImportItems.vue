<template>
  <v-list two-line subheader>
    <v-subheader inset>Team competencies</v-subheader>

    <v-list-item
      avatar
    >
      <v-list-item-avatar>
        <v-icon class="secondary lighten-1 white--text">explore</v-icon>
      </v-list-item-avatar>

      <v-list-item-content :class="{ missing: team.filename === 'N/A'}">
        <v-list-item-title>{{ team.filename }}</v-list-item-title>
        <v-list-item-sub-title>{{ team.title }}</v-list-item-sub-title>
      </v-list-item-content>

      <v-list-item-action>
        <v-upload-btn
          @file-update="uploadToml($event, 'team')"
          color=""
          accept=".toml"
          icon round>
          <template slot="icon">
            <v-icon>publish</v-icon>
          </template>
        </v-upload-btn>
      </v-list-item-action>
    </v-list-item>

    <v-divider inset></v-divider>

    <v-subheader inset>
      Developer Skills
      <v-upload-btn
        @file-update="uploadToml($event, 'devs')"
        color=""
        accept=".toml"
        icon ripple>
        <template slot="icon">
          <v-icon color="black">add</v-icon>
        </template>
      </v-upload-btn>
    </v-subheader>

    <v-list-item
      v-for="(item, index) in devs"
      :key="item.title"
      avatar
    >
      <v-list-item-avatar>
        <v-icon class="primary white--text">person</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ item.filename }}</v-list-item-title>
        <v-list-item-sub-title>{{ item.title }}</v-list-item-sub-title>
      </v-list-item-content>

      <v-list-item-action>
        <v-btn
        @click="removeDev(index)"
        icon ripple>
          <v-icon color="grey lighten-1">delete</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-action>
        <v-upload-btn
          @file-update="uploadToml($event, 'devs', index)"
          color=""
          accept=".toml"
          icon ripple>
          <template slot="icon">
            <v-icon>publish</v-icon>
          </template>
        </v-upload-btn>
      </v-list-item-action>
    </v-list-item>
    <v-btn
    @click="loadDummyData()"
    color="secondary"
    v-if="!hasItems"
    ripple>
      Load Dummydata
    </v-btn>
    <v-spacer></v-spacer>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UploadButton from 'vuetify-upload-button'
import TOML from '@iarna/toml'
import { mapGetters } from 'vuex'
import { Item } from '@/types/domain'

@Component({
  computed: {
    ...mapGetters('items', [
      'team',
      'devs',
      'hasItems'
    ])
  },
  components: {
    'v-upload-btn': UploadButton
  }
})
export default class ImportItems extends Vue {
  team: Item
  devs: Item[]
  hasItems: boolean

  public uploadToml (file, target = 'devs', index) {
    const reader = new FileReader()
    if (file) {
      reader.addEventListener('load', () => {
        let object
        try {
          object = TOML.parse(reader.result.toString()) as unknown
          this.$store.dispatch('comm/showSnackbar', 'file upload successful')
        } catch (e) {
          console.error('Could not read uploaded file as TOML', e)
          return 1
        }
        const item: Item = {
          filename: file.name,
          title: object.meta.title,
          payload: object
        }
        
        if (target === 'team') {
          this.$store.dispatch('items/uploadTeam', item)
        } else if (target === 'devs') {
          const existingIx = this.devs
            .findIndex(b => b.title === item.title)
          if (existingIx >= 0 && existingIx != index) {
            this.$store.dispatch('comm/showSnackbar', `entry with that title already exists: ${item.title}`)
          } else {
            this.$store.dispatch('items/uploadDev', { item, index })
          }
        }
        this.checkComplete()
      }, false)
      reader.readAsText(file)
    }
  }

  public removeDev (index) {
    this.$store.dispatch('items/deleteDev', index)
    this.checkComplete()
  }

  private checkComplete () {
    if (this.hasItems) {
      this.$emit('isComplete', true)
    } else {
      this.$emit('isComplete', false)
    }
  }

  public loadDummyData () {
    this.$store.dispatch('items/loadDummyData')
    this.checkComplete()
  }
  mounted (): void {
    this.checkComplete()
  }

}
</script>

<style lang="scss" scoped>
div.upload-btn {
  padding: 0px;
}
.missing {
  font-style: italic;
  color: gray;
}
</style>
