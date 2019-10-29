<template>
  <v-container
    fluid
    grid-list-lg>
    <new-blip></new-blip>
    <new-change
    @submit="newChangeSubmit"
    @cancel="newChangeCancel"
    ></new-change>
    <v-row justify="space-around">
      <v-col xs="12" sm="5" md="4">
        <v-text-field
          v-model="searchTitle"
          label="Search.."
          @input="searchUpdated"
          clearable
          prepend-icon="search"
        >
        </v-text-field>
      </v-col>
      <v-col xs="12" sm="6" md="4">
        <v-slider
          v-model="maxMonths"
          thumb-label
          hint="Only show recently updated blips, 0 to disable"
          label="Latest change"
          :max="12"
        ></v-slider>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-col cols="12" lg="9"
        v-for="blip in filteredBlips" :key="blip.id">
        <blip
          :blip="blip"
          @addChange="newChangeOpen"
        >
        </blip>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, ProvideReactive } from 'vue-property-decorator'
import NewBlip from './NewBlip.vue'
import NewChange from './NewChange.vue'
import BlipComponent from './Blip.vue'
import router from '../router'
import { Blip } from '@/types/domain'

@Component({
  components: {
    NewBlip,
    NewChange,
    Blip: BlipComponent
  },
  computed: {
    blips () {
      const blips = this.$store.getters['blips/blipsWithIndex']
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
          if (!this.maxMonths) return true
          const bDate = new Date(b.changes[0].date)
          const now = new Date()
          const age = (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth())
          if (age <= this.maxMonths) return true
          return false
        })
        .sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase())
    },
    userCanEdit () {
      return this.$store.getters['user/userCanEdit']
    }
  }
})
export default class List extends Vue {
  @Prop({ default: '' })
  search: string
  @ProvideReactive() newChangeBlip: Blip

  searchTitle: string = this.search
  maxMonths: number = 0
  newChangeModalVisible: boolean = false
  // computed
  blips: Blip[]
  userCanEdit: boolean
  filteredBlips: Blip[]

  searchUpdated () {
    if (this.searchTitle) router.replace({ name: 'List', params: { search: this.searchTitle } })
    else router.replace({ name: 'List' })
  }

  newChangeOpen (blipId) {
    this.newChangeBlip = this.blips.find(b => b.id === blipId)
    this.newChangeModalVisible = true
  }

  newChangeSubmit ({ blip, change }) {
    this.$store.dispatch('blips/addChange', { blip, change })
    this.newChangeModalVisible = false
    this.newChangeBlip = null
  }

  newChangeCancel () {
    this.newChangeBlip = null
    this.newChangeModalVisible = false
  }
}
</script>

<style lang="scss" scoped>

</style>
