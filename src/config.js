const {default: colors} = require('vuetify/es5/util/colors')

const config = { // needs to be ES6 module so it can be imported by webpack
  blips: {
    titleCutOff: 20 // cut off title after N characters (display only)
  },
  categories: ['Tools', 'Cloud Technologies', 'Backend', 'Datascience'], // quadrant 1-4
  states: ['Hold', 'Assess', 'Trial', 'Adopt', 'Basics', 'Deprecated'], // should be 0 - 3 for tech radar, 4 for in use, 5 for no longer in use
  metaTitle: 'anoff\'s Techradar', // meta information title tag
  appTitle: 'Tech I work with 🔧', // title showing in the application titlebar
  routes: [ // configure name, permissions & viewports
    // do NOT change the view property as this links to the vue component and is used for lookups across the app
    { view: 'List', icon: 'list', title: 'Blips', path: '/list/:search?', validator: user => user.uid, location: ['navbar', 'toolbar'] },
    { view: 'Radar', icon: 'track_changes', title: 'Radar', path: '/', validator: user => true, location: ['navbar', 'toolbar'] },
    { view: 'Logout', icon: 'exit_to_app', title: 'Logout', path: '/logout', validator: user => user.uid, location: ['navbar', 'toolbar-menu'] },
    { view: 'Users', icon: 'people', title: 'Users', path: '/users', validator: user => user.uid && user.roles.admin, location: ['navbar', 'toolbar-menu'] },
    { view: 'Login', icon: 'meeting_room', title: 'Login', path: '/login', validator: user => !user.uid, location: ['navbar', 'toolbar'] }
  ],
  theme: {
    primary: colors.cyan.darken1,
    secondary: colors.teal.darken1,
    accent: colors.purple.lighten2,
    error: colors.red.base,
    warning: colors.yellow.base,
    info: colors.blue.base,
    success: colors.green.base
  }
}

// precalculate some properties for later
config.routes = config.routes
  .map(i => {
    i.rootPath = i.path.split(':')[0] // path property without a potential query param
    return i
  })
module.exports = config
