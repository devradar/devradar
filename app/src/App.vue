<template>
  <v-app fill-height>
    <intro></intro>
    <v-snackbar
      v-model="snackbar.active"
      color="success"
      :timeout="2000"
      >
      <span><v-icon dark left>check</v-icon>{{ snackbar.text }}</span>
    </v-snackbar>
    <v-app-bar
    scroll-off-screen
    dense app
    color="accent"
    class="github-corner-padding z-30"
    >
    <v-app-bar-nav-icon
      class="hidden-md-and-up"
      @click="showNavdrawer = !showNavdrawer"
    ></v-app-bar-nav-icon>
      <a href="https://github.com/anoff/devradar" class="github-corner" aria-label="View source on GitHub" target="_blank">
        <svg width="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: fixed; top: 0; border: 0; right: 0; z-index: 999" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg>
      </a>
      <router-link to="/">
        <v-toolbar-title>
          <img src="devradar-b.svg"
            v-bind:class="{ 'invert-image': darkMode }"
            width="140rem" />
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-title class="hidden-xs-only">
        <span class="radar-title" data-cy="app-title">{{ meta.title }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text
          v-for="elm in toolbarItemsStatic"
          v-bind:key="elm.title"
          :data-cy="`app-nav-static-${elm.name}`"
          @click="handleNavClick(elm)">
          <v-icon left>{{elm.icon}}</v-icon>
          <span class="hidden-md-only">{{elm.title}}</span>
        </v-btn>
        <v-btn text
          v-for="elm in toolbarItemsRouter"
          v-bind:key="elm.title"
          router
          v-bind:to="elm.updatedPath"
          data-cy="app-nav-router"
          >
          <v-icon left>{{elm.icon}}</v-icon>
          <span class="hidden-md-only">{{elm.title}}</span>
        </v-btn>
        <v-menu bottom left
          v-if="(toolbarMenuItemsStatic.length + toolbarMenuItemsRouter.length) > 0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon :dark="darkMode"
              v-bind="attrs"
              v-on="on"
              data-cy="app-nav-toggle">
              <v-icon>more_vert</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="elm in toolbarMenuItemsStatic"
              v-bind:key="elm.title"
              :data-cy="`app-nav-static-${elm.name}`"
              @click="handleNavClick(elm)">
              <v-list-item-title>
                <v-icon left>{{elm.icon}}</v-icon>
                {{ elm.title }}
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-for="elm in toolbarMenuItemsRouter" v-bind:key="elm.title" v-bind:to="elm.updatedPath"
            data-cy="app-nav-router" router>
              <v-list-item-title>
                <v-icon left>{{elm.icon}}</v-icon>
                {{ elm.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-navigation-drawer
        v-model="showNavdrawer"
        absolute
        temporary
      >
        <v-list>
          <v-list-item v-for="elm in toolbarItemsStatic.concat(toolbarMenuItemsStatic)"
            v-bind:key="elm.title"
            @click="handleNavClick(elm)">
            <v-list-item-title>
              <v-icon left>{{elm.icon}}</v-icon>
              {{ elm.title }}
              </v-list-item-title>
          </v-list-item>
          <v-list-item v-for="elm in toolbarItemsRouter.concat(toolbarMenuItemsRouter)"
          v-bind:key="elm.title" v-bind:to="elm.updatedPath"
          router>
            <v-list-item-action>
              <v-icon left>{{elm.icon}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ elm.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <loading-indicator></loading-indicator>
      <login
        @close="loginModalVisible = false" :visible="loginModalVisible"></login>
      <settings
        @close="settingsModalVisible = false" :visible="settingsModalVisible"></settings>
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>
  <cookie-law theme="devradar" data-cy="cookie-banner">
    <div slot="message">
      This website uses cookies to ensure you get the best experience on our website. <a href="https://www.cookiesandyou.com/" target="_blank">Learn more</a>
    </div>
  </cookie-law>
  <v-footer :dark="darkMode" >
    <v-col
      class="text-center"
      cols="12"
    >
    <span v-for="elm in footerEntries" v-bind:key="elm.text" class="entry">
      <a v-if="elm.link" :href="elm.link" target="_blank">{{ elm.text }}</a>
      <span v-else>{{ elm.text }}</span>
    </span>
    </v-col>
  </v-footer>
  </v-app>
</template>

<script lang="ts">
import CookieLaw from 'vue-cookie-law'
import { Component, Vue, Watch } from 'vue-property-decorator'
import appConfig from './config'
import { mapGetters } from 'vuex'
import { Meta, User } from '@/types/domain'
import Login from '@/components/app/Login.vue'
import LoadingIndicator from '@/components/app/LoadingIndicator.vue'
import Settings from '@/components/app/Settings.vue'
import Intro from '@/components/app/Intro.vue'

@Component({
  computed: {
    ...mapGetters('blips', [
      'meta', 'radarAlias', 'radarId'
    ]),
    ...mapGetters('user', [
      'user'
    ]),
    ...mapGetters('comm', [
      'snackbar'
    ])
  },
  components: { CookieLaw, Login, LoadingIndicator, Settings, Intro }
})
export default class App extends Vue {
  showNavdrawer: boolean = false
  darkMode: boolean = appConfig.theme.dark
  footerEntries: object[] = appConfig.footer
  toolbarItemsRouter: object[] = []
  toolbarMenuItemsRouter: object[] = []
  toolbarItemsStatic: object[] = []
  toolbarMenuItemsStatic: object[] = []
  loginModalVisible: boolean = false
  settingsModalVisible: boolean = false

  // computed
  meta: Meta
  radarId: string
  radarAlias: string
  user: User
  snackbar: {
    active: boolean;
    text: string;
  };

  updateToolbarItems () {
    const routes = appConfig.routes
      .filter(i => i.validator(this.user))
      .filter(i => {
        if (i.path && i.path.includes(':radarId') && this.radarId.length === 0) {
          return false
        } else {
          return true
        }
      })
      .map(i => {
        if (i.path) {
          i['updatedPath'] = i.path
            .replace(':radarId', this.radarAlias || this.radarId)
            .replace(':blipName?', '')
        }
        return i
      })
    const navEntries = appConfig.navEntries
      .filter(i => i.validator(this.user))
    this.toolbarItemsRouter = routes
      .filter(i => i.location.includes('toolbar'))
    this.toolbarMenuItemsRouter = routes
      .filter(i => i.location.includes('toolbar-menu'))
    this.toolbarItemsStatic = navEntries
      .filter(i => i.location.includes('toolbar'))
    this.toolbarMenuItemsStatic = navEntries
      .filter(i => i.location.includes('toolbar-menu'))
  }

  handleNavClick (item) {
    if (item.url) {
      window.open(item.url, '_blank')
    } else if (item.action) {
      item.action(this)
    }
  }

  mounted () {
    this.updateToolbarItems()
  }

  @Watch('radarId')
  @Watch('radarAlias')
  @Watch('user')
  radarIdChange () {
    this.updateToolbarItems()
  }
}
</script>

<style lang="scss">
@import '@/assets/intro.scss';
.z-30 {
  z-index: 30 !important;
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
.github-corner-padding {
  padding-right: 80px;
}

span.radar-title {
  font-style: italic;
  padding-right: 0.2rem;
}
.invert-image {
  filter: invert(1);
}

footer .entry:after {
  text-align : center;
  margin : 0 1rem;
  content: "—";
}
footer .entry:last-child:after {
  content: "";
}

// cookie consent component
.Cookie--devradar {
  background: #333;
  color: white;
  padding: 1rem;
  min-height: 2rem;
}
.Cookie--devradar a {
  color: #27db2b !important;
}
.Cookie--devradar .Cookie__button {
  background: white;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 0;
  border: 0;
  font-size: 1em;
  font-weight: bold;
}
.Cookie--devradar div.Cookie__button:hover {
  background: #eee;
}
</style>
