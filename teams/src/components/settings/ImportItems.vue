<template>
  <v-list two-line subheader>
    <v-subheader inset>Team competences</v-subheader>

    <v-list-tile
      avatar
    >
      <v-list-tile-avatar>
        <v-icon class="secondary lighten-1 white--text">explore</v-icon>
      </v-list-tile-avatar>

      <v-list-tile-content :class="{ missing: team.filename === 'N/A'}">
        <v-list-tile-title>{{ team.filename }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ team.title }}</v-list-tile-sub-title>
      </v-list-tile-content>

      <v-list-tile-action>
        <v-upload-btn
          @file-update="uploadToml($event, 'team')"
          color=""
          accept=".toml"
          icon round>
          <template slot="icon">
            <v-icon>publish</v-icon>
          </template>
        </v-upload-btn>
      </v-list-tile-action>
    </v-list-tile>

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

    <v-list-tile
      v-for="(item, index) in devs"
      :key="item.title"
      avatar
    >
      <v-list-tile-avatar>
        <v-icon class="primary white--text">person</v-icon>
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title>{{ item.filename }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ item.title }}</v-list-tile-sub-title>
      </v-list-tile-content>

      <v-list-tile-action>
        <v-btn
        @click="removeDev(index)"
        icon ripple>
          <v-icon color="grey lighten-1">delete</v-icon>
        </v-btn>
      </v-list-tile-action>
      <v-list-tile-action>
        <v-upload-btn
          @file-update="uploadToml($event, 'devs', index)"
          color=""
          accept=".toml"
          icon ripple>
          <template slot="icon">
            <v-icon>publish</v-icon>
          </template>
        </v-upload-btn>
      </v-list-tile-action>
    </v-list-tile>
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

<script>
import UploadButton from 'vuetify-upload-button'
import TOML from '@iarna/toml'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
  }),
  computed: {
    ...mapGetters([
      'team',
      'devs',
      'hasItems'
    ])
  },
  methods: {
    uploadToml (file, target = 'devs', index) {
      const reader = new FileReader()
      if (file) {
        reader.addEventListener('load', () => {
          let object
          try {
            object = TOML.parse(reader.result)
            this.$store.dispatch('showSnackbar', 'file upload successful')
          } catch (e) {
            console.error('Could not read uploaded file as TOML', e)
            return 1
          }
          const item = {
            filename: file.name,
            title: object.meta.title,
            payload: object
          }
          switch (target) {
            case 'team':
              this.$store.dispatch('uploadTeam', item)
              break
            case 'devs':
              this.$store.dispatch('uploadDev', item, index)
          }
          this.checkComplete()
        }, false)
        reader.readAsText(file)
      }
    },
    removeDev (index) {
      this.$store.dispatch('deleteDev', index)
      this.checkComplete()
    },
    checkComplete () {
      if (this.hasItems) {
        this.$emit('isComplete', true)
      } else {
        this.$emit('isComplete', false)
      }
    },
    loadDummyData () {
      this.$store.dispatch('loadDummyData')
      this.checkComplete()
    }
  },
  mounted () {
    this.checkComplete()
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
.missing {
  font-style: italic;
  color: gray;
}
</style>
