<template>
  <v-app id="inspire">
1    <v-navigation-drawer v-model="drawer" app clipped scroll-off-screen="true" scroll-toolbar-off-screen="true">
      <v-list>
        <v-list-tile
        v-for="elm in getMenuItems('navbar')"
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
        {{$config.appTitle}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat
        v-for="elm in getMenuItems('toolbar')"
        v-bind:key="elm.title"
        router
        v-bind:to="elm.link"
        >
          <v-icon left>{{elm.icon}}</v-icon>
          {{elm.title}}
        </v-btn>
        <v-menu bottom left v-if="getMenuItems('toolbar-menu').length">
          <v-btn slot="activator" icon dark>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="elm in getMenuItems('toolbar-menu')" v-bind:key="elm.title" v-bind:to="elm.link" router>
              <v-list-tile-title>
                <v-icon left>{{elm.icon}}</v-icon>
                {{ elm.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
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
  methods: {
    getMenuItems (location) {
      const user = this.$store.getters.user || {}
      const items = this.$config.routes
      return items
        .filter(i => i.validator(user))
        .filter(i => i.location.indexOf(location) > -1)
    }
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
