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
      dense app flat
      color="accent"
      class="github-corner-padding z-30"
    >
    <v-app-bar-nav-icon
      class="hidden-md-and-up"
      data-cy="app-nav-login"
      :data-tour-history="$vuetify.breakpoint.smAndDown"
      :data-tour-login="$vuetify.breakpoint.smAndDown"
      @click="showNavdrawer = !showNavdrawer"
    ></v-app-bar-nav-icon>
      <octocat></octocat>
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
          :data-cy="`app-nav-${elm.name}`"
          :data-tour-login="elm.name === 'login' ? 'true' : ''"
          @click="handleNavClick(elm)">
          <v-icon left>{{elm.icon}}</v-icon>
          <span class="hidden-md-only">{{elm.title}}</span>
        </v-btn>
        <v-btn text
          v-for="elm in toolbarItemsRouter"
          v-bind:key="elm.title"
          router
          v-bind:to="elm.updatedPath"
          :data-cy="`app-nav-${elm.name}`"
          :data-tour-history="elm.name === 'list' ? 'true' : ''"
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
              :data-cy="`app-nav-${elm.name}`"
              @click="handleNavClick(elm)">
              <v-list-item-title>
                <v-icon left>{{elm.icon}}</v-icon>
                {{ elm.title }}
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-for="elm in toolbarMenuItemsRouter"
            v-bind:key="elm.title"
            v-bind:to="elm.updatedPath"
            :data-cy="`app-nav-${elm.name}`"
            router>
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
        class="z-20"
        temporary
      >
        <v-list>
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
          <v-list-item v-for="elm in toolbarItemsStatic.concat(toolbarMenuItemsStatic)"
            v-bind:key="elm.title"
            @click="handleNavClick(elm)">
            <v-list-item-title>
              <v-icon left style="margin-right: 36px">{{elm.icon}}</v-icon>
              {{ elm.title }}
              </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <loading-indicator></loading-indicator>
      <login
        @close="loginModalVisible = false" :visible="loginModalVisible"></login>
      <v-container fluid fill-height class="pa-0">
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
import Intro from '@/components/app/Intro.vue'
import Octocat from '@/components/app/Octocat.vue'

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
  components: { CookieLaw, Login, LoadingIndicator, Intro, Octocat }
})
export default class App extends Vue {
  showNavdrawer = false
  darkMode: boolean = appConfig.theme.dark
  footerEntries: object[] = appConfig.footer
  toolbarItemsRouter: object[] = []
  toolbarMenuItemsRouter: object[] = []
  toolbarItemsStatic: object[] = []
  toolbarMenuItemsStatic: object[] = []
  loginModalVisible = false

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
          (i as any).updatedPath = i.path
            .replace(':radarId', this.radarAlias || this.radarId)
            .replace('/:mode?', '')
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
.z-20 {
  z-index: 20 !important;
}
.z-30 {
  z-index: 30 !important;
}
#progressContainer {
  min-height: 20px;
}
.progress-linear {
  margin: 0;
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
.v-btn--active {
  border-width: 0 0 2px 0;
  border-style: solid;
  border-color: black;
}
.v-btn--active:before {
  opacity: 0 !important;
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
