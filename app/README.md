<p align="center">
  <img src="../assets/logo-text.png">
  <br>
  Track and manage skills as an individual and manage competences across a team.
</p>

[![License](https://badgen.net/badge/license/MIT/blue)](LICENSE)
[![License check](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fanoff%2Fdevradar.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fanoff%2Fdevradar?ref=badge_shield)
[![Build Status](https://github.com/anoff/devradar/workflows/devradar/badge.svg)](https://github.com/anoff/devradar/actions)
[![Cypress.io tests](https://img.shields.io/badge/cypress.io-E2E%20Tests-brightgreen.svg)](https://dashboard.cypress.io/#/projects/gumn5q/runs)

[![Gitter](https://badgen.net/badge/chat/on%20gitter/cyan?icon=gitter)](https://gitter.im/devradar/discuss)
[![Dependabot status](https://badgen.net/dependabot/dependabot/dependabot-core/?icon=dependabot)](https://dependabot.com/)
[![VueJS](https://badgen.net/badge/built%20with/Vue.js/cyan)](https://vuejs.org/)
[![TypeScript](https://badgen.net/badge/code/TypeScript/blue)](https://www.typescriptlang.org/)
[![Standard](https://badgen.net/badge/code%20style/standard/pink)](https://standardjs.com/)

# Development

The project is built with the `vue-cli` and for local development you need to have Node.js installed. Please follow the official [Node.js download](https://nodejs.org/en/) instructions.

With `node` available on your system just install all the dependencies of the devradar using

```sh
npm install
```

## Starting local server

By default the local server runs with a local backend that provides functionality to develop and test features.
You can find the available data in the `src/backend/test-volatile/mock-data` folder, the `testVolatile` backend tries to mimick the behavior of firebase so that `dispatch()` calls behave the same but return mock data instead of talking to a real backend.

This is also used during end-to-end tests on the CI server and the database may get whiped regularly.
If your local development requires you to have access to the database, please set up your own firebase project and set your credentials via environment variables during runtime; set `VUE_APP_BACKEND_TYPE` to `firebase` and provide `VUE_APP_BACKEND_PROJECT` and `VUE_APP_BACKEND_KEY` variables either by setting ENV or adding a [`.env`](https://www.npmjs.com/package/dotenv) file in `app/.env`.

## Code Style

Devradar follows Typescript with StandardJS-flavor codestyle. Please validate your code locally before pushing by running `npm run lint && npm run build`. This will also trigger a build to ensure that the code also passes the Typescript compiler.
At the moment warnings are ignored, but in the future stricter Typescript rules may be inforced so please try to remove warnings as well where the current situation allows it.

## Tests

Currently only End to End browser tests are implemented using [cypress](https://cypress.io).
New test cases for additional features or identified bugs are highly welcome.
To perform e2e tests locally please run

```sh
# start server in development mode (continuously running process)
npm run serve
# in a second shell start the cypress UI
npm run test:e2e
# in the UI you can run selected test cases or the entire test suite
```

The tests are also run in CI using the `testVolatile` backend.
It is planned to create a E2E firebase environment to test complete behavior of the app with the actual database.
