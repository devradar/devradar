<template>
  <v-app id="inspire">
1    <v-navigation-drawer v-model="drawer" app clipped scroll-off-screen="true" scroll-toolbar-off-screen="true">
      <v-list>
        <v-list-tile
        v-for="elm in menuItems"
        v-bind:key="elm.title"
        router
        v-bind:to="elm.link"
        >
          <v-list-tile-action>
            <v-icon>{{elm.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{elm.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="primary" dark fixed app dense>
      <v-toolbar-side-icon class="hidden-sm-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        Techradar 📡
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat
        v-for="elm in menuItems"
        v-bind:key="elm.title"
        router
        v-bind:to="elm.link"
        >
          <v-icon left>{{elm.icon}}</v-icon>
          {{elm.title}}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false
  }),
  props: {
    source: String
  },
  computed: {
    menuItems: function () {
      const user = this.$store.getters.user || {}
      const items = [
        { icon: 'list', title: 'Blips', link: '/blips', validator: user => user.uid },
        { icon: 'track_changes', title: 'Radar', link: '/', validator: user => true },
        { icon: 'delete', title: 'Deprecated', link: '/deprecated', validator: user => user.uid },
        { icon: 'exit_to_app', title: 'Logout', link: '/logout', validator: user => user.uid },
        { icon: 'people', title: 'Users', link: '/users', validator: user => user.uid && user.roles.admin },
        { icon: 'meeting_room', title: 'Login', link: '/login', validator: user => !user.uid }
      ]
      return items.filter(i => i.validator(user))
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  z-index: 23;
}
.navigation-drawer {
  z-index: 24;
}
</style>
