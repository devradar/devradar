<template>
  <v-app>
    <v-toolbar class="primary" dark fixed app dense>
      <v-toolbar-title>
        {{$config.appTitle}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat
        v-for="elm in getMenuItems('toolbar')"
        v-bind:key="elm.title"
        router
        v-bind:to="elm.rootPath"
        >
          <v-icon left>{{elm.icon}}</v-icon>
          <span class="hidden-xs-only">{{elm.title}}</span>
        </v-btn>
        <v-menu bottom left v-if="getMenuItems('toolbar-menu').length">
          <v-btn slot="activator" icon dark>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="elm in getMenuItems('toolbar')" v-bind:key="elm.title" v-bind:to="elm.rootPath" class="hidden-sm-and-up" router>
              <v-list-tile-title>
                <v-icon left>{{elm.icon}}</v-icon>
                {{ elm.title }}
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-for="elm in getMenuItems('toolbar-menu')" v-bind:key="elm.title" v-bind:to="elm.rootPath" router>
              <v-list-tile-title>
                <v-icon left>{{elm.icon}}</v-icon>
                {{ elm.title }}
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <div id="progressContainer">
        <v-progress-linear
          height="20"
          color="accent"
          indeterminate
          v-if="loading"
        ></v-progress-linear>
      </div>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
  }),
  methods: {
    getMenuItems (location) {
      const user = this.$store.getters.user || {}
      const items = this.$config.routes
      return items
        .filter(i => i.validator(user))
        .filter(i => i.location.indexOf(location) > -1)
    }
  },
  computed: {
    loading () {
      return this.$store.getters.isLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  z-index: 23;
}
#progressContainer {
  min-height: 20px;
}
.progress-linear {
  margin: 0;
}
</style>
