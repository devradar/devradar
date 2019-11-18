<template>
  <v-container
    fluid
    grid-list-lg>
    <new-blip v-if="user.uid === ownerId"></new-blip>
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
    <v-row justify="space-between">
      <v-col cols="12" lg="6" xl="4"
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
import { Component, Vue, Prop, ProvideReactive, Query } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import NewBlip from './list/NewBlip.vue'
import NewChange from './list/NewChange.vue'
import BlipComponent from './list/Blip.vue'
import router from '../router'
import { Blip, User } from '@/types/domain'

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
    ...mapGetters('blips', [
      'isLoading', 'ownerId'
    ]),
    ...mapGetters('user', [
      'user', 'userCanEdit'
    ]),
  }
})
export default class List extends Vue {
  @Prop({ default: '' })
  blipName: string
  @Prop({ default: '' })
  radarId: string
  @ProvideReactive() newChangeBlip: Blip

  searchTitle: string = this.blipName
  maxMonths: number = 0
  newChangeModalVisible: boolean = false
  // computed
  blips: Blip[]
  userCanEdit: boolean
  filteredBlips: Blip[]
  isLoading: boolean
  ownerId: string
  user: User

  searchUpdated () {
    if (this.searchTitle) {
      router.replace({ name: 'list', params: { radarId: this.radarId }, query: { q: this.searchTitle } })
    } else {
      router.replace({ name: 'list', params: { radarId: this.radarId } })
    }
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

  mounted () {
    if (!this.isLoading) {
      this.$store.dispatch('blips/getRadarLazy', this.radarId)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
