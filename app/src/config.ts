import colors from 'vuetify/es5/util/colors'

const config = { // needs to be ES6 module so it can be imported by webpack
  backend: {
    type: 'firebase',
    project: 'devradario',
    key: 'AIzaSyCv9VSMXxH7aREKGCi_dsHgkK7hYm25j0A'
  },
  editPermissions: user => true,
  routes: [ // configure name, permissions & view ports
    { view: 'Login', icon: 'meeting_room', title: 'Login', path: '/login', validator: user => !user.uid, location: ['toolbar'] },
    { view: 'List', icon: 'list', title: 'History', path: '/list/:search?', validator: user => true, location: ['toolbar'] },
    { view: 'Radar3', icon: 'track_changes', title: 'Radar', path: '/', validator: user => true, location: ['toolbar'] },
    { view: 'Logout', icon: 'exit_to_app', title: 'Logout', path: '/logout', validator: user => user.uid, location: ['toolbar-menu'] },
    { view: 'Users', icon: 'people', title: 'Users', path: '/users', validator: user => user.uid && user.roles.admin, location: ['toolbar-menu'] }
  ],
  navEntries: [
    { icon: 'help', title: 'Help', url: '//devradar.io/howto', validator: user => true, location: ['toolbar-menu'] }
  ],
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#0ddd0d',
        secondary: '#ff7700',
        accent: '#0DBD0D',
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
  }, footer: [
    { text: 'by Andreas Offenhaeuser',
      link: '//anoff.io'},
    { text: 'Blog',
      link: '//bloganoff.io'},
    { text: 'Legal',
      link: '//anoff.github.io/legal'}
  ]
}

// precalculate some properties for later
config.routes = config.routes
  .map(i => {
    i['rootPath'] = i.path.split(':')[0] // path property without a potential query param
    return i
  })

export default config
