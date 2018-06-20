<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
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
    <v-toolbar class="primary" dark fixed app>
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
    drawer: false,
    menuItems: [
      { icon: 'history', title: 'History', link: '/history' },
      { icon: 'donut_large', title: 'Radar', link: '/' },
      { icon: 'delete', title: 'Deprecated', link: '/deprecated' }
    ]
  }),
  props: {
    source: String
  }
}
</script>
