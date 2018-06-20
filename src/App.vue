<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense v-for="menu in menuItems" v-bind:key="menu.title">
        <v-list-tile @click="menu.link">
          <v-list-tile-action>
            <v-icon>{{menu.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{menu.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="primary" dark fixed app>
      <v-toolbar-side-icon class="hidden-sm-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Techradar 📡</v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only" v-for="menu in menuItems" v-bind:key="menu.title">
        <v-btn flat>
          <v-icon left>{{menu.icon}}</v-icon>
          {{menu.title}}
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
      { icon: 'history', title: 'History', link: '' },
      { icon: 'donut_large', title: 'Radar', link: '' },
      { icon: 'delete', title: 'Deprecated', link: '' }
    ]
  }),
  props: {
    source: String
  }
}
</script>
