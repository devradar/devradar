# devradar

[![Greenkeeper badge](https://badges.greenkeeper.io/anoff/devradar.svg)](https://greenkeeper.io/)
[![Build Status](https://cloud.drone.io/api/badges/anoff/devradar/status.svg)](https://cloud.drone.io/anoff/devradar)

> single page web app to manage your own techradar

<img src="assets/title.png">
<!-- TOC depthFrom:2 -->

- [Features](#features)
  - [Demo](#demo)
- [Design](#design)
- [Create your own](#create-your-own)
  - [Customize](#customize)
  - [Setup](#setup)
- [Attributions](#attributions)

<!-- /TOC -->

A full open source solution to build a custom technology radar as pioneered by [Thoughtworks](https://www.thoughtworks.com/radar).
See [radar-demo.anoff.io](https://radar-demo.anoff.io) for an authentication free test environment.

The master branch of this repository holds a devradar version customized towards showing my [personal technology](https://radar.anoff.io) set.
For building a teams or organizations techradar it might be better to stick with the original _Hold_, _Assess_, _Trial_, _Adopt_ style.

## Features

- [x] add new blips
- [x] modify blips
- [x] render tech blips on radar
- [x] show blip history
- [x] make radar categories customizable
- [x] oauth (github, twitter)
- [x] basic user name management
- [x] choose between firebase & local file backend

### Demo

Here are a few short demos of how the app can be used

*Browse the radar/list view*

![create a blip](assets/demo-viewer.gif)

*Create a new entry*

![create a blip](assets/demo-create.gif)

*Update or delete an entry*

![create a blip](assets/demo-edit_delete.gif)

You can reach an entire demo site where you can try the radar features on [radar-demo.anoff.io](//radar-demo.anoff.io)
## Design

The main part is a static Vue.js application using Firebase as backend and authentication provider.

![design](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/anoff/devradar/master/assets/design.puml)

Database schema

![firestore schema](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/anoff/devradar/master/assets/firestore.puml)

## Create your own

### Customize

All aspects of the radar can be customized via a few files.
In the future I hope to consolidate it into a single configuration file.
The main files to customize are [the config](src/config.js), [the stylesheet](src/assets/radar.scss) and [database security rules](firestore.rules). The latter is only relevant when using the firebase backend.
The **theme colors** together with the labels for **categories** and required **permissions** to access specific resources can be found in the config.

The stylesheet can be modified to change the **radar colors** or the size/responsiveness.

### Setup

See [setup.md](setup.md) for detailed setup instructions.

## Attributions

- [Urban Sanden](https://github.com/urre/radar/) @ [MIT](https://github.com/urre/radar/blob/502b57332467e68819ce69eeb65f8432129d69b9/LICENSE)
  - Inspiration for placing the blips
  - parts of his SCSS styles
