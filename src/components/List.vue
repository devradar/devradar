<template>
  <v-container
    fluid
    grid-list-lg>
    <new-blip></new-blip>
    <v-layout row wrap justify-space-around>
      <v-flex xs6>
        <v-text-field
          v-model="searchTitle"
          label="Search.."
          @input="searchUpdated"
          clearable
          prepend-icon="search"
        >
        </v-text-field>
      </v-flex>
      <v-flex xs4>
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
        >
        </blip>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import NewBlip from './NewBlip'
import Blip from './Blip'
import router from '../router'

export default {
  components: { NewBlip, Blip },
  computed: {
    blips () {
      const blips = this.$store.getters.blips
      return blips
    },
    filteredBlips () {
      const blips = this.blips
      return blips
        .filter(blip => new RegExp(this.searchTitle || '', 'i').exec(blip.title))
        .map(b => {
          b.changes = b.changes.sort((a, b) => a.date < b.date)
          const bDate = new Date(b.changes[0].date)
          const now = new Date()
          b.age = (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth())
          return b
        })
        .filter(b => !this.settings.maxMonths || b.age <= this.settings.maxMonths)
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
      }
    }
  },
  methods: {
    searchUpdated () {
      if (this.searchTitle) router.replace({ name: 'List', params: { search: this.searchTitle } })
      else router.replace({ name: 'List' })
    },
    searchClear () {
      this.searchTitle = ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
