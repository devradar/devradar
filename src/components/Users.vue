<template>
  <v-container>
    <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-list two-line>
          <template v-for="(item, index) in userList">
            <v-list-tile
              v-bind:key="index"
              ripple
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }} ({{ item.uid }})</v-list-tile-title>
                <v-list-tile-sub-title>last seen: {{ item.lastLogin }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>Admin</v-list-tile-action-text>
                <v-btn
                icon
                @click="setRole(index, 'admin', !item.roles.admin)"
                v-bind:key="item.roles.admin"
                >
                  <v-icon
                    v-if="item.roles.admin"
                    color="yellow darken-2"
                  >star</v-icon>
                  <v-icon
                    v-else
                    color="grey lighten-1"
                  >star_border</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    items: [],
    roles: []
  }),
  computed: {
    userList () {
      return this.$store.getters.userList
    }
  },
  methods: {
    setRole (index, role, value) {
      this.userList[index].roles[role] = value
      const targetUser = this.userList[index]
      this.$store.dispatch('setRoles', {targetUser})
    }
  },
  mounted () {
    this.$store.dispatch('getUserList')
  }
}
</script>
