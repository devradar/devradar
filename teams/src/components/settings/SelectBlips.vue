<template>
  <v-layout row wrap>
    <v-flex xs4>
      <v-list>
        <v-subheader>Team</v-subheader>
        <v-list-item
          v-for="(item, index) in items"
          :key="item.title"
          avatar
          @click="activeItemIx = index"
          :class="index === activeItemIx ? 'active-radar' : ''"
        >
          <v-list-item-avatar>
            <v-icon v-if="index == 0" class="secondary lighten-1 white--text">explore</v-icon>
            <v-icon v-else class="grey darken-3 white--text">person</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-flex>
    <v-flex xs6>
      <v-flex
      v-for="(category, categoryIx) in categories"
      :key="category">
        <v-subheader inset>{{ category }}</v-subheader>
        <div class="chips">
          <v-chip
            :color="isSelected(blip) ? 'primary' : 'grey lighten-3'"
            v-for="blip in blipsByCategory(activeItemIx, categoryIx)"
            :key="blip.title"
            @click="toggleBlip(blip)">
            <v-badge right color="grey darken-3">
              <template v-slot:badge>
                <span>{{getBlipCount(blip)}}</span>
              </template>
                <v-icon v-if="isSelected(blip)" color="black" left>star</v-icon>
                <v-icon v-else left>star_border</v-icon>
                {{blip.title}}
            </v-badge>
          </v-chip>
        </div>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { Blip, Item } from '@/types/domain'

@Component({
  computed: {
    ...mapGetters('items', [
      'team',
      'devs',
      'hasItems'
    ]),
    ...mapGetters('settings', [
      'selectedBlipsTitle'
    ]),
    items () {
      return this.hasItems ? [this.team].concat(this.devs) : []
    },
    categories () {
      return this.hasItems ? this.team.payload.meta.categories : []
    },
    blipsByCategory () {
      return (itemIx, categoryIx) => {
        return this.items[itemIx].payload.blips
          .filter(e => e.category === categoryIx)
      }
    }
  }
})

export default class SelectBlips extends Vue {
  activeItemIx: number = 0
  chip: boolean = true
  
  // computed
  team: Item
  devs: Item[]
  hasItems: boolean
  selectedBlipsTitle: string[]
  items: Item[]
  categories: string[]
  blipsByCategory: Blip[]

  checkComplete () {
    if (this.selectedBlipsTitle.length > 0) {
      this.$emit('isComplete', true)
    } else {
      this.$emit('isComplete', false)
    }
  }
  itemDone (value) {
    this.activeItemIx = ++value
    this.checkComplete()
  }

  isSelected (blip) {
    return !!this.selectedBlipsTitle.find(e => e.toLowerCase() === blip.title.toLowerCase())
  }

  toggleBlip (blip) {
    if (this.isSelected(blip)) {
      this.$store.dispatch('settings/deselectBlip', blip)
    } else {
      this.$store.dispatch('settings/selectBlip', blip)
    }
    this.checkComplete()
  }

  getBlipCount (blip) {
    return this.items
      .map(i => i.payload.blips.filter(e => e.title.toLowerCase() === blip.title.toLowerCase()))
      .flat()
      .length
  }

  initSelectedBlips () {
    if (this.selectedBlipsTitle.length < 1 && this.hasItems) {
      console.log(this.$store)
      this.team.payload.blips.forEach(b => this.$store.dispatch('settings/selectBlip', b))
    }
  }

  mounted () {
    this.initSelectedBlips()
  }
}

</script>

<style lang="scss" scoped>
.chips {
  margin-left: 8rem;
}

.active-radar {
  background-color: #0DBD0D;
}
</style>
