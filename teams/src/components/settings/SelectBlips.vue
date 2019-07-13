<template>
  <v-layout row wrap>
    <v-flex xs4>
      <v-list>
        <v-subheader inset>Team</v-subheader>
        <v-list-tile
          v-for="(item, index) in items"
          :key="item.title"
          avatar
        >
          <v-list-tile-avatar>
            <v-icon v-if="index == 0" class="secondary lighten-1 white--text">explore</v-icon>
            <v-icon v-else class="primary white--text">person</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn
            @click="itemDone(index)"
            v-if="index >= activeItemIx"
            :disabled="index !== activeItemIx"
            icon ripple>
              <v-icon>check_box_outline_blank</v-icon>
            </v-btn>
            <v-icon v-else>check_box</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-flex>
    <v-flex xs6>
      <v-flex
      v-for="(category, categoryIx) in categories"
      :key="category">
        <v-subheader inset>{{ category }}</v-subheader>
        <div class="chips">
          <v-chip
            outline
            color="black"
            v-for="blip in blipsByCategory(activeItemIx, categoryIx)"
            :key="blip.title"
            @click="toggleBlip(blip)">
            <v-badge right color="grey">
              <template v-slot:badge>
                <span>{{getBlipCount(blip)}}</span>
              </template>
                <v-icon v-if="isSelected(blip)" color="primary" left>star</v-icon>
                <v-icon v-else left>star_border</v-icon>
                {{blip.title}}
            </v-badge>
          </v-chip>
        </div>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    activeItemIx: 0,
    chip: true
  }),
  computed: {
    ...mapGetters([
      'team',
      'devs',
      'hasItems',
      'selectedBlips'
    ]),
    items () {
      return [this.team].concat(this.devs)
    },
    categories () {
      return this.team.payload.meta.categories
    },
    blipsByCategory () {
      return (itemIx, categoryIx) => {
        if (itemIx > this.items.length - 1) {
          return []
        }
        return this.items[itemIx].payload.blips
          .filter(e => e.category === categoryIx)
      }
    }
  },
  methods: {
    checkComplete () {
      if (this.activeItemIx >= this.items.length - 1) {
        this.$emit('isComplete', true)
      } else {
        this.$emit('isComplete', false)
      }
    },
    itemDone (value) {
      this.activeItemIx = ++value
    },
    isSelected (blip) {
      return !!this.selectedBlips.find(e => e.title.toLowerCase() === blip.title.toLowerCase())
    },
    toggleBlip (blip) {
      if (this.isSelected(blip)) {
        this.$store.dispatch('deselectBlip', blip)
      } else {
        this.$store.dispatch('selectBlip', blip)
      }
    },
    getBlipCount (blip) {
      return this.items
        .map(i => i.payload.blips.filter(e => e.title.toLowerCase() === blip.title.toLowerCase()))
        .flat()
        .length
    }
  },
  mounted () {
    this.checkComplete()
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>

</style>
