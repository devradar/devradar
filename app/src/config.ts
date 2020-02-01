import colors from 'vuetify/es5/util/colors'

const config = { // needs to be ES6 module so it can be imported by webpack
  backend: {
    type: process.env.VUE_APP_BACKEND_TYPE || 'testVolatile',
    project: process.env.VUE_APP_BACKEND_PROJECT,
    key: process.env.VUE_APP_BACKEND_KEY
  },
  routes: [ // configure name, permissions & view ports
    { name: 'home', icon: 'home', title: 'Home', path: '/', validator: () => true, location: ['toolbar'] },
    { name: 'list', icon: 'list', title: 'History', path: '/^:radarId', validator: () => true, location: ['toolbar'], props: route => ({ blipName: route.query.q, radarId: route.params.radarId }) },
    { name: 'logout', icon: 'exit_to_app', title: 'Logout', path: '/logout', validator: user => user.uid, location: ['toolbar-menu'] },
    { name: 'users', icon: 'people', title: 'Users', path: '/users', validator: user => user.uid && user.roles.admin, location: ['toolbar-menu'] },
    { name: 'radar', icon: 'track_changes', title: 'Radar', path: '/@:radarId', validator: () => true, location: ['toolbar'] } // due to the wildcard URL this should be the last entry
  ],
  navEntries: [
    { name: 'settings', icon: 'settings', title: 'Settings', action: app => (app.settingsModalVisible = true), validator: user => user.uid, location: ['toolbar-menu'] },
    { name: 'login', icon: 'meeting_room', title: 'Login', action: app => (app.loginModalVisible = true), validator: user => !user.uid, location: ['toolbar'] },
    { name: 'help', icon: 'help', title: 'Help', url: '//docs.devradar.io/about', validator: () => true, location: ['toolbar-menu'] }
  ],
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#0DBD0D',
        secondary: '#ff7700',
        accent: '#0ddd0d',
        error: colors.red.base,
        warning: colors.yellow.base,
        info: colors.blue.base,
        success: colors.green.base
      }
    }
  },
  blips: {
    titleCutOff: 20 // cut off title after N characters (display only)
  },
  googleAnalytics: {
    enabled: false,
    id: 'UA-XYZ'
  },
  footer: [
    { text: 'by Andreas Offenhaeuser',
      link: '//anoff.io' },
    { text: 'Blog',
      link: '//bloganoff.io' },
    { text: 'Legal',
      link: '//anoff.github.io/legal' }
  ],
  radarDefault: {
    categories: [ 'Tools', 'Techniques', 'Platforms', 'Frameworks' ],
    levels: [ 'Hold', 'Assess', 'Trial', 'Adopt' ],
    isPublic: true
  },
  isUnderTest: (!!window['Cypress'])
}

// precalculate some properties for later
config.routes = config.routes
  .map(i => {
    i['rootPath'] = i.path.split(':')[0] // path property without a potential query param
    return i
  })

export default config
