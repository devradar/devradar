import colors from 'vuetify/es5/util/colors'

const config = { // needs to be ES6 module so it can be imported by webpack
  backend: {
    type: 'toml',
    blipsUrl: 'devradar.toml'
  },
  editPermissions: user => false,
  routes: [ // configure name, permissions & view ports
    // do NOT change the view property as this links to the vue component and is used for lookups across the app
    { view: 'List', icon: 'list', title: 'Blips', path: '/list/:search?', validator: user => true, location: ['toolbar'] },
    { view: 'Radar3', icon: 'track_changes', title: 'Radar', path: '/', validator: user => true, location: ['toolbar'] }
  ],
  navEntries: [
    { icon: 'help', title: 'Help', url: '//devradar.io/howto', validator: user => true }
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
  footer: [
    { text: 'static devradar deployment',
      link: '//devradar.io'},
    { text: 'fork your own',
      link: '//github.com/anoff/devradar-static'},
    { text: 'made with 💖 by Andreas Offenhaeuser',
      link: '//anoff.io'}
  ]
}

// precalculate some properties for later
config.routes = config.routes
  .map(i => {
    // path property without a potential query param
    Object.assign(i, { rootPath: i.path.split(':')[0] })
    return i
  })

export default config
