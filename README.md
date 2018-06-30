# Techradar 📡

> Simple web app to manage your custom tech radar

## Features

- [x] add new blips
- [x] modify blips
- [x] render tech blips on radar
- [x] show blip history
- [x] make radar categories customizable
- [x] oauth (github, twitter)
- [x] authorization
- [ ] setup instructions
  - customization via config
  - database snapshot for import
  - firebase setup + initial auth
- [ ] user name management

## Design

The main part is a static Vue.js application using Firebase as backend and authentication provider.

![design](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/anoff/techradar/master/assets/design.puml)

Database schema

![firestore schema](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/anoff/techradar/master/assets/firestore.puml)

## Attributions

- [Urban Sanden](https://github.com/urre/radar/) @ [MIT](https://github.com/urre/radar/blob/502b57332467e68819ce69eeb65f8432129d69b9/LICENSE)
  - Inspiration for placing the blips
  - parts of his SCSS styles
