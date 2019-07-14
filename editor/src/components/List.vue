<template>
  <v-container
    fluid
    grid-list-lg>
    <new-blip></new-blip>
    <new-change
    @submit="newChangeSubmit"
    @cancel="newChangeCancel"
    ></new-change>
    <v-layout row wrap justify-space-around>
      <v-flex xs12 sm5 md4>
        <v-text-field
          v-model="searchTitle"
          label="Search.."
          @input="searchUpdated"
          clearable
          prepend-icon="search"
        >
        </v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-slider
          v-model="settings.maxMonths"
          thumb-label
          hint="Only show recently updated blips, 0 to disable"
          label="Latest change"
          :max="12"
        ></v-slider>
      </v-flex>
      <v-flex xs12 v-for="blip in filteredBlips" :key="blip.id">
        <blip
          :blip="blip"
          @addChange="newChangeOpen"
        >
        </blip>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import NewBlip from './NewBlip'
import NewChange from './NewChange'
import Blip from './Blip'
import router from '../router'

export default {
  components: { NewBlip, NewChange, Blip },
  computed: {
    blips () {
      const blips = this.$store.getters.blipsWithIndex
      return blips
    },
    filteredBlips () {
      const blips = this.blips
      return blips
        .filter(blip => new RegExp(this.searchTitle || '', 'i').exec(blip.title))
        .map(b => {
          b.changes = b.changes.sort((a, b) => a.date < b.date)
          return b
        })
        .filter(b => {
          if (!this.settings.maxMonths) return true
          const bDate = new Date(b.changes[0].date)
          const now = new Date()
          const age = (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth())
          if (age <= this.settings.maxMonths) return true
          return false
        })
        .sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase())
    },
    userCanEdit () {
      return this.$store.getters.userCanEdit
    }
  },
  props: {
    search: String
  },
  data: function () {
    return {
      searchTitle: this.search,
      settings: {
        maxMonths: 0
      },
      newChangeModalVisible: false,
      newChangeBlip: null
    }
  },
  methods: {
    searchUpdated () {
      if (this.searchTitle) router.replace({ name: 'List', params: { search: this.searchTitle } })
      else router.replace({ name: 'List' })
    },
    newChangeOpen (blipId) {
      this.newChangeBlip = this.blips.find(b => b.id === blipId)
      this.newChangeModalVisible = true
    },
    newChangeSubmit ({ blip, change }) {
      this.$store.dispatch('addChange', { blip, change })
      this.newChangeModalVisible = false
      this.newChangeBlip = null
    },
    newChangeCancel (change) {
      this.newChangeBlip = null
      this.newChangeModalVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
