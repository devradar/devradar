<template>
  <v-app>
    <v-snackbar
      v-model="snackbar.active"
      color="success"
      :timeout="2000"
      >
      <span><v-icon dark left>check</v-icon>{{ snackbar.text }}</span>
    </v-snackbar>
    <v-toolbar class="primary top"
    fixed app dense scroll-off-screen
    :dark="$config.darkMode"
    color="accent"
    >
    <v-toolbar-side-icon
    class="hidden-md-and-up"
    @click="showNavdrawer = !showNavdrawer"
    ></v-toolbar-side-icon>
      <a href="https://github.com/anoff/devradar" class="github-corner" aria-label="View source on GitHub" target="_blank"><svg width="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: fixed; top: 0; border: 0; right: 0; z-index: 999" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
      <v-toolbar-title>
        <img src="devradar-b.svg"
        v-bind:class="{ 'invert-image': $config.darkMode }"
        width="140rem">
      </v-toolbar-title>
      <v-toolbar-title class="hidden-xs-only">
        <span class="radar-title">Team Management</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat
        v-for="elm in getNavEntries()"
        v-bind:key="elm.title"
        v-bind:href="elm.url"
        target="_blank"
        >
          <v-icon left>{{elm.icon}}</v-icon>
          <span class="hidden-md-only">{{elm.title}}</span>
        </v-btn>
        <v-btn flat
        v-for="elm in getMenuItems('toolbar')"
        v-bind:key="elm.title"
        router
        v-bind:to="elm.rootPath"
        >
          <v-icon left>{{elm.icon}}</v-icon>
          <span class="hidden-md-only">{{elm.title}}</span>
        </v-btn>
        <v-menu bottom left v-if="getMenuItems('toolbar-menu').length">
          <v-btn slot="activator" icon :dark="$config.darkMode">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
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
      <v-navigation-drawer
        v-model="showNavdrawer"
        absolute
        temporary
      >
        <v-list>
          <v-list-tile v-for="elm in getNavEntries()"
            v-bind:key="elm.title"
            v-bind:href="elm.url"
            target="_blank">
            <v-list-tile-action>
              <v-icon left>{{elm.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ elm.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="elm in getMenuItems('toolbar')" v-bind:key="elm.title" v-bind:to="elm.rootPath" router>
            <v-list-tile-action>
              <v-icon left>{{elm.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ elm.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="elm in getMenuItems('toolbar-menu')" v-bind:key="elm.title" v-bind:to="elm.rootPath" router>
            <v-list-tile-action>
              <v-icon left>{{elm.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ elm.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-dialog
        v-model="isLoading"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
            Loading radar..
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  data: () => ({
    showNavdrawer: false,
    isLoading: false
  }),
  methods: {
    getMenuItems (location) {
      const user = this.$store.getters.user || {}
      const items = this.$config.routes
      return items
        .filter(i => i.validator(user))
        .filter(i => i.location.indexOf(location) > -1)
    },
    getNavEntries () {
      const user = this.$store.getters.user || {}
      const items = this.$config.navEntries
      return items
        .filter(i => i.validator(user))
    }
  },
  computed: {
    snackbar () {
      return this.$store.getters['comm/snackbar']
    }
  }
}
</script>

<style lang="scss" scoped>
nav.v-toolbar {
  z-index: 10;
  padding-right: 3rem !important;
}
#progressContainer {
  min-height: 20px;
}
.progress-linear {
  margin: 0;
}
.github-corner:hover .octo-arm{
  animation:octocat-wave 560ms ease-in-out
}
@keyframes octocat-wave{
  0%,100%{transform:rotate(0)}
  20%,60%{transform:rotate(-25deg)}
  40%,80%{transform:rotate(10deg)}
}
@media (max-width:500px){
  .github-corner:hover .octo-arm{animation:none}
  .github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}
}
span.radar-title {
  font-style: italic;
  padding-right: 0.2rem;
}
.invert-image {
  filter: invert(1);
}
</style>
