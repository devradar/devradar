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
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    activeItemIx: 2
  }),
  computed: {
    ...mapGetters([
      'team',
      'devs',
      'hasItems'
    ]),
    items () {
      return [this.team].concat(this.devs)
    }
  },
  methods: {
    checkComplete () {
      if (this.hasItems) {
        this.$emit('isComplete', true)
      } else {
        this.$emit('isComplete', false)
      }
    },
    itemDone (value) {
      this.activeItemIx = ++value
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
